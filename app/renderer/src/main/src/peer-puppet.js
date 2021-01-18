const pc = new window.RTCPeerConnection({})
const { desktopCapturer, ipcRenderer } = window.require('electron')
let candidate

pc.ondatachannel = (e) => {
    console.log('datachannel', e);
    e.channel.onmessage = (e) => {
        let { type, data } = JSON.parse(e.data)
        if (type === 'mouse') {
            data.screen = {
                width: window.screen.width,
                height: window.screen.height
            }
        }
        ipcRenderer.send('robot', type, data)
    }
}

async function getScreenStream() {
    const sources = await desktopCapturer.getSources({ types: ['screen'] })
    return new Promise((resolve, reject) => {
        navigator.webkitGetUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sources[0].id,
                    maxWidth: window.screen.width,
                    maxHeight: window.screen.height
                }
            }
        }, stream => {
            // peer.emit('add-stream', stream)
            resolve(stream)
        }, err => {
            console.log(err);
        })
    })

}
// getScreenStream()

function getVideoStream() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { min: 1024, ideal: 1280, max: 1920 },
                height: { min: 574, ideal: 720, max: 1080 },
                frameRate: { max: 30 }
            }
        })
            .then(stream => {
                console.log(stream);
                resolve(stream)
            })
            .catch(err => {
                console.log(err);
                console.log(err.name);
            })
    })
}
getVideoStream()

async function createAnswer(offer) {
    let screenStream = await getVideoStream()
    pc.addStream(screenStream)
    await pc.setRemoteDescription(offer)
    await pc.setLocalDescription(await pc.createAnswer())
    console.log('answer', JSON.stringify(pc.localDescription));

    return pc.localDescription
}
window.createAnswer = createAnswer


pc.onicecandidate = function (e) {
    console.log('candidate\n', JSON.stringify(e.candidate));
    candidate = e.candidate
    if (!e.candidate) {
        return
    }
}

let candidates = []
window.candidates = candidates
async function addIceCandidate(candidate) {
    console.log('--------addIce candidate Done-----------', candidate);

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

window.addIceCandidate = addIceCandidate
ipcRenderer.on('offer', async (e, offer, code) => {
    let answer = await createAnswer(offer)
    ipcRenderer.send('forward', 'answer', { answer: { type: answer.type, sdp: answer.sdp }, source: code })
    console.log('-------createAnswer Done-------');
})

ipcRenderer.on('control-candidate', async (e, candidate) => {
    console.log('candidate--------', JSON.parse(candidate));
    setTimeout(() => {
        addIceCandidate(JSON.parse(candidate))
    }, 1000)
})