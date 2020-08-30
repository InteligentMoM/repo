#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd
import argparse


# In[3]:


ap = argparse.ArgumentParser()


# In[4]:


ap.add_argument("-a", "--audio", required=True, help="Please Enter Audio File Name....")


# In[5]:


args = vars(ap.parse_args())


# In[8]:


a= args['audio']
dataset = pd.DataFrame([a], columns=["File_Name"])


# In[9]:


print(dataset)


# In[10]:


dataset.to_csv("Audio_File_Name.csv")


# In[ ]:
