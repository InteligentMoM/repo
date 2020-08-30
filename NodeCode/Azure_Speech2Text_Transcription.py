#!/usr/bin/env python
# coding: utf-8

# In[1]:


#pip install azure-cognitiveservices-speech


# In[2]:


import time
import wave
import re
import pandas as pd
import azure.cognitiveservices.speech as speechsdk
import json
import logging
import argparse
from copy import copy
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# In[3]:


try:
    import azure.cognitiveservices.speech as speechsdk
except ImportError:
    print("""
    Importing the Speech SDK for Python failed.
    Refer to
    https://docs.microsoft.com/azure/cognitive-services/speech-service/quickstart-python for
    installation instructions.
    """)
    import sys
    sys.exit(1)


# In[ ]:


ap = argparse.ArgumentParser()
ap.add_argument("-a", "--audio_name", required=True, help="Please Enter Audio File Name(Without extension)")
args = vars(ap.parse_args())


# In[4]:


# Set up the subscription info for the Speech Service:
# Replace with your own subscription key and service region (e.g., "westus").
speech_key, service_region = "____SpeachKEY", "ServiceRegion"
audio_file_name = args['audio_name']


# In[5]:


data =[]


# In[6]:


def transcript(audio_filepath):
    logger.debug("Speech to text request received")
    locale = "en-US" # Change as per requirement

    logger.debug(audio_filepath)
    audio_config = speechsdk.audio.AudioConfig(filename=audio_filepath)
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    speech_config.request_word_level_timestamps()
    speech_config.speech_recognition_language = locale
    speech_config.output_format = speechsdk.OutputFormat(1)


    # Creates a recognizer with the given settings
    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
    #speech_recognizer.recognized.connect(lambda evt: print('JSON: {}'.format(evt.result.json)))

    # Variable to monitor status
    done = False

    # Service callback for recognition text
    transcript_display_list = []

    def parse(evt):
        stt = json.loads(evt.result.json)
        transcript_display_list.append(stt['DisplayText'])


    # Service callback that stops continuous recognition upon receiving an event `evt`
    def stop_cb(evt):
        print('CLOSING on {}'.format(evt))
        speech_recognizer.stop_continuous_recognition()
        nonlocal done
        done = True

        # Do something with the combined responses
        print(transcript_display_list)



    # Connect callbacks to the events fired by the speech recognizer
    speech_recognizer.recognizing.connect(lambda evt: logger.debug('RECOGNIZING: {}'.format(evt)))
    speech_recognizer.recognized.connect(parse)
    speech_recognizer.session_started.connect(lambda evt: logger.debug('SESSION STARTED: {}'.format(evt)))
    speech_recognizer.session_stopped.connect(lambda evt: logger.debug('SESSION STOPPED {}'.format(evt)))
    speech_recognizer.canceled.connect(lambda evt: logger.debug('CANCELED {}'.format(evt)))
    # stop continuous recognition on either session stopped or canceled events
    speech_recognizer.session_stopped.connect(stop_cb)
    speech_recognizer.canceled.connect(stop_cb)

    # Start continuous speech recognition
    logger.debug("Initiating speech to text")
    speech_recognizer.start_continuous_recognition()
    while not done:
        time.sleep(.5)

    return transcript_display_list


# In[7]:


dataset = pd.read_csv("Speaker_Timestamp.csv")


# In[8]:


dataset.drop(['Unnamed: 0'], inplace=True, axis=1)


# In[9]:


tran =[]
for i in range(len(dataset)):
    file_path = "sub_wavs/"+audio_file_name+"_"+str(i)+"_Speaker_"+str(dataset.iloc[i]['Speaker'])+".wav"
    print(file_path)
    tran.append(transcript(file_path))


dataset['Transcript'] = tran



def convert_timestamp(millis):
    millis = int(millis)
    seconds=(millis/1000)%60
    seconds = int(seconds)
    minutes=(millis/(1000*60))%60
    minutes = int(minutes)
    hours=(millis/(1000*60*60))%24
    return ("%02d:%02d:%02d" % (hours, minutes, seconds))


Start_Time = []
End_Time = []

for i in range(len(dataset)):
    Start_Time.append(convert_timestamp(dataset.iloc[i]['Start_Time']))
    End_Time.append(convert_timestamp(dataset.iloc[i]['End_Time']))

dataset['Start_Time'] = Start_Time
dataset['End_Time'] = End_Time


Transcript = []

for i in range(len(dataset)):
    Transcript.append(re.sub("\[", '',str(dataset.iloc[i]['Transcript'])))

dataset['Transcript'] = Transcript


# In[19]:


Transcript = []

for i in range(len(dataset)):
    Transcript.append(re.sub("\]", '',str(dataset.iloc[i]['Transcript'])))

dataset['Transcript'] = Transcript


# In[20]:

# In[21]:


dataset.to_csv("transcripts/"+audio_file_name+"_transcript.csv")


# In[ ]:
