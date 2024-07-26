import { launch, getStream, getStreamOptions } from "puppeteer-stream";
import fs from "fs";
import path from 'path';
// require executablePath from puppeteer
import { Browser, executablePath, Page } from 'puppeteer-core';
import internal, { Writable } from "stream";
// import Ffmpeg from "fluent-ffmpeg";
// import { Transform, PassThrough } from 'node:stream';

interface Options { windowConfig?: { width: number; height: number }; pageUrl?: string; }
interface PageOpts { url?: string }

export class PuppeteerRecorder {
  private browser: Browser = null;
  private page: Page = null;
  private stream: internal.Transform = null;
  private address: string = 'http://localhost:5173/';
  private filePath: string;
  private windowConfig: Options['windowConfig'] = { width: 430, height: 932 };

  constructor(opts: Options = { }) {
    this.address = opts.pageUrl || this.address;
    // this.address = `https://znkfdemo.wewecall.com:20080/saashcswebapp/pc?source=phone_kefu_89001713_1699607160103&company_code=81000916&company_id=81000916&auxiliary_seat=phone_kefu_81000916_1663552286044&entry_type=ktest&recommend_type=common&ans_channel=other&appId=864f5a859302468a841ed7b124d30177&appSecret=b04d6a5642ab4f99bf9f34addf87a3d3&roleId=5654722482f5422487c2c6ce73b03874`;
    this.filePath = path.resolve(process.cwd(), 'videos');
    fs.mkdirSync(this.filePath, { recursive: true })

    /** @type { KnownDevices } */
    // this.device = KnownDevices['iPhone 15 Pro'];

    this.windowConfig = opts.windowConfig || this.windowConfig;
    
    console.log(`ExecutablePath: ----- ${executablePath()} -------`)
  }

  async init() {
    this.browser = await launch({
      // headless: "new", 
      headless: false, 
      devtools: true,
      args: [
        // "--disable-web-security", // CORS relative
        "--no-sandbox",
        "--disable-setuid-sandbox",
        `--window-size=${this.windowConfig.width},${this.windowConfig.height}`,
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

    // Get this first blank page and close it.
    const [page] = await this.browser.pages();
    await page.close();

    // this.browser.on('disconnected', () => {
    //   console.log('This browser closeed...');
    //   this.destroy();
    // });
  }

  async recordWithStream(page: Page, onChunk: (chunk: Uint8Array) => void): Promise<internal.Transform> {
    const config = {
      audio: true,
      video: true,
      frameSize: 40,
      // bitsPerSecond: 16000,
      // videoBitsPerSecond: 40 * 16000,
      // audioBitsPerSecond: 8000 * 4,
      mimeType: 'video/webm;codecs="h264"',
    };
    const stream = await getStream(page, config as getStreamOptions);

    const file = fs.createWriteStream(`${this.filePath}/${generateFilename()}.webm`);
    stream.addListener('data', (chunk) => {
      onChunk(chunk);
      // file.write(chunk);
    });

    stream.pipe(file);

    // const audioPassthrough = new PassThrough();
    // const audioName = `${generateFilename()}.wav`;
    // const audioStream = fs.createWriteStream(path.resolve(process.cwd(), audioName));

    // audioPassthrough.addListener("data", (chunk) => {
    //   console.log("Audio wav 文件流写入到文件--", audioName, "chunk size：", chunk.length)
    //   audioStream.write(chunk);
    // });

    // audioPassthrough.addListener('end', () => {
    //   audioStream.end();
    // });

    // const videoPassthrough = new PassThrough();
    // const videoName = `${generateFilename()}.h264`;
    // const videoStream = fs.createWriteStream(path.resolve(process.cwd(), videoName));
    
    // videoPassthrough.addListener("data", (chunk) => {
    //   console.log("Video h264 文件流写入到文件--", videoName, "chunk size：", chunk.length)
    //   videoStream.write(chunk);
    // });

    // videoPassthrough.addListener('end', () => {
    //   videoStream.end();
    // });

    // Ffmpeg(this.stream)
    //   .noVideo()
    //   .audioCodec('pcm_mulaw')
    //   .toFormat('wav')
    //   .on('end', () => {
    //     console.log('Extraction audio finished');
    //   })
    //   .on('error', (err) => {
    //     console.error('Audio Error:', err);
    //   })
    //   .stream(audioPassthrough);

    //   Ffmpeg(this.stream)
    //     .noAudio()
    //     .videoCodec('libx264')
    //     .toFormat('h264')
    //     .on('end', () => {
    //       console.log('Extraction video finished');
    //     })
    //     .on('error', (err) => {
    //       console.error('Video Error:', err);
    //     })
    //     .stream(videoPassthrough);

    // stream.addListener("end", () => {
    //   // audioPassthrough.end();
    //   // videoPassthrough.end();
    //   console.log('---------------Stream closeed.--------------');
    // });

    stream.addListener('end', () => {
      console.log('---------------Stream closeed.--------------');
      file.close();
    });

    return (this.stream = stream);
  }

  async createPage(opts: PageOpts = {}) {
    const page = await this.browser.newPage();
    await page.goto(opts.url || this.address, { waitUntil: "networkidle0" });
    // await page.evaluate(`document.title = "https://www.pornhub.com"`);

    // dom 操作
    // await page.waitForSelector('button[role="xxx"]', { visible: true });
    // await page.click('button[role="xxx"]', page.waitForNavigation({ waitUntil: "networkidle2" }));

    return (this.page = page);
  }

  async destroy() {
    try {
      this.stream.end();
      await this.page.close();
      await this.browser.close();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

function generateFilename(): string {
  return new Date()
    .toLocaleString('zh-CN')
    .replace(/[\/\s:]/g, '-')
    .replace(/(?<=-)(\d)(?=-)/g, (str) => `0${str}`)
    .replace(/-/g, '') + '.' + Math.random().toString(36).slice(2);
}