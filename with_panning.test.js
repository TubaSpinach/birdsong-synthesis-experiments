/*const panner_settings = {
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
let panner
let audioCtx
let listener
let source
*/
const { beforeEach } = require('node:test')
const {AudioContext} = require('node:web-audio-api');
const {PannerNode} = require('web-audio-api');
const initialize = require('./with_panning.js')

function reset_values() {
    panner = undefined
    audioCtx = undefined
    listener = undefined
    source = undefined
}

test('initialize returns good - 1', ()=> {
    expect(initialize()).toEqual(1);
})

test('creates AudioCtx, panner, and listener', () => {
    expect(audioCtx).toMatchObject(AudioContext);
    expect(panner).toMatchObject(PannerNode);
    expect(listener).toMatchObject(AudioListener);
})

test('positions panner at [0,1,2]', () => {
    expect(panner.positionX).toBe(0);
    expect(panner.positionY).toBe(1);
    expect(panner.positionZ).toBe(2);
})

