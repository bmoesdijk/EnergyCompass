# DSMR P1 uitlezen
# (c) 10-2012 - GJ - gratis te kopieren en te plakken
versie = "1.0"
import sys
import serial
import signal
import os

##############################################################################
#Main program
##############################################################################
print ("DSMR P1 uitlezen",  versie)
print ("Control-C om te stoppen")
print ("Pas eventueel de waarde ser.port aan in het python script")

#Set COM port config
ser = serial.Serial()
ser.baudrate = 115200
ser.bytesize=serial.EIGHTBITS
ser.parity=serial.PARITY_NONE
ser.stopbits=serial.STOPBITS_ONE
ser.xonxoff=0
ser.rtscts=0
ser.timeout=20
ser.port="/dev/ttyUSB0"

#Some variables:
gasCountId="1:24.2.1"
EnergyT1CountId="0:1.8.1"
EnergyT2CountId="0:1.8.2"
P1_data=""

#check sudo user access.
user = os.getenv("SUDO_USER")
#if user is None:
#        print "Dit script heeft 'root' access nodig. Gebruik 'sudo' om het script te start"
#        sys.exit(0)

def signal_handler(signal, frame):
        print('Exiting Ctrl+C detected')
        ser.close()
        sys.exit(0)

def Telegram(gasCountId,EnergyT1CountId,EnergyT2CountId,P1_data):
	#Open COM port
	try:
		ser.open()
	except:
		sys.exit ("Fout bij het openen van %s."  % ser.name)      
	#Initialise
	while True:
		try:
			p1_raw = ser.readline()
		except:
			sys.exit ("Cannot currently read from Seriel port %s." % ser.name )
		p1_str=str(p1_raw)
		p1_line=p1_str.strip()
		P1_data = P1_data + (p1_line + "\n")
		if "!" in p1_str:
			if EnergyT1CountId in P1_data and gasCountId in P1_data:
				#return P1_data
				print(P1_data)
			else:
				print("Incomplete telegram received. Waiting for next.\n")
				#Clear any incomplete data from our buffer
				P1_data = ""
				continue

signal.signal(signal.SIGINT, signal_handler)
P1_data = Telegram(gasCountId,EnergyT1CountId,EnergyT2CountId,P1_data)
#print(P1_data)
#ser.close()
#exit(0)
