import dgram from 'dgram';
import { PuppeteerRecorder } from './recorder';
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
// import paramsProd from '../secret.prod.json';
// import paramsTest from '../secret.test.json';
// import {} from 'express-ws'

const REMOTE_UDP_HOST = '192.168.5.243';
const REMOTE_UDP_PORT = 51234;

async function main() {
  const app = express();
  const port = 9012;

  const server = http.createServer(app);
  app.listen(port, () => {
    console.log(`Http server by express listening on port ${port}.`);
  });

  // new WebSocketServer({
  //   server,
  // });
  
  app.get('/udp_test', (req, res) => {
    res.status(200);
    res.end('Call UDP test function success');
    udpTest();
  });

  /**
   * @todo 这里暂时使用一通会话开一个浏览器的方案，后续进行优化（puppeteer-cluster)
   */
  async function udpTest() {
    const recorder = new PuppeteerRecorder({});
  
    await recorder.init();
    const page = await recorder.createPage({
      url: `http://localhost:5173?${Object.entries({}).map(([key, val]) => `${key}=${val}`).join('&')}`
    });
  
    const clientSocket = dgram.createSocket('udp4');
    // clientSocket.send();
    const stream = await recorder.recordWithStream(page, chunk => {

      console.log('Total chunk size: --- ', chunk.length);

      function send(ck) {
        console.log('                |---- ', ck.length);
        // clientSocket.send(ck, REMOTE_UDP_PORT, REMOTE_UDP_HOST, (error) => {
        //   if (error) {
        //     console.error(error);
        //     console.log('UDP 数据包发送失败')
        //   }
        // })
      }
      while (chunk.length > 0) {
        const tempChunk = chunk.slice(0, 9012);
        chunk = chunk.slice(tempChunk.length)
        send(tempChunk);
      }
      
    });

    setTimeout(() => {
      recorder.destroy();
    }, 500 * 1000);
  }
}

main();
