const peer = require('./peer-control')
peer.on('add-stream', stream => {
    play(stream)
})

let video = document.querySelector('#screen-video')

function play(stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

}
window.onkeydown = function (e) {
    let data = {
        keyCode: e.keyCode,
        shift: e.shiftKey,
        meta: e.metaKey,
        control: e.controlKey,
        alt: e.altKey,
    }
    peer.emit('robot', 'key', data)

}
window.onmouseup = function (e) {
    let data = {
        clientX: e.clientX,
        clientY: e.clientY,
        video: {
            width: video.getBoundingClientRect().width,
            height: video.getBoundingClientRect().height,
        }
    }
    peer.emit('robot', 'mouse', data)
}