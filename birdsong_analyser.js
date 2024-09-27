//using Web Audio API and following the visualization tutorial at https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const audioPlayer = document.getElementById("audioplayer");
let audioSrc = audioCtx.createMediaElementSource(audioPlayer);

audioSrc.connect(analyser);
analyser.connect(audioCtx.destination);
// there are a lot of options associated with the analyser node
// it uses a FFT, and so all the normal FFT parameters are accessible
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
const canvas = document.getElementById("Oscilloscope")
canvasCtx = canvas.getContext("2d");
canvasCtx.clearRect(0,0,canvas.width,canvas.height);

function draw() {
    const drawVisual = requestAnimationFrame(draw);
}


// play pause audio
const playButton = document.querySelector('.tape-controls-play');
playButton.addEventListener('click', function() {
	
	// check if context is in suspended state (autoplay policy)
	if (audioCtx.state === 'suspended') {
		audioCtx.resume();
	}
	
	if (this.dataset.playing === 'false') {
		audioPlayer.play();
		this.dataset.playing = 'true';
	// if track is playing pause it
	} else if (this.dataset.playing === 'true') {
		audioPlayer.pause();
		this.dataset.playing = 'false';
	}
	
	let state = this.getAttribute('aria-checked') === "true" ? true : false;
	this.setAttribute( 'aria-checked', state ? "false" : "true" );
	
}, false);

// if track ends
audioPlayer.addEventListener('ended', () => {
	playButton.dataset.playing = 'false';
	playButton.setAttribute( "aria-checked", "false" );
}, false);

// basically, create a context,
// create nodes,
// connect nodes together
// create a source
// connect source to the beginning
// connect node tree to context.destination