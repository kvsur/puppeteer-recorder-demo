import { useEffect, useRef, useState } from "react";
// import { InitSDK, Ability } from '@vtuber/ThreeSDK';
import { InitSDK, Ability } from '../lib';

// 线上wsURL: 'wss://avatar-ws.aicubes.cn:8443'
// 测试环境wsURL: 'ws://172.19.80.69:8086'

function getParam(key: string): string {
  const params: Record<string, string> = {};
  for (const [key, value] of new URL(location.href).searchParams.entries()) {
    params[key] = value;
  }

  return params[key];
}

const sdk = new InitSDK(getParam('appSecret'), getParam('appId'), '/vtuber', 'wss://avatar-ws.aicubes.cn:8443');

function Virtual3D() {

  const engineRef = useRef<Ability | undefined>();

  const canvas = useRef<HTMLCanvasElement | null>(null);

  const stopRef = useRef<(() => void) | null>(() => {});

  useEffect(() => {
    initial();

    return () => {
      destroy();
    };
  }, []);

  function destroy() {
    engineRef.current?.quit();
    engineRef.current?.closeWS();
  }

  async function initial() {
    let engine: Ability;
    // if (sdk.instance && false) {
    //   engineRef.current = engine = sdk.instance;
    // } else {
    const e = await sdk.initEngine({
      canvas: canvas.current as HTMLCanvasElement,
      errorCallback: (error) => {
        console.error(error);
      }
    });

    engineRef.current = engine = e as Ability;

    engine.caption?.changeCaptionStatus(false);
    // }

    const list = await engine.getVtuberList();

    await engine.createVtuberById(list.find(item => item.roleId === getParam('roleId'))?.id as number, true);

    window.engine = engine;

    // engine.sendMessage('你是，我是李成，你是青鑫林么？如果你是的话就点点头。').then(res => {
    //   res.play();
    // });

    engine.addWSCallback(({ play, stop }) => {
      stopRef.current = stop as () => void;
      play(false, (data) => {
        console.log(data);
        console.log('虚拟人开始播放音频。。。');
      }, () => {
        console.log('---------虚拟人完成音频播放。。。');
      });
    });

    if (getParam('headless') === 'true') {
      engine.sendWSText('你好啊，今天天气不错，要不要一起出去玩一玩？');
    }

  }

  const [text, setText] = useState('');
  function playText() {
    engineRef.current?.sendWSText?.(text, {
      volume: 20
    });
    setText('');
  }

  function abort() {
    // engineRef.current?.resetWS();
    stopRef.current?.();
    engineRef.current?.resetWS();
  }

  return (
    <main style={{ width: '100vw', height: '100vh' }}>
      <canvas ref={canvas} style={{ width: '100%', height: '100%' }} />
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        <input style={{ width: '100vw', height: '32px' }} type="text" value={text} onChange={e => setText(e.target.value)} />
        <button onClick={playText}>Play</button>
        <button onClick={abort}>Abort</button>
        <button onClick={destroy}>Destroy Page</button>
      </div>
    </main>
  );
}

export default Virtual3D;
