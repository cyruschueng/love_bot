#-*- coding: UTF-8 -*-
import os
import numpy as np
import cv2
from array import *
import re
from PIL import Image,ImageEnhance
import subprocess
import json
import util
import errors
import crop
import time
import preprocess
from bottle import template
tesseract_exe_name = 'tesseract' # Name of executable to be called at command line
scratch_image_name = "temp.bmp" # This file must be .bmp or other Tesseract-compatible format
scratch_text_name_root = "temp" # Leave out the .txt extension
cleanup_scratch_flag = True  # Temporary files cleaned up after OCR operation+eng+chi_tra
_language = 'chi_sim'
rootdir  = r"/data/"



def dumphtmlfile(htmlfile  ,articles,photo):
        template_demo="""
<html>
<head><meta charset="utf-8"><h1>对话</h1></head>
<title>{{photo}}</title>
<body>
<table>
  <thead>
    <tr>
      <th>方向</th>
      <th>内容</th>
      <th>切图</th>
    </tr>
  </thead>
  <tbody>
% for it in items:
    <tr>
      <td>{{it['a']}}</td>
      <td>{{it['d']}}</td>
      <td><img src="{{it['p']}}"></td>
    </tr>
%end
  </tbody>
</table>

<img src="{{photo}}"><img src="{{photoa}}"><img src="{{photob}}">
</body
</html>
"""
        tmpb = os.path.basename(photo)
        photoa="https://lucky.kuaiduodian.com/love_bot/images/tmp_conversationbef/"+tmpb
        photob="https://lucky.kuaiduodian.com/love_bot/images/tmp_conversationbef/"+tmpb+'_Gradient.jpg'
        photo = photo.replace(rootdir + "tmp_", "https://lucky.kuaiduodian.com/love_bot/images/tmp_")
        html = template(template_demo,items=articles,photo=photo,photoa=photoa,photob=photob)
        with open(htmlfile,'wb') as f:
                f.write(html.encode('utf-8'))

# tesseract /home/wwwroot/lucky1/hongbao/love_bot/images/tmp_testtmp/image_code2img_2635.jpg127.jpg stdout -l chi_sim -vvvv -psm 193333
def call_tesseract(input_filename, output_filename, language=""):
	"""Calls external tesseract.exe on input file (restrictions on types),
	outputting output_filename+'txt'"""
	args = [tesseract_exe_name, input_filename, output_filename]
	if len(language) > 0:
		args.append('-l')
		args.append(language)
		args.append('-psm')
		args.append('6')

		
	print(args)
	proc = subprocess.Popen(args)
	retcode = proc.wait()
	if retcode!=0:
		errors.check_for_errors()


def image_to_string(im, lang= _language, cleanup = cleanup_scratch_flag, graceful_errors=True):
	"""Converts im to file, applies tesseract, and fetches resulting text.
	If cleanup=True, delete scratch files after operation."""
	try:
		util.image_to_scratch(im, scratch_image_name)
		call_tesseract(scratch_image_name, scratch_text_name_root)
		text = util.retrieve_text(scratch_text_name_root)
	finally:
		if cleanup:
			util.perform_cleanup(scratch_image_name, scratch_text_name_root)
	return text

def image_file_to_string(filename, lang = _language, cleanup = cleanup_scratch_flag, graceful_errors=True):
	"""Applies tesseract to filename; or, if image is incompatible and graceful_errors=True,
	converts to compatible format and then applies tesseract.  Fetches resulting text.
	If cleanup=True, delete scratch files after operation."""
	try:
		try:
			# print filename
			call_tesseract(filename, scratch_text_name_root, lang)
			text = util.retrieve_text(scratch_text_name_root)
		except errors.Tesser_General_Exception:
			if graceful_errors:
				im = Image.open(filename)
				print(filename)
				print('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!对图像进行特殊处理')
				text = image_to_string(im, cleanup)
			else:
				raise
	finally:
		if cleanup:
			util.perform_cleanup(scratch_image_name, scratch_text_name_root)
	return text
	
def fkey(a):
     return a['c'][1]



