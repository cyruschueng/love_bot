#!/usr/bin/env python
# coding: utf-8
# hug -f f:/my/conversation/bot_api.py
# http://localhost:8000/get_response?user_input=%E4%BD%A0%E5%A5%BD
from chatterbot import ChatBot
import logging 
logging.basicConfig(level=logging.INFO)  
from chatterbot.trainers import ChatterBotCorpusTrainer
import hug
from chatterbot.trainers import ListTrainer
import os
import detect_model
import imghdr
import time
import sys

print(sys.argv);
deepThought = ChatBot("deepThought" ,
    logic_adapters=[
        {
            'import_path':'chatterbot.logic.MathematicalEvaluation',
        },
    
        {
            'import_path': 'chatterbot.logic.BestMatch'
        },
        {
            'import_path': 'chatterbot.logic.SpecificResponseAdapter',
            'input_text': 'Help me!',
            'output_text': 'Ok, here is a link: http://tt3.kuaiduodian.com/home/index'
        }
    ])

trainer = ListTrainer(deepThought)
trainer.train([
    "嗳，Arron，真喜欢我?",
    "那还用说?",
    "那么，可依得我两件事?",
    "三件也依得",
])
#输入陌陌 微信聊天记录
rootdir = r"/home/wwwroot/lucky1/hongbao/love_bot/images/"
response = deepThought.get_response('Arron')
i=0
print(response);
print(response.text);

if len(sys.argv)==1:
    print('qqqqqqqqqqqqqqqqqqq')
    for parent,dirnames,filenames in os.walk(rootdir):
        for filename in filenames:
            tmpf = os.path.join(parent,filename);
            print( "the full name of the file is: " + tmpf)
            if 'tmp_' in tmpf:
                continue
            imgType = imghdr.what(tmpf)
            if imgType!='jpeg' and imgType!='png' :
                continue
            try:
                trainer.train(detect_model.find_conversation(tmpf,rootdir))
            except OSError:
                pass
            i+=1
            time.sleep(1)
            print(i)
@hug.get()
def get_response(user_input):
    response = deepThought.get_response(user_input).text
    print(response)
    return {"response":response}
