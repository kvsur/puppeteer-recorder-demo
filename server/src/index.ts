// import dgram from 'dgram';
import { PuppeteerRecorder } from './recorder';
import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
// import params from './secret.test.json';
import params from './secret.prod.json';
import logger from './utils/logger';
// import {} from 'express-ws'

const url  = `http://localhost:5173?${Object.entries(params).map(([key, val]) => `${key}=${val}`).join('&')}`;

logger.info(url);
const REMOTE_UDP_HOST = '192.168.5.243';
const REMOTE_UDP_PORT = 51234;

async function main() {
  const app = express();
  const port = 9012;

  const server = http.createServer(app).listen(port);
  // app.listen(port, () => {
  //   logger.info(`Http server by express listening on port ${port}.`);
  // });

  // app.addListener('')

  const socketServer = new WebSocketServer({
    // port: 9013,
    server,
  });

  socketServer.addListener('connection', (client, req) => {
    logger.info(`SocketServer connenction connected...`);
    console.log(client, req);

    // socketServer.addListener('')

    setTimeout(() => {
      client.close();
    }, 3000 * 1);
  });

  socketServer.addListener('close', () => {
    logger.info(`SocketServer connenction closed...`);
  });
  
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
      url
    });
  
    // const clientSocket = dgram.createSocket('udp4');
    // clientSocket.send();
    const stream = await recorder.recordWithStream(page, chunk => {

      logger.info('Total chunk size: --- ', chunk.length);

      function send(ck) {
        logger.info('                |---- ', ck.length);
        // clientSocket.send(ck, REMOTE_UDP_PORT, REMOTE_UDP_HOST, (error) => {
        //   if (error) {
        //     console.error(error);
        //     logger.info('UDP 数据包发送失败')
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
