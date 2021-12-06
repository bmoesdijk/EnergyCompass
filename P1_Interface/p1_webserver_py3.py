#!/usr/bin/python
#!/volume1/@appstore/py3k/usr/local/bin/python3
import sys
import http.server
import time
import datetime

from os import curdir, sep
from multiprocessing import Queue

httpServerPort = 8080
#Define the P1 counter ID's and some calculation helpers.
EnergyT1CountId = "0:1.8.1"
EnergyT2CountId = "0:1.8.2"
Pl1_float = 0.000
Pl1_prev = 0.000
Pl1_total = 0.000
Il1 = 0.000
Il1_float = 0.000

def shutdown():
    global httpd
    global please_die
    print("Shutting down")
    try:
        please_die.wait() # how do you do? 
        httpd.shutdown() # Stop the serve_forever
        httpd.server_close() # Close also the socket.
    except Exception:
        traceback.print_exc(file=sys.stdout)
      
# Setup a custom handler to be able to pass the nameserver
# to the webserver.
class myServer(http.server.ThreadingHTTPServer):
	def __init__(self,server_address,RequestHandlerClass, I_L1queue, I_L2queue, I_L3queue):
		http.server.ThreadingHTTPServer.__init__(self,server_address,RequestHandlerClass)
		self.I_L1queue = I_L1queue
		self.I_L2queue = I_L2queue
		self.I_L3queue = I_L3queue

# The actual class that implements the webserver.

class Handler(http.server.BaseHTTPRequestHandler):

	def do_OPTIONS(self):           
        	self.send_response(200, "ok")       
        	self.send_header('Access-Control-Allow-Origin', '*')                
        	self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        	self.send_header('Access-Control-Allow-Headers', 'X-Requested-With,content-type,If-Modified-Since') 
        			
	def do_GET(self):
			self.send_response(200)
			self.send_header('Access-Control-Allow-Origin', '*')
			self.send_header('Content-type', 'text/html; charset=utf-8')
			self.end_headers()
			I_L1 = self.server.I_L1queue.get_nowait()
			I_L2 = self.server.I_L2queue.get_nowait()
			I_L3 = self.server.I_L3queue.get_nowait()
			now = datetime.datetime.now()
			self.wfile.write(bytes("[{plot0:%s, plot1:%s, plot2:%s, 'scale-x':'%s',}]" % (I_L1, I_L2, I_L3, datetime.datetime.now().strftime("%H:%M:%S")),"utf-8"))
					
					
def startServer(I_L1queue, I_L2queue, I_L3queue):
	httpd = myServer(("", httpServerPort ), Handler, I_L1queue, I_L2queue, I_L3queue)
	print("Running server on %s:%s" % ("localhost", httpServerPort ))
	httpd.serve_forever()