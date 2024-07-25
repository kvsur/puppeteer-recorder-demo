import { useEffect, useRef, useState } from "react"
import mp4 from './assets/sample.mp4';

function App() {
  const video = useRef<HTMLVideoElement>(null);

  const timer = useRef<number | undefined>();

  const [startDate] = useState(new Date().toLocaleString('zh-CN'));

  useEffect(() => {
    video.current?.play();

    timer.current = setInterval(() => {
      setCount(pre => pre + 1);
    }, 1000);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  const [counter, setCount] = useState<number>(0);

  function playOrPause() {
    if (video.current?.paused) {
      video.current.play();
      timer.current = setInterval(() => {
        setCount(pre => pre + 1);
      }, 1000);
    } else {
      video.current?.pause();
      clearInterval(timer.current);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <video ref={video} style={{ width: '100vw', height: 'auto' }} loop>
        <source src={mp4} />
      </video>

      <button onClick={playOrPause}>⏸/▶</button>
      <p style={{ textAlign: 'center' }}>{counter}</p>
      <p>This page start at {startDate}</p>
    </div>
  )
}

export default App
