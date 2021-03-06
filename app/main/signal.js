const WebSocket = require('ws')
const EventEmitter = require('events')
const signal = new EventEmitter()

const ws = new WebSocket('ws://10.79.161.128:8010')

ws.on('open', () => {
    console.log('connect success');
})

ws.on('message', (message) => {

    let data = {}
    try {
        data = JSON.parse(message)
    } catch (e) {
        console.log('parse error', e);
        return
    }
    signal.emit(data.event, data.data,data.code)
})

function send(event, data) {
    ws.send(JSON.stringify({event, data}))
}
function invoke(event, data, answerEvent) {
    return new Promise(function (resolve, reject) {
        send(event, data)
        signal.once(answerEvent, resolve)
        setTimeout(function () {
            reject('timeout')
        }, 5000)
    })
}

signal.send = send
signal.invoke = invoke
module.exports = signal