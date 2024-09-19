var wav_writer = function (data_function, settings= {
        "sampleRate" :  44100,
        "durationSeconds" :  10,
        "numChannels" :  1,
        "headerLength" :  44,
        }) {
    this.sampleRate = settings.sampleRate;
    this.durationSeconds = settings.durationSeconds;
    this.numChannels = settings.numChannels;
    this.bytesPerSample = 2 * this.numChannels;
    this.bytesPerSecond = this.sampleRate * this.bytesPerSample;
    this.dataLength = this.bytesPerSecond * this.durationSeconds;
    this.headerLength = settings.headerLength;
    this.fileLength = this.dataLength + this.headerLength;
    this.bufferData = new Uint8Array(this.fileLength);
    this.dataView = new DataView(this.bufferData.buffer);
    this.writer = createWriter(this.dataView,this.dataLength,this.sampleRate);

    this.data_function = data_function;

    function createWriter(dataView,dataLength,sampleRate) {
        let pos = 0;
      
        return {
          string(val) {
            for (let i = 0; i < val.length; i++) {
              dataView.setUint8(pos++, val.charCodeAt(i));
            }
          },
          uint16(val) {
            dataView.setUint16(pos, val, true);
            pos += 2;
          },
          uint32(val) {
            dataView.setUint32(pos, val, true);
            pos += 4;
          },
          pcm16s: function(value) {
            value = Math.round(value * 32768);
            value = Math.max(-32768, Math.min(value, 32767));
            dataView.setInt16(pos, value, true);
            pos += 2;
          },
        }
      }
}

wav_writer.prototype.write = function() {
    // HEADER
    this.writer.string("RIFF");
    // File Size
    this.writer.uint32(this.fileLength);
    this.writer.string("WAVE");

    this.writer.string("fmt ");
    // Chunk Size
    this.writer.uint32(16);
    // Format Tag
    this.writer.uint16(1);
    // Number Channels
    this.writer.uint16(this.numChannels);
    // Sample Rate
    this.writer.uint32(this.sampleRate);
    // Bytes Per Second
    this.writer.uint32(this.bytesPerSecond);
    // Bytes Per Sample
    this.writer.uint16(this.bytesPerSample);
    // Bits Per Sample
    this.writer.uint16(this.bytesPerSample * 8);
    this.writer.string("data");

    this.writer.uint32(this.dataLength);
    for (let i = 0; i < this.dataLength / 2; i++) {
        const t = i / this.sampleRate;
        const frequency = 256;
        const volume = 0.6;
        const val = this.data_function(t,frequency,volume);
        this.writer.pcm16s(val);
    }
    const blob = new Blob([this.dataView.buffer], { type: 'application/octet-stream' });

    return URL.createObjectURL(blob);
}

function output_function(t,frequency,volume) {
    return Math.sin(2 * Math.PI * frequency * t) * volume;
  }

var sign_wav_writer = new wav_writer(output_function);
const audio_url = sign_wav_writer.write();
audioPlayer = document.getElementById('audioplayer')
//audioPlayer.src = audio_url;
//audioPlayer.load();