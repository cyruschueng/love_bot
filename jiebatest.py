#-*- coding: UTF-8 -*-
import sys
import jieba

# import jieba.posseg as pseg
seg_list = jieba.cut("我来到北京清华大学", cut_all=True)

# print (' '.join(seg_list))  
# seg_list = jieba.cut("我来到北京清华大学", cut_all=False)
# print (' '.join(seg_list))  
# seg_list = pseg.cut("他来到了网易杭研大厦")  # 默认是精确模式
# print (", ".join(seg_list))

seg_list = jieba.cut_for_search("我来到北京清华大学")  # 搜索引擎模式
iresponses=[]
for r in seg_list:
    iresponses.append(r)
print (iresponses) 
# print (' '.join(seg_list))  
# print (", ".join(seg_list))
#
# with open('simple.txt') as f:
#     for ln in f:
#         if ln:
#             # print ln
#             seg_list = jieba.cut(ln,cut_all=False)
#             print '\n'.join(seg_list)
