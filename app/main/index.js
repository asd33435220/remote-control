const { app, BrowserWindow, ipcMain } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')
const handleIpc = require('./ipc')
const {create:createMainWindow} = require('./window/main')
// const { create: createControlWindow } = require('./window/control')


app.on('ready', () => {
    createMainWindow()
    handleIpc()
    require('./robot.js')()
})
