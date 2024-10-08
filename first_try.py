import numpy as np
import pyaudio
import time

SLEEP_TIME = 0.1
SAMPLE_RATE = 44100

def callback(input_data, frame_count, time_info, status):
    mData.get_next_frames(frame_count)
    return (mData, pyaudio.paContinue)

class pyAudioData:
    def __init__(self,frames) -> None:
        self.frames = frames

    def get_next_frames(self, count_of_frames):
        next_frames = self.frames[:count_of_frames]
        self.frames = self.frames[count_of_frames:]
        return next_frames
    
def create_data():
    return_data = 2*np.random.random_sample(SAMPLE_RATE)-1
    return return_data

mData = pyAudioData(create_data())

p=pyaudio.PyAudio()

stream = p.open(format=pyaudio.paFloat32,
                channels=1,
                rate=SAMPLE_RATE,
                output=True,
                stream_callback=callback)

x=0
while stream.is_active():
    x+=1

stream.close()
p.terminate()
