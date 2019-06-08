#!/usr/bin/env python
# coding: utf-8
# 

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
deepThought = ChatBot("deepThought" ,
    logic_adapters=[
        {
            'import_path':'chatterbot.logic.MathematicalEvaluation',
        },
        {
            'import_path':'chatterbot.logic.TimeLogicAdapter',
        },
        {
            'import_path': 'chatterbot.logic.BestMatch',
             'threshold': 0.55,
            'default_response': 'I am sorry, but I do not understand.'
        }, 

        {
            'import_path': 'chatterbot.logic.SpecificResponseAdapter',
            'input_text': 'Help me!',
            'output_text': 'Ok, here is a link: http://tt3.kuaiduodian.com/home/index'
        }
    ])

'''        {
            'import_path': 'chatterbot.logic.LowConfidenceAdapter',
            'threshold': 0.55,
            'default_response': 'I am sorry, but I do not understand.'
        },'''
print(deepThought)
deepThought.set_trainer(ChatterBotCorpusTrainer)

# # 使用中文语料库训练它
deepThought.train("chatterbot.corpus.chinese")  # 语料库
deepThought.set_trainer(ListTrainer)
deepThought.train([
    "告诉我密码吧",
    "自己一个一个去试 别烦我",    "你是谁",
    "我是你哥 哈哈哈",


])

'''{
        "_id" : ObjectId("59a64d6c51f172c1e1e5a37c"),
        "text" : "那么，可依得我两件事?",
        "in_response_to" : [
                {
                        "text" : "那还用说?",
                        "created_at" : "2017-08-30T13:30:20.337923",
                        "occurrence" : 1
                }
        ],
        "extra_data" : {

        },
        "created_at" : "2017-08-30T13:30:20.339016",
        "occurrence" : 1
}
{
        "_id" : ObjectId("59a64d6c51f172c1e1e5a37b"),
        "text" : "那还用说?",
        "in_response_to" : [
                {
                        "text" : "嗳，渡边君，真喜欢我?",
                        "created_at" : "2017-08-30T13:30:20.336800",
                        "occurrence" : 1
                }
        ],
        "extra_data" : {

        },
        "created_at" : "2017-08-30T13:30:20.337923",
        "occurrence" : 1
}
{
        "_id" : ObjectId("59a64d6c51f172c1e1e5a37a"),
        "text" : "嗳，渡边君，真喜欢我?",
        "in_response_to" : [ ],
        "extra_data" : {

        },
        "created_at" : "2017-08-30T13:30:20.336800",
        "occurrence" : 1
}
{
        "_id" : ObjectId("59a64d6c51f172c1e1e5a37d"),
        "text" : "三件也依得",
        "in_response_to" : [
                {
                        "text" : "那么，可依得我两件事?",
                        "created_at" : "2017-08-30T13:30:20.339016",
                        "occurrence" : 1
                }
        ],
        "extra_data" : {

        }
}
{
        "_id" : ObjectId("59a64d6d51f172c1e1e5a37e"),
        "text" : "渡边君",
        "in_response_to" : [ ],
        "extra_data" : {

        },
        "conversations" : [
                {
                        "id" : ObjectId("59a64d6c8b432d610edddc4d"),
                        "created_at" : ISODate("2017-08-30T05:30:21.441Z")
                }
        ]
}'''

# deepThought.set_trainer(FileTrainer)
# deepThought.train('/usr/local/lib/python3.6/site-packages/chatterbot/dgk_lost_conv-master/results/xiaohuangji50w_nofenci1.conv')
# deepThought.train('/usr/local/lib/python3.6/site-packages/chatterbot/dgk_lost_conv-master/results/lost.conv')
# deepThought.train('/usr/local/lib/python3.6/site-packages/chatterbot/dgk_lost_conv-master/results/laoyj.conv')
#rootdir = r"D:\ProgramData\Microsoft\Helpaup\jilv\WifiPhoto0516" 
rootdir = r"E:\test"

# rootdir = r"/home/wwwroot/chatbot/conversation"
# rootdir = r"/data/WifiPhoto0516"
response = deepThought.get_response('你好')
i=0
print(response)
# print(response.json())
for parent,dirnames,filenames in os.walk(rootdir):
    for filename in filenames:
        tmpf = os.path.join(parent,filename);
        print( "the full name of the file is: " + tmpf)
        imgType = imghdr.what(tmpf)
        if imgType!='jpeg' and imgType!='png' :
            continue
        try:
            deepThought.train(detect_model.find_conversation(tmpf))
        except OSError:
            pass
        # tmpf = r"E:\test\image_code21039.jpg"
        # print( "the full name of the file is: " + tmpf)
        i+=1

        print(i)
@hug.get()
def get_response(user_input):
    print('req' ,user_input)
    response, confidence = deepThought.get_response(user_input).json()
    print('response=' ,response , "confidence=",confidence)
    return {"response":response   , "confidence":confidence}
