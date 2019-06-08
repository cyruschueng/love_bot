# -*- coding: utf-8 -*-
"""Utility functions for processing images for crop"""
import os
import pytesser
import sys,time
from PIL import Image,ImageEnhance
import imghdr

def cropit(file):
    # im =Image.open('D:\ProgramData\Microsoft\Helpaup\jilv\WifiPhoto0820\IMG_0001.JPG')
    imgType = imghdr.what(file)
    if imgType!='jpeg' and imgType!='png' :
        return False
    im =Image.open(file)
    print(im.format)
    if im.format!='JPEG':
        return False
    print(im)
    # 获得图像尺寸:
    w, h = im.size
    print(w)
    print(h)
    # 缩放到50%:im.thumbnail((w//2, h//2))

    ww  = w//8
    right = w - ww
    lower = h - ww + 1
    box = (ww,ww-10,right,lower)  #设置要裁剪的区域
    region = im.crop(box)     #此时，region是一个新的图像对象。
    # region = region.convert('L')
    #region.show()#显示的话就会被占用，所以要注释掉
    region.save("e:/image_code.jpg")
    return True
