//taken from https://devtails.xyz/@adam/how-to-write-a-wav-file-in-javascript

const sampleRate = 44100;
const durationSeconds = 10;
const numChannels = 1;
const bytesPerSample = 2 * numChannels;
const bytesPerSecond = sampleRate * bytesPerSample;
const dataLength = bytesPerSecond * durationSeconds;
const headerLength = 44;
const fileLength = dataLength + headerLength;
const bufferData = new Uint8Array(fileLength);
const dataView = new DataView(bufferData.buffer);
const writer = createWriter(dataView);

// HEADER
writer.string("RIFF");
// File Size
writer.uint32(fileLength);
writer.string("WAVE");

writer.string("fmt ");
// Chunk Size
writer.uint32(16);
// Format Tag
writer.uint16(1);
// Number Channels
writer.uint16(numChannels);
// Sample Rate
writer.uint32(sampleRate);
// Bytes Per Second
writer.uint32(bytesPerSecond);
// Bytes Per Sample
writer.uint16(bytesPerSample);
// Bits Per Sample
writer.uint16(bytesPerSample * 8);
writer.string("data");

writer.uint32(dataLength);

for (let i = 0; i < dataLength / 2; i++) {
  const t = i / sampleRate;
  const frequency = 256;
  const volume = 0.6;
  const val = Math.sin(2 * Math.PI * 256 * t) * volume;
  writer.pcm16s(val);
}

const blob = new Blob([dataView.buffer], { type: 'application/octet-stream' });

audioPlayer.src = URL.createObjectURL(blob);

function createWriter(dataView) {
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
