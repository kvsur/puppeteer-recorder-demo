import dgram from 'dgram';
import { PuppeteerRecorder } from './recorder.mjs';
import express from 'express';

const app = express();
const port = 9012;

app.get('/udp_test', (req, res) => {
  main();
  res.status(200);
  res.end('Call UDP test function success');
});

app.listen(port, () => {
  console.log(`Http server by express listening on port ${port}.`);
});

const REMOTE_UDP_HOST = '192.168.5.243';
const REMOTE_UDP_PORT = 51234;


async function main() {
  // clientSocket.bind(9012);
  
  const recorder = new PuppeteerRecorder();
  
  await recorder.init();
  
  await recorder.createPage();
  
  const clientSocket = dgram.createSocket('udp4');
  // clientSocket.send();
  recorder.recordWithStream(/** @params { Uint8Array } */ chunk => {

    console.log('Total chunk size: --- ', chunk.length);

    function send(ck) {
      console.log('                |---- ', ck.length);
      clientSocket.send(ck, REMOTE_UDP_PORT, REMOTE_UDP_HOST, (error) => {
        if (error) {
          console.error(error);
          console.log('UDP 数据包发送失败')
        }
      })
    }
    while (chunk.length > 0) {
      const tempChunk = chunk.slice(0, 9012);
      chunk = chunk.slice(tempChunk.length)
      // send(tempChunk);
    }
    
  }, () => {
    try {
      // clientSocket.disconnect();
      clientSocket.close();
    } catch (error) {
      console.error(error);
    }
  });
}

// main();
