const { ipcMain } = require('electron')


const { send: sendMainWindow } = require('./window/main')
const { create: createControlWindow, send: sendControlWindow } = require('./window/control')
const signal = require('./signal')

function handleIpc() {
    ipcMain.handle('login', async () => {
        let { code } = await signal.invoke('login', null, 'logined')
        return code
    })
    ipcMain.on('control', async (e, remoteCode) => {
        signal.send('control', { remote: remoteCode })
        sendMainWindow('control-state-change', remoteCode, 1)
        // createControlWindow()
    })

    signal.on('controlled', data => {
        createControlWindow()
        sendMainWindow('control-state-change', data.remote, 1)
    })

    signal.on('be-controlled', data => {
        sendMainWindow('control-state-change', data.remote, 2)
    })

    ipcMain.on('forward', (e, event, data) => {
        signal.send(event, data)
    })

    signal.on('offer', (data, code) => {
        console.log('offerhere');
        sendMainWindow('offer', data, code)
    })

    signal.on('answer', data => {
        console.log('answer');
        sendControlWindow('answer', data)
    })


    

    // signal.on('puppet-candidate', data => {
    //     console.log('puppet-condidate---------');
        
    //     sendControlWindow('candidate', data)
    // })

    signal.on('control-candidate', data => {
        console.log('control-candidate');
        console.log("control-candidate-data",data);
        sendMainWindow('control-candidate', data)
    })
}

module.exports = handleIpc