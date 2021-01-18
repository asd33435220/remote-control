const { app, Menu, Tray } = require('electron')
const { show: showMainWindow } = require('../window/main')
const { create } = require('../window/about')
const path = require('path')
let tray

function setTray() {
    tray = new Tray(path.resolve(__dirname, './infro.png'))
    tray.on('click', () => {
        showMainWindow()
    })
    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            { label: '显示', click: showMainWindow },
            { label: '退出', click: app.quit }
        ])
        tray.popUpContextMenu(contextMenu)
    })
}
let appMenu
function setAppMenu() {
    appMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [{
                label: 'About',
                click: create
            },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }

            ]
        },
        { role: 'fillMenu' },
        { role: 'windowMenu' },
        { role: 'editMenu' },
    ])
    app.applicationMenu = appMenu
}
app.whenReady().then(() => {
    setTray()
    setAppMenu()
})