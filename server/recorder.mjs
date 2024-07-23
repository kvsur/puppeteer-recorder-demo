import { launch, getStream } from "puppeteer-stream";
import fs from "fs";
import path from 'path';
// require executablePath from puppeteer
import { executablePath, KnownDevices } from 'puppeteer';
import { Browser } from "puppeteer";
import { Page } from "puppeteer";
import internal, { Writable } from "stream";
import Ffmpeg from "fluent-ffmpeg";
import { Transform, PassThrough } from 'node:stream';


/**
 * @typedef {{ url: string }} PageOpts
 * @typedef {{ windowConfig?: { width: number; height: number }; pageUrl: string; }} Options
 */

export class PuppeteerRecorder {
  /**
   * @param {Options?} opts
   */
  constructor(opts) {
    opts = opts || {};
    /** @type {Browser} */
    this.browser = null;
    /** @type { Page } */
    this.page = null;
    /** @type {fs.WriteStream} */
    this.file = null;
    /** @type {internal.Transform} */
    this.stream = null;
    this.address = opts.pageUrl || `http://localhost:5173/`;
    // this.address = `https://znkfdemo.wewecall.com:20080/saashcswebapp/pc?source=phone_kefu_89001713_1699607160103&company_code=81000916&company_id=81000916&auxiliary_seat=phone_kefu_81000916_1663552286044&entry_type=ktest&recommend_type=common&ans_channel=other&appId=864f5a859302468a841ed7b124d30177&appSecret=b04d6a5642ab4f99bf9f34addf87a3d3&roleId=5654722482f5422487c2c6ce73b03874`;
    this.filePath = path.resolve(process.cwd(), 'videos');
    fs.mkdirSync(this.filePath, { recursive: true })

    /** @type { KnownDevices } */
    // this.device = KnownDevices['iPhone 15 Pro'];

    this.windowConfig = opts.windowConfig || { width: 430, height: 932 };
    
    console.log(`ExecutablePath: ----- ${executablePath()} -------`)
  }

  async init() {
    this.browser = await launch({
      headless: "new", 
      // headless: false, 
      args: [
        // "--disable-web-security", // CORS relative
        "--devtool",
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

    // this.browser.on('disconnected', () => {
    //   console.log('This browser closeed...');
    //   this.destroy();
    // });
  }

  /**
   * 
   * @param {(chunk: Uint8Array) => void} onChunk 
   * @param {() => void} onEnd
   */
  async recordWithStream(onChunk, onEnd = () => {}) {
    this.stream = await getStream(this.page, {
      audio: true,
      video: true,
      frameSize: 40,
      // bitsPerSecond: 16000,
      // videoBitsPerSecond: 40 * 16000,
      // audioBitsPerSecond: 8000 * 4,
      mimeType: 'video/webm;codecs="h264"',
    });

    this.file = fs.createWriteStream(`${this.filePath}/${generateFilename()}.webm`);
    this.stream.addListener('data', (chunk) => {
      onChunk(chunk);
      // this.file.write(chunk);
    });

    const audioPassthrough = new PassThrough();
    const audioName = `${generateFilename()}.wav`;
    const audioStream = fs.createWriteStream(path.resolve(process.cwd(), audioName));

    audioPassthrough.addListener("data", (chunk) => {
      console.log("Audio wav 文件流写入到文件--", audioName, "chunk size：", chunk.length)
      audioStream.write(chunk);
    });

    audioPassthrough.addListener('end', () => {
      audioStream.end();
    });

    const videoPassthrough = new PassThrough();
    const videoName = `${generateFilename()}.h264`;
    const videoStream = fs.createWriteStream(path.resolve(process.cwd(), videoName));
    
    videoPassthrough.addListener("data", (chunk) => {
      console.log("Video h264 文件流写入到文件--", videoName, "chunk size：", chunk.length)
      videoStream.write(chunk);
    });

    videoPassthrough.addListener('end', () => {
      videoStream.end();
    });

    Ffmpeg(this.stream)
      .noVideo()
      .audioCodec('pcm_mulaw')
      .toFormat('wav')
      .on('end', () => {
        console.log('Extraction audio finished');
      })
      .on('error', (err) => {
        console.error('Audio Error:', err);
      })
      .stream(audioPassthrough);

      Ffmpeg(this.stream)
        .noAudio()
        .videoCodec('libx264')
        .toFormat('h264')
        .on('end', () => {
          console.log('Extraction video finished');
        })
        .on('error', (err) => {
          console.error('Video Error:', err);
        })
        .stream(videoPassthrough);

    this.stream.addListener("end", () => {
      onEnd();
      // audioPassthrough.end();
      // videoPassthrough.end();
      console.log('---------------Stream closeed.--------------');
    });
  
    this.stream.pipe(this.file);

    setTimeout(() => {
      this.destroy();
    }, 5 * 1000);
  }

  /**
   * 
   * @param { PageOpts } opts 
   */
  async createPage(opts) {
    // let [page] = await this.browser.pages();
    const page = await this.browser.newPage();
    // page.title
    // await this.browser.newPage();
    this.page = page;
    // await page.emulate(this.device);
    await page.goto(this.address, { waitUntil: "networkidle0" });
    await page.evaluate(`document.title = "https://www.pornhub.com"`);

    // dom 操作
    // await page.waitForSelector('button[role="xxx"]', { visible: true });
    // await page.click('button[role="xxx"]', page.waitForNavigation({ waitUntil: "networkidle2" }));
    // this.recordWithStream();
  }

  async destroy() {
    this.stream.end();
    // this.file.end();
    // this.stream.close
    // this.file.close();
    await this.page.close();
    await this.browser.close();
    // process.exit(0);
  }
}

/**
 * @returns {string}
 */
function generateFilename() {
  return new Date()
    .toLocaleString('zh-CN')
    .replace(/[\/\s:]/g, '-')
    .replace(/(?<=-)(\d)(?=-)/g, (str) => `0${str}`)
    .replace(/-/g, '');
}

// const recorder = new PuppeteerRecorder();

// recorder.init();

// console.log('aass')