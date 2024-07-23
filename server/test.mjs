import Ffmpeg from "fluent-ffmpeg";
import fs from 'fs';
import path from "path";

const stream = fs.createReadStream(path.resolve(process.cwd(), 'videos/20240723194924.webm'));
const file = fs.createWriteStream(path.resolve(process.cwd(), './a.h264'));

Ffmpeg(stream)
  .videoCodec('copy')  // Copy the video stream without re-encoding
  .toFormat('h264')
  .on('data', () => {
    console.log('---------------Ffmpeg data frame...--------------');
  })      // Force output to raw H.264
  .on('end', () => {
    console.log('Extraction finished');
  })
  .on('error', (err) => {
    console.error('Error:', err);
  })
  .saveToFile(path.resolve(process.cwd(), './a.h264'))