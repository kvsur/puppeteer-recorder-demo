import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Virtual3D from './components/3D.tsx'
import SocketTest from './components/SocketTest.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Fragment>
    {/* <Virtual3D /> */}
    {'Virtual3D Components type is: ' + typeof Virtual3D}
    <SocketTest />
  </React.Fragment>,
)
