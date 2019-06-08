"""Test for exceptions raised in the tesseract.exe logfile"""

class Tesser_General_Exception(Exception):
	pass

class Tesser_Invalid_Filetype(Tesser_General_Exception):
	pass

def check_for_errors(logfile = "E:\logs.txt"):
	inf = open(logfile , "r+", -1, 'utf-8')
	text = inf.read()
	inf.close()
	# All error conditions result in "Error" somewhere in logfile
	if text.find("Error") != -1:
		raise Tesser_General_Exceptiont
