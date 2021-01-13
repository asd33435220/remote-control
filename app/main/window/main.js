const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win
function create() {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        }
    })
    console.log(isDev);

    if (isDev) {
        win.loadURL('http://localhost:3000')
    } else {
        win.loadURL(path.resolve(__dirname, '../renderer/pages/control/index.html'))
    }
    win.openDevTools()

}
function send(channel, ...args) {
    win.webContents.send(channel, ...args)
}
module.exports = { create, send }
