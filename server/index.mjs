import { launch, getStream } from "puppeteer-stream";
import fs from "fs";
import path from 'path';
// require executablePath from puppeteer
import { executablePath } from 'puppeteer';

class PuppeteerRecorder {
  constructor() {
    this.browser = null;
    this.page = null;
    this.file = null;
    this.stream = null;
    this.address = `http://localhost:5173/`;
    this.filePath = path.resolve(process.cwd(), 'videos');
    
    console.log(`ExecutablePath: ----- ${executablePath()} -------`)
  }

  async init() {
    let width = 430,
      height = 932;
    this.browser = await launch({
      headless: false, 
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=${width},${height}`,
        "--autoplay-policy=no-user-gesture-required",
        // '--remote-debugging-port=3333',
        // "--auto-open-devtools-for-tabs",
      ],
      defaultViewport: {
        width: 0,
        height: 0,
      },
      ignoreDefaultArgs: ["--disable-extensions", "--mute-audio"],
      executablePath: executablePath(),
    });

    this.browser.on('disconnected', () => {
      console.log('This browser closeed...');
      this.destroy();
    });

    let [page] = await this.browser.pages();
    this.page = page;
    await page.goto(this.address, { waitUntil: "networkidle0" });

    // dom 操作
    // await page.waitForSelector('button[role="xxx"]', { visible: true });
    // await page.click('button[role="xxx"]', page.waitForNavigation({ waitUntil: "networkidle2" }));

    this.stream = await getStream(this.page, {
      audio: true,
      video: true,
      frameSize: 20,
    });
  
    this.file = fs.createWriteStream(`${this.filePath}/${Math.random().toString(36).slice(2)}.webm`);
    this.stream.pipe(this.file);

    setTimeout(() => {
      this.destroy();
    }, 20 * 1000);
  }

  destroy() {
    this.stream.end();
    this.file.end();
    // this.stream.close
    this.file.close();
    process.exit(0);
  }
}

const recorder = new PuppeteerRecorder();

recorder.init();
