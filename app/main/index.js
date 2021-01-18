const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const handleIpc = require('./ipc')
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require('./window/main')
// const { create: createControlWindow } = require('./window/control')
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('secone-instance', () => {
        showMainWindow()
    })
    app.on('ready', () => {
        createMainWindow()
        handleIpc()
        require('./robot.js')()
        require('./trayAndMenu/index')
    })
    app.on('before-quit', () => {
        closeMainWindow()
    })
    app.on('activate',()=>{
        showMainWindow()
    })

}

app.on('ready', () => {
    createMainWindow()
    handleIpc()
    require('./robot.js')()
    require('./trayAndMenu/index')
})

