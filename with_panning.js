
const panner_settings = {
    panningModel: "HRTF",
    distanceModel: "inverse",
    refDistance: 1,
    maxDistance: 10000,
    rolloffFactor: 1,
    coneInnerAngle: 360,
    coneOuterAngle: 0,
    coneOuterGain: 0,
    orientationX: 1,
    orientationY: 0,
    orientationZ: 0,
}
let RW_panner
let MD_panner
let audioCtx
let listener
let RW_source
let MD_source
let mixer

const audioPlayer = document.getElementById("audioplayer");


//because Mozilla hasn't implemented listener.forwardX, etc.
function check_and_set_orientation(anObject,forwardsTriple,upTriple) {
    if(!anObject.forwardX) {
        anObject.setOrienation(forwardsTriple[0],forwardsTriple[1],forwardsTriple[2],upTriple[0],upTriple[1],upTriple[2])
    } else {
        anObject.forwardX.value(forwardsTriple[0]);
        anObject.forwardY.value(forwardsTriple[1]);
        anObject.forwardZ.value(forwardsTriple[2]);
        anObject.upX.value(upTriple[0]);
        anObject.upY.value(upTriple[1]);
        anObject.upZ.value(upTriple[2]);
    }
    return anObject
}

//because Mozilla hasn't implemented listener.positionX
//  (but it has for panner)
function check_and_set_position(anObject,positionTriple) {
    if(!anObject.positionX) {
        anObject.setPosition(positionTriple[0],positionTriple[1],positionTriple[2])
    } else {
        anObject.positionX.value = positionTriple[0]
        anObject.positionY.value = positionTriple[1]
        anObject.positionZ.value = positionTriple[2]
    }
    return anObject;
}

function initialize() {
    audioCtx = new AudioContext();
    RW_panner= new PannerNode(audioCtx, panner_settings);
    MD_panner = new PannerNode(audioCtx, panner_settings);
    mixer = new GainNode(audioCtx);
    listener = audioCtx.listener;

    function initialize_positions() {
        check_and_set_orientation(listener,[0,0,-1],[0,1,0]);
        check_and_set_position(listener,[0,0,0])
        check_and_set_position(RW_panner,[-6,12,20])
        check_and_set_position(MD_panner,[6,6,12])

    }
    initialize_positions()

    function get_source(pathToSoundResource,source) {
        fetch(pathToSoundResource)
            .then((response)=>response.arrayBuffer())
            .then((downloadedBuffer)=>audioCtx.decodeAudioData(downloadedBuffer))
            .then((decodedBuffer)=> {
                source = new AudioBufferSourceNode(audioCtx, {
                    buffer: decodedBuffer,
                });
                source.connect(RW_panner);
                
                console.log(`source ${pathToSoundResource} loaded!`);
            })
            .catch((e)=> console.error(`error loading source ${pathToSoundResource}: ${e.err}`));
        return source
    }
    get_source("res/RwOkalee.wav",RW_source).connect(RW_panner);
    get_source("res/MdCoo.mp3",MD_source).connect(MD_panner);

    mixer.gain.setValueAtTime(.5,audioCtx.currentTime);
    RW_panner.connect(mixer);
    MD_panner.connect(mixer);
    mixer.connect(audioCtx.destination);
    return 1;
}

//TEST EXPORTS
module.exports = initialize;
