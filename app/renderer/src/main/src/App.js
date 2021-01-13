import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import './peer-puppet.js'
var controller = 0

const { ipcRenderer } = window.require('electron')

function App() {
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  const [controlText, setControlText] = useState('')
  const login = async () => {
    let code = await ipcRenderer.invoke('login')
    setLocalCode(code)
  }
  useEffect(() => {
    login()
    ipcRenderer.on('control-state-change', handleControlStateChange)
    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlStateChange)
    }
  }, [])

  const handleControlStateChange = (e, name, type) => {
    controller = name

    let text = ''
    if (type === 1) {
      text = '正在远程控制' + name
    } else if (type === 2) {
      text = `正在被${name}控制中`
    }
    setControlText(text)
  }

  const startControl = remoteCode => {
    ipcRenderer.send('control', remoteCode)
  }

  return (
    <div className="App">
      {
        controlText === '' ?
          (<>
            <div> 你的控制码为{localCode}</div>
            <input type="text" value={remoteCode} onChange={(e) => { setRemoteCode(e.target.value) }} />
            <button onClick={() => { startControl(remoteCode) }}>确认</button>
          </>) :
          (
            <>
              <div>
                {controlText}
              </div>
            </>
          )
      }
    </div>
  );
}

export default App;
