#!/usr/bin/python
#!/volume1/@appstore/py3k/usr/local/bin/python3

import p1_webserver_py3
import p1_interface_py3
import socket
import datetime, time
import signal
from multiprocessing import Process,  Queue
import subprocess 

#Catch CNTR+C to exit the program
def signal_handler(signal, frame):
    print('Exiting Ctrl+C detected')
    p1_interface.shutdown()
    p1_webserver.shutdown()

if __name__ == '__main__':
	I_L1queue = Queue(maxsize=4)
	I_L2queue = Queue(maxsize=4)
	I_L3queue = Queue(maxsize=4)	

	while True:
		try:
			sockstat = True
			socket.setdefaulttimeout(None)
		except Exception:
			sockstat = False

		if sockstat:
			break
	now = datetime.datetime.now()
	currentDateTime = now.strftime("%d-%m-%Y %H:%M")
	print("Starting P1_webserver at %s" % currentDateTime)
	p1 = Process(target=p1_webserver_py3.startServer, args=(I_L1queue, I_L2queue, I_L3queue,), name="p1_webServer")
	p1.start()
	time.sleep(1)
	print("Connecting P1 Serial Interface")
	p2 = Process(target=p1_interface_py3.getData, args=(I_L1queue, I_L2queue, I_L3queue,), name="p1_Interface")
	p2.start()
	p1.join()
	p2.join()