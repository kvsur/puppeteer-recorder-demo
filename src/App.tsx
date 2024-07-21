import { useEffect, useRef, useState } from "react"
import mp4 from './assets/sample.mp4';

let timer: number | undefined;

function App() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    video.current?.play();

    timer = setInterval(() => {
      setCount(pre => pre + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const [counter, setCount] = useState<number>(0);

  function playOrPause() {
    video.current?.paused && video.current.play() || video.current?.pause();
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <video ref={video} style={{ width: '100vw', height: 'auto' }} src={mp4} loop />

      <button onClick={playOrPause}>⏸/▶</button>
      <p style={{ textAlign: 'center' }}>{counter}</p>
    </div>
  )
}

export default App