def find_oconversation(tmpf):
        image = cv2.imread(tmpf)
        if image is None:
                return
        print(image.shape)
        tmpb = os.path.basename(tmpf)
        # y  rows  1111 540 3
        rows,cols,channels = image.shape
        ccccc = int((rows/cols)*5)+2
        print("允许最大的对话 ",str(ccccc))

        out = np.zeros(image.shape, dtype=np.uint8)
        for i in range(rows):
                for j in range(cols ):
                        B,G,R=image[i,j]
                        # print(R,G,B)
                        if B>244 and 255>B and G>201 and 221>G and R >212 and 232>R:
                                out[i,j] = image[i,j]
                        if B>244 and 256>B and G>207 and 227>G and R >163 and 183>R:
                                out[i,j] = image[i,j]

        #---------------------------------------------------------------173  217 254
        gray = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)

        # compute the Scharr gradient magnitude representation of the images
        # in both the x and y direction
        gradX = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 1, dy = 0, ksize = -1)
        gradY = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 0, dy = 1, ksize = -1)

        # subtract the y-gradient from the x-gradient
        gradient = cv2.subtract(gradX, gradY)
        gradient = cv2.convertScaleAbs(gradient)

  
        closed=gradient.copy()
        cv2.imwrite(rootdir + "tmp_conversationbef/"+tmpb+"_Gradient.jpg", closed, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])  
        cnts = cv2.findContours(closed,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)  

        cnts = cnts[1]
        closed = cv2.imread(tmpf)

        c = sorted(cnts, key = cv2.contourArea, reverse = True)
        print('转角多少  '+str(len(c)) )
        PILimg =Image.open(tmpf)
        PILimg_Gradient =Image.open(rootdir + "tmp_conversationbef/"+tmpb+"_Gradient.jpg")
        cccddd = 0;
        lenword = 0
        conversation =[]
        for cnt in c:
                rect = cv2.minAreaRect(cnt)             # rect = ((center_x,center_y),(width,height),angle)
                points = cv2.boxPoints(rect)         # Find four vertices of rectangle from above rect
                points = np.int0(np.around(points))     # Round the values and make it integers

 

                i, j, w, h = cv2.boundingRect(points)

                if( 10 >h):
                        continue
 
                if 20 >cv2.contourArea(cnt) or 10 >w:
                        continue

                print(points)
                
                boundsj = j+h-5
                boundsi = i+w-25
                if(boundsi>=cols):
                        boundsi=cols-1
                if(boundsj>=rows):
                        boundsj=rows-1                        
                B,G,R=image[boundsj,boundsi]

                boundsj = j+h-5
                boundsi = i+w-5
                if(boundsi>=cols):
                        boundsi=cols-1
                if(boundsj>=rows):
                        boundsj=rows-1                     

                
                B1,G1,R1=image[boundsj,boundsi]                 

                print(R,G,B)
                print(R1,G1,B1)
                leftc = 0
                if 255>B and G>201 and 221>G and R >212 and 232>R:
                        leftc = 1
                        # cv2.polylines(closed,[points],True,(255,0,0),2)
                elif   256>B and G>190 and 227>G and R >163 and 183>R:
                        # 255>B and G>207 and 227>G and R >163 and 183>R:
                        leftc = 0
                        # cv2.polylines(closed,[points],True,(0,255,0),4)
                elif   256>B1 and G1>190 and 227>G1 and R1 >163 and 183>R1:
                        leftc = 0
                        # cv2.polylines(closed,[points],True,(0,255,0),4) 222 211 254
                elif  255>B1 and G1>201 and 221>G1 and R1 >212 and 232>R1:
                        leftc = 1
                        # cv2.polylines(closed,[points],True,(255,0,0),2) 173  217 254  254 190 7
                else:
                        continue
                if cccddd>ccccc:
                        break
                cccddd =cccddd+1
                regionpath = rootdir + "tmp_testtmp/image_code2"+tmpb+str(j)+".jpg"
                print("正在分析图片的字符"+regionpath)
                
 
                croped = image[j+5:j+h-5,i+5:i+w-5]
                cv2.imwrite(regionpath, croped, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])  
                text = ''
                try:			
                        text = image_file_to_string(regionpath, graceful_errors=True)	
                except errors.Tesser_General_Exception:
                        print("fnord.tif is incompatible filetype.  Try graceful_errors=True")
                        print(value)
                
                # import sys

                # import jieba
                # # import jieba.posseg as pseg
                # # words = pseg.cut(text)
                text =''.join(re.split(' +', text)).strip()
                text =''.join(re.split('\n+', text)).strip()
                
                print(text)
                print('chinese-----')
                filtrate = re.compile(u'[^\u4E00-\u9FA5]')
                text = filtrate.sub(r' ', text)#replace
                print(text)
                lenword=lenword+len(text)

                if(len(text)==0):
                        continue
                if   leftc==1:

                        dict = {"a" : "left", "b" : regionpath, "c" : [i, j, w, h], "d" : text, "e" : tmpf, "p" : "https://lucky.kuaiduodian.com/love_bot/images/tmp_testtmp/"+os.path.basename(regionpath)}
                        conversation.append(dict)
                        # conversation.append(['left',regionpath,points,text])
                        cv2.polylines(closed,[points],True,(255,0,0),2)  
                else:
                        dict = {"a" : "right", "b" : regionpath, "c" : [i, j, w, h], "d" : text, "e" : tmpf, "p" : "https://lucky.kuaiduodian.com/love_bot/images/tmp_testtmp/"+os.path.basename(regionpath)}
                        conversation.append(dict)
                        # conversation.append(['right',regionpath,points,text])
                        cv2.polylines(closed,[points],True,(0,255,0),4)           
                
                
                #print(points)
                #cv2.polylines(closed,[points],True,(255,0,0),2)# draw rectangle in blue color
        #print(conversation)
        conversation = sorted(conversation, key = fkey)
        print('last-----------------------------')
        print(conversation)

        conversationlast = []
        conversationlastttt = ''
        left =0
        for colour in conversation:  
                if colour['a'] == 'left':
                        if(left==2 and conversationlastttt != ''):
                                conversationlast.append(conversationlastttt)
                                conversationlastttt =''
                        left =1
                        if(conversationlastttt == ''):
                                conversationlastttt = conversationlastttt+colour['d'] 
                        else:
                                conversationlastttt = conversationlastttt+','+colour['d'] 
                            
                        print ( '>>>'+colour['d'] )
                else:   
                        if(left==1 and conversationlastttt != ''):
                                conversationlast.append(conversationlastttt)
                                conversationlastttt =''
                        left =2       
                        if(conversationlastttt == ''):
                                conversationlastttt = conversationlastttt+colour['d'] 
                        else:
                                conversationlastttt = conversationlastttt+','+colour['d'] 
                        print ( colour['d']+"<<<" )
        if( conversationlastttt != ''):
                conversationlast.append(conversationlastttt)
        print(conversationlast)
        jsObj = json.dumps(conversation,  skipkeys = True,ensure_ascii=False,indent=2)  
        fileObject = open(rootdir + "tmp_conversation/json"+tmpb+".json", 'w',  -1, 'utf-8')  
        fileObject.write(jsObj)  
        fileObject.close()
        dumphtmlfile(rootdir + "tmp_conversation/json"+tmpb+".html" ,conversation,tmpf)
        file_object = open(rootdir + 'tmp_index.html' , "a+", -1, 'utf-8') 
        file_object.write('<a href="https://lucky.kuaiduodian.com/love_bot/images/tmp_conversation/json' +tmpb+'.html" target="_blank">'+tmpf+ '</a><br/>')
        file_object.close( )
        cv2.imwrite(rootdir + "tmp_conversationbef/"+tmpb, closed, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])  
        return conversationlast
        

def find_conversation(tmpf,rootdir):
        rootdir = rootdir
        image = cv2.imread(tmpf)
        if image is None:
                return
        print(image.shape)
        tmpb = os.path.basename(tmpf)
        # y  rows  1111 540 3
        rows,cols,channels = image.shape

        ccccc = int((rows/cols)*5)+2
        print("允许最大的对话 ",str(ccccc))

        out = np.zeros(image.shape, dtype=np.uint8)
        for i in range(rows):
                for j in range(cols ):
                        R,G,B=image[i,j]
                        # print(R,G,B)
                        if R>250 and G>250 and B>250:
                                out[i,j] = image[i,j]
                        if B>150 and 169>B and G>220 and 239>G and R >80 and 99>R:
                                out[i,j] = image[i,j]
                                
 

        #---------------------------------------------------------------
        gray = cv2.cvtColor(out, cv2.COLOR_BGR2GRAY)

        # compute the Scharr gradient magnitude representation of the images
        # in both the x and y direction
        gradX = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 1, dy = 0, ksize = -1)
        gradY = cv2.Sobel(gray, ddepth = cv2.CV_32F, dx = 0, dy = 1, ksize = -1)

        # subtract the y-gradient from the x-gradient
        gradient = cv2.subtract(gradX, gradY)
        gradient = cv2.convertScaleAbs(gradient)
        # cv2.imshow("Gradient",gradient)
        #---------------------------------------------------------------
        
  
        closed=gradient.copy()
        cv2.imwrite(rootdir + "tmp_conversationbef/"+tmpb+"_Gradient.jpg", closed, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])  
        cnts = cv2.findContours(closed,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)  

        cnts = cnts[1]
        closed = cv2.imread(tmpf)

        c = sorted(cnts, key = cv2.contourArea, reverse = True)
        print('转角多少个  '+str(len(c)) )
        PILimg =Image.open(tmpf)
        cccddd = 0;
        len0 = 0;
        lenword = 0;
        conversation =[]
        for cnt in c:
                rect = cv2.minAreaRect(cnt)             # rect = ((center_x,center_y),(width,height),angle)
                points = cv2.boxPoints(rect)         # Find four vertices of rectangle from above rect
                points = np.int0(np.around(points))     # Round the values and make it integers

                i, j, w, h = cv2.boundingRect(points)
                if(h > w * 1.2 or 10 >h):
                        continue

                if 20 >cv2.contourArea(cnt) or 10 >w:
                        continue

                # i, j= points[0]
                print(points)
                # print(i, j )
                # #  max 1111 540
                boundsj = j+5
                boundsi = i+25
                if(boundsi>=cols):
                        boundsi=cols-1
                if(boundsj>=rows):
                        boundsj=rows-1                        
                R,G,B=image[boundsj,boundsi]
                boundsj = j+5
                boundsi = i+5
                if(boundsi>=cols):
                        boundsi=cols-1
                if(boundsj>=rows):
                        boundsj=rows-1                     
                R1,G1,B1=image[boundsj,boundsi]
                print(R,G,B)
                leftc = 0
                if R>250 and G>250 and B>250:
                        leftc = 1
                        # cv2.polylines(closed,[points],True,(255,0,0),2)
                elif  B>150 and 175>B and G>220 and 245>G and R >80 and 105>R:
                        leftc = 0
                        # cv2.polylines(closed,[points],True,(0,255,0),4)
                elif  B1>150 and 175>B1 and G1>220 and 245>G1 and R1 >80 and 105>R1:
                        leftc = 0
                        # cv2.polylines(closed,[points],True,(0,255,0),4)
                elif R1>250 and G1>250 and B1>250:
                        leftc = 1
                        # cv2.polylines(closed,[points],True,(255,0,0),2)
                else:
                        continue
                if cccddd>ccccc:
                        break
                cccddd =cccddd+1
                # region=PILimg.crop((i,j,i+w,j+h))
                # region.save(regionpath)
                regionpath = rootdir + "tmp_testtmp/image_code2"+tmpb+str(j)+".jpg"

                croped = image[j:j+h,i:i+w]
                cv2.imwrite(regionpath+"bef.jpg", croped, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])
         
         
                if leftc==1:
                        croped = image[j+5:j+h-5,i+15:i+w-5]
                else:
                        croped = image[j+5:j+h-5,i+5:i+w-15]
                # croped = preprocess.preprocess(croped)


                
                cv2.imwrite(regionpath, croped, [int(cv2.IMWRITE_PNG_COMPRESSION), 0]) 
                croped  = cv2.imread(regionpath)
                img_300x300 = cv2.copyMakeBorder(croped, 10, 10, 10,10, 
                                       cv2.BORDER_CONSTANT, 
                                       value=(255, 255, 255))
                cv2.imwrite(regionpath, img_300x300)
                # paddingtop 5px
                # imgpaddingtop  = cv2.imread(regionpath)
                # imgpaddingtop.shape
                # print(regionpath)
             
                text = ''
                try:			
                        text = image_file_to_string(regionpath, graceful_errors=True)	
                except errors.Tesser_General_Exception:
                        print("fnord.tif is incompatible filetype.  Try graceful_errors=True")
                        print(value)
                
                # import sys

                # import jieba
                # # import jieba.posseg as pseg
                # # words = pseg.cut(text)
                text =''.join(re.split(' +', text)).strip()
                text =''.join(re.split('\n+', text)).strip()
                print(text)
                print('chinese')
                filtrate = re.compile(u'[^\u4E00-\u9FA5]')
                text = filtrate.sub(r' ', text)#replace
                print(text)
                if( 2>len(text)):
                        len0=len0+1
                lenword=lenword+len(text)
                if(len0>3 and len0 > lenword ):
                        print('已经有三次空白了  我要换方式')
                        return find_oconversation(tmpf)
                if(len(text)==0):
                        continue
                # print('img2gray')
                # croped  = cv2.imread(regionpath)
                # img2gray = cv2.cvtColor(croped,cv2.COLOR_BGR2GRAY)
                # need_img = cv2.adaptiveThreshold(img2gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 15) 
                # cv2.imwrite(regionpath, need_img, [int(cv2.IMWRITE_PNG_COMPRESSION), 0]) 
                # text = ''
                # try:			
                #         text = image_file_to_string(regionpath, graceful_errors=True)	
                # except errors.Tesser_General_Exception:
                #         print("fnord.tif is incompatible filetype.  Try graceful_errors=True")
                #         print(value)
                # text =''.join(re.split(' +', text)).strip()
                # text =''.join(re.split('\n+', text)).strip()
                # print(text)
                # print('chinese')
                # filtrate = re.compile(u'[^\u4E00-\u9FA5]')
                # text = filtrate.sub(r' ', text)#replace
                # print(text)

                if   leftc==1:

                        dict = {"a" : "left", "b" : regionpath, "c" : [i, j, w, h], "d" : text, "e" : tmpf, "p" : "https://lucky.kuaiduodian.com/love_bot/images/tmp_testtmp/"+os.path.basename(regionpath)}
                        conversation.append(dict)
                        # conversation.append(['left',regionpath,points,text])
                        cv2.polylines(closed,[points],True,(255,0,0),2)  
                else:
                        dict = {"a" : "right", "b" : regionpath, "c" : [i, j, w, h], "d" : text, "e" : tmpf, "p" : "https://lucky.kuaiduodian.com/love_bot/images/tmp_testtmp/"+os.path.basename(regionpath)}
                        conversation.append(dict)
                        # conversation.append(['right',regionpath,points,text])
                        cv2.polylines(closed,[points],True,(0,255,0),4)           
                
                
                #print(points)
                #cv2.polylines(closed,[points],True,(255,0,0),2)# draw rectangle in blue color
        #print(conversation)
        if(5 > lenword ):
                print('小于5个字 我要换方式 '+str(lenword))
                return find_oconversation(tmpf)
        conversation = sorted(conversation, key = fkey)
        print('last-----------------------------')
        print(conversation)
        conversationlast = []
        conversationlastttt = ''
        left =0
        for colour in conversation:  
                if colour['a'] == 'left':
                        if(left==2 and conversationlastttt != ''):
                                conversationlast.append(conversationlastttt)
                                conversationlastttt =''
                        left =1
                        if(conversationlastttt == ''):
                                conversationlastttt = conversationlastttt+colour['d'] 
                        else:
                                conversationlastttt = conversationlastttt+','+colour['d'] 
                            
                        print ( '>>>'+colour['d'] )
                else:   
                        if(left==1 and conversationlastttt != ''):
                                conversationlast.append(conversationlastttt)
                                conversationlastttt =''
                        left =2       
                        if(conversationlastttt == ''):
                                conversationlastttt = conversationlastttt+colour['d'] 
                        else:
                                conversationlastttt = conversationlastttt+','+colour['d'] 
                        print ( colour['d']+"<<<" )
        if( conversationlastttt != ''):
                conversationlast.append(conversationlastttt)
        print(conversationlast)
        jsObj = json.dumps(conversation,  skipkeys = True,ensure_ascii=False,indent=2)  
        fileObject = open(rootdir + "tmp_conversation/json"+tmpb+".json", 'w',  -1, 'utf-8')  
        fileObject.write(jsObj)  
        fileObject.close()
        dumphtmlfile(rootdir + "tmp_conversation/json"+tmpb+".html" ,conversation,tmpf)
        file_object = open(rootdir + 'tmp_index.html' , "a+", -1, 'utf-8') 
        file_object.write('<a href="https://lucky.kuaiduodian.com/love_bot/images/tmp_conversation/json' +tmpb+'.html" target="_blank">'+tmpf+ '</a><br/>')
        file_object.close( )
        cv2.imwrite(rootdir + "tmp_conversationbef/"+tmpb, closed, [int(cv2.IMWRITE_PNG_COMPRESSION), 0])  
 
        return conversationlast
