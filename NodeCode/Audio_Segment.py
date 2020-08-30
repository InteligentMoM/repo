#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
import numpy as np
from pydub import AudioSegment
import argparse


# In[4]:


ap = argparse.ArgumentParser()
ap.add_argument("-a", "--audio_name", required=True, help="Please Enter Audio File Name(Without extension)")
args = vars(ap.parse_args())


# In[2]:


dataset = pd.read_csv("Speaker_time.csv")
audio_file_name = args['audio_name']


# In[3]:


dataset.drop(['Unnamed: 0'], axis=1, inplace=True)


# In[4]:


dataset


# In[5]:


dataset.sort_values(by=['Start_Time'], inplace=True)


# In[6]:


dataset.shape


# In[7]:


dataset


# In[8]:


#dataset = dataset[dataset['Speaker']!=0]


# In[9]:


dataset[0:1]['Start_Time'] =0


# In[10]:


dataset


# In[11]:


for i in range(len(dataset)):
    print(dataset.iloc[i]['Start_Time'])


# In[12]:


for i in range(len(dataset)):
    print(dataset.iloc[i]['End_Time'])


# In[13]:


for i in range(len(dataset)-1):
    if dataset.iloc[i][2] < dataset.iloc[i+1][1]:
        dataset.iloc[i][2] = dataset.iloc[i+1][1]
    else:
        pass


# In[14]:


dataset.head(10)


# In[15]:


dataset.iloc[0]['Start_Time']


# In[16]:


for i in range(len(dataset)):
    t1 = dataset.iloc[i]['Start_Time'] #Works in milliseconds
    t2 = dataset.iloc[i]['End_Time']
    newAudio = AudioSegment.from_wav("wavs/"+audio_file_name+".wav")
    newAudio = newAudio[t1:t2]
    file_name = str("sub_wavs/"+audio_file_name+"_"+str(i)+"_Speaker_"+str(dataset.iloc[i]['Speaker'])+".wav")
    newAudio.export(file_name, format="wav")


# In[17]:


dataset.to_csv("Speaker_Timestamp.csv")


# In[ ]:
