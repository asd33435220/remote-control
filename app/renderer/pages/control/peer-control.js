const EventEmitter = require('events')
const peer = new EventEmitter()

const { ipcRenderer, desktopCapturer } = require('electron')

// peer.on('robot', (type, data) => {
//     if (type === 'mouse') {
//         data.screen = {
//             width: window.screen.width,
//             height: window.screen.height
//         }
//     }
//     // setTimeout(() =>{
//         ipcRenderer.send('robot', type, data)
//     // },2000)
// })
const pc = new window.RTCPeerConnection({})
const dc = pc.createDataChannel('robotchannel', { reliable: false })

dc.onopen = function () {
    peer.on('robot', (type, data) => {
        dc.send(JSON.stringify({ type, data }))
    })
}
dc.onmessage = function (event) {
    console.log('message', event);
}

dc.onerror = (e) => {
    console.log(e);
}

pc.onicecandidate = function (e) {
    if (!e.candidate) {
        return
    }
    ipcRenderer.send('forward', 'control-candidate', JSON.stringify(e.candidate))
}
ipcRenderer.on('disconnect', (e, candidate) => {
    addIceCandidate(candidate)
})
let candidates = []

async function addIceCandidate(candidate) {
    if (candidate) {
        candidates.push(candidate)
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let i = 0; i < candidates.length; i++) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
        }
        candidates = []

    }
}

ipcRenderer.on('candidate', (e, candidate) => {
    console.log('add-candidate');
    addIceCandidate(candidate)
})

async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true
    })
    await pc.setLocalDescription(offer)
    return pc.localDescription

}
createOffer().then(offer => {
    console.log('offer', JSON.stringify(offer));

    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp })
})


async function setRemote(answer) {
    await pc.setRemoteDescription(answer)
}
window.setRemote = setRemote

ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer)
    console.log('-------setRemote Done-------');

})

pc.onaddstream = function (e) {
    console.log('add stream', e);
    peer.emit('add-stream', e.stream)
}
module.exports = peer