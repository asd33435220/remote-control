const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win
let willQuitAPP = false
function create() {
    win = new BrowserWindow({
        width: 600,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.on('close', (e) => {
        if (willQuitAPP) {
            win = null
        } else {
            e.preventDefault()
            win.hide()
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
function show() {
    console.log('show');
    
    win.show()
}
function close() {
    willQuitAPP = true
    win.close()
}
module.exports = { create, send, show, close }
