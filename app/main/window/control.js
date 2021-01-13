const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let controlWin
function create() {
    controlWin = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })
    controlWin.loadFile(path.resolve(__dirname, '../../renderer/pages/control/index.html'))
    controlWin.openDevTools()

}
function send(channel, ...args) {
    controlWin.webContents.send(channel, ...args)
}
module.exports = { create, send }
