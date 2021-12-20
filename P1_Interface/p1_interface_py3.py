#DSMR P1 smartmeter data retreival
#Date: 09-Dec-2020
#version: 2.0 
#Author: B. van de Moesdijk
#License: 
"""	This file is part of EnergyCompas.

    EnergyCompass is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    any later version.

    EnergyCompass is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with EnergyCompass.  If not, see <http://www.gnu.org/licenses/>.
"""
##############################################################################
#Version history:
##############################################################################
'''
2.3 BvdM  Updated for Python 3
Python 3 support                                                         
'''
##############################################################################
#Define dependencies
##############################################################################   
import logging
import pymysql
import sys
import datetime
import time
import serial
import signal
import subprocess
import ToggleDect200
from multiprocessing import Queue
##############################################################################
#Initialize the logger                                                                 
##############################################################################
logger = logging.getLogger('p1_interface')
hdlr = logging.FileHandler('/volume1/web/energycompass/log/p1_interface_py3.log')
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s %(message)s',  datefmt="%m/%d/%Y %H:%M:%S %Z")
hdlr.setFormatter(formatter)
logger.addHandler(hdlr)
loglevel = logger.setLevel("DEBUG")
#Loglevel definition:
# xyz where:
# x = loglevel
#       1 = Info
#       2 = Debug
#       3 = Warning
#       4 = Error
# y = loglevel type
#       0 = Informal
#       1 = Known error Will try to recover
#       2 = Unknown error. No recovery. Exit program
# z = loglevel number increment for same error type in the code

##############################################################################
#Define our variables
##############################################################################
#Initialise the serial interface
version = "2.8.3"
ser = serial.Serial()
#Define the counter ID's
gasCountId="0-1:24.2.1"
EnergyT1CountId="1-0:1.8.1"
EnergyT2CountId="1-0:1.8.2"
EnergyT1DelivId="1-0:2.8.1"
EnergyT2DelivId="1-0:2.8.2"
currentPL1Id="1-0:22.7.0"
currentIL1Id="1-0:31.7.0"
currentPL2Id="1-0:42.7.0"
currentIL2Id="1-0:51.7.0"
currentPL3Id="1-0:62.7.0"
currentIL3Id="1-0:71.7.0"
#Fritz-Box variables
un = "smarthome";
pw = "smarthome123";
AIN = "116570150008"; #AIN of the FritzDect200 device that controls the chargeunit.
#AIN = "087610257847" #for test usage                                                                                                                
#Define variables
p1_flo = None
t1_flo = None
t2_flo = None
td1_flo = None
td2_flo = None
#Hour and minute that the powermanagement should not be checked at night 
offhour = 1
offmin = 0
onhour = 7
onmin = 0

def signal_handler(signal, frame):
        print('Exiting Ctrl+C detected')
        logger.info("(103): Exiting program Ctrl+C detected.")
        ser.close()
        sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

##############################################################################
#Function to obtain single element from database with SQL query                                                             
##############################################################################
def getDataFromDb(query):
    #Initialize the database connection.                                                              
    DBconnect = pymysql.connect(host="127.0.0.1",port=3307,user="root",passwd="",db="SmartMeter" ) 
    cursor = DBconnect.cursor() 
    DBconnect.autocommit(True) #Autocommit all changes before closing the database.  
    #Use the database connection to get the Solar setting from the database.                                                                                                                           
    cursor.execute(query)  
    return cursor.fetchone()[0]
    DBconnect.close()

##############################################################################
#Function to calculate the delta time between the current time and the last entry time in the db.
##############################################################################
def getDeltaTime(prevTime): #NOT USED
    prevTime = prevTime.replace("-",",")
    prevTime = prevTime.replace(":",",")
    prevTime = prevTime.replace(" ",",")
    prevTime = (prevTime.split(","))
    prevTime = datetime.datetime(int(prevTime[0]),int(prevTime[1]),int(prevTime[2]),int(prevTime[3]),int(prevTime[4]),int(prevTime[5]))
    curTime = datetime.datetime.now()
    curTime = datetime.datetime(curTime.year, curTime.month, curTime.day, curTime.hour, curTime.minute, curTime.second)
    deltaTime= (curTime - prevTime).total_seconds()
    prevTime = curTime
    return deltaTime, prevTime

##############################################################################
#Prepair P1 telegram data for storage
##############################################################################
def processTelegram(Solar, p1_telegram):
    #Obtain telegram data and start processing the telegram response array.
    try:
        #Seek the gas counter value from the telegram array based on the Id we configured
        start = p1_telegram.find(gasCountId) + 26
        end = p1_telegram.find('*', start)
        p1_str = p1_telegram[start:end]
        p1_flo = float(p1_str)
        #print("Gas meterstand: %sm" % p1_flo)
        #Seek the Electricity counter t1 value from the telegram array based on the Id
        start = p1_telegram.find(EnergyT1CountId) + 10
        end = p1_telegram.find('*', start)
        p1_str = p1_telegram[start:end]
        tu1_flo = float(p1_str)
        #print("T1 meterstand: %sKWh" % tu1_flo)
        #Seek the Electricity counter t1 value from the telegram array based on the Id
        start = p1_telegram.find(EnergyT2CountId) + 10
        end = p1_telegram.find('*', start)
        p1_str = p1_telegram[start:end]
        tu2_flo = float(p1_str) 
        #print("T2 meterstand: %sKWh" % tu2_flo)

        if Solar == 1:
            #Seek the Electricity counter t1 value from the telegram array based on the Id
            start = p1_telegram.find(EnergyT1DelivId) + 10
            end = p1_telegram.find('*', start)
            p1_str = p1_telegram[start:end]
            td1_flo = float(p1_str) 
            #print("T1 Leveringstand: %s KWh" % td1_flo)
            istart = p1_telegram.find(EnergyT2DelivId) + 10
            end = p1_telegram.find('*', start)
            p1_str = p1_telegram[start:end]
            td1_flo = float(p1_str) 
            td2_flo = float(p1_str) 
            #print("T2 Leveringstand: %s KWh" % td2_flo)
        else:
            td1_flo = 0.0
            td2_flo = 0.0
        ########################################################################################## 
        # Get the last values out of the database first to calulate the usage with the new values
        ##########################################################################################
        # Counter T1 & T2 optionally Delivery T1 & T2 when the solar  boolean was set in the webGUI
        PrevTu1_flo = 0.0
        PrevTd1_flo = 0.0
        PrevTu1_flo = float(getDataFromDb("SELECT countT1 from Electricity ORDER BY id DESC LIMIT 1"))
        if ( PrevTu1_flo is None ): 
            PrevTu1_flo = "0.0"  #In case there no response from the DB.        
        t1Usage = tu1_flo - PrevTu1_flo 
        #print("t1_Usage: %s" % t1Usage)
        if ( t1Usage < 0 ):
            t1Usage = 0 #New meter installed
        if Solar == 1:
            try:
                    PrevTd1_flo = float(getDataFromDb("SELECT deliverT1 from Electricity ORDER BY id DESC LIMIT 1"))
                    if ( PrevTd1_flo is None ): 
                        PrevTd1_flo = "0.0"  #In case there no response from the DB.        
                    t1Deliv = td1_flo - PrevTd1_flo
            except:
                    logger.error("(411): Unexpected error: %s", sys.exc_info()[1])
                    pass

        # Counter T2 & Delivery T2
        PrevTu2_flo = 0.0
        PrevTd2_flo = 0.0
        PrevTu2_flo = float(getDataFromDb("SELECT countT2 from Electricity ORDER BY id DESC LIMIT 1"))
        if ( PrevTu2_flo is None ): 
                PrevTu2_flo = "0.0" #In case there no response from the DB.
        t2Usage = tu2_flo - PrevTu2_flo
        #print("t2_Usage: %s" % t2Usage)
        if ( t2Usage < 0 ):
            t2Usage = 0 # New meter installed
        if ( Solar == 1 ):
            try:
                PrevTd2_flo = float(getDataFromDb("SELECT deliverT1 from Electricity ORDER BY id DESC LIMIT 1"))
                if ( PrevTd2_flo == None ): 
                    PrevTd2_flo = "0.0"  #In case there no response from the DB.
                else:
                    t2Deliv = td2_flo - PrevTd2_flo
            except:
                logger.error("(412): Unexpected error: %s", sys.exc_info()[1])
                pass
        PrevGas_flo = 0.0
        PrevGas_flo = float(getDataFromDb("SELECT countVal from Gas ORDER BY id DESC LIMIT 1"))
        #print("PrevGas_flo: %s" % PrevGas_flo)
        #logger.info("PrevGas_flo: %s" % PrevGas_flo)
        #print("p1_flo: %s" % p1_flo)
        if ( PrevGas_flo is None ):
            logger.info("PrevGas id None")
            PrevGas_flo = 0.0  #In case there no response from the DB.
        G_Usage = p1_flo - PrevGas_flo
        #print("G_Usage: %s" % G_Usage)
        #logger.info("G_Usage: %10.2f" % G_Usage) #print as float, round to 2 decimal places in a 10-place field.
        if ( G_Usage < 0 ):
            G_Usage = 0 # New meter installed
        #print("Gas verbruik: %10.2f m" % G_Usage)
        #Total Usage since last read from the Smartmeter
        E_Usage = t1Usage + t2Usage
        #print("Elektrischiteitsverbruik: %10.2f KWh" % E_Usage)
        #logger.info("E_Usage: %10.2f" % E_Usage) #print as float, round to 2 decimal places in a 10-place field.
        if ( Solar == 1 ):
            E_Deliv = t1Deliv + t2Deliv
        else:
            E_Deliv = 0.0

        return tu1_flo, tu2_flo, td1_flo, td2_flo, p1_flo, E_Usage, G_Usage, E_Deliv
    except:
        logger.error("(413):  Unexpected error in processTelegram function: %s", sys.exc_info()[0])
        pass
        
##############################################################################
#Determine current current usage and load ballance if required.
##############################################################################
def loadManagement( p1_telegram, I_L1queue, I_L2queue, I_L3queue):
    try:
        start = p1_telegram.find(currentPL1Id) + 11
        end = p1_telegram.find('*', start)
        P_L1 = p1_telegram[start:end].strip("(")
        start = p1_telegram.find(currentIL1Id) + 11
        end = p1_telegram.find('*', start)
        I_L1 = p1_telegram[start:end].strip("(")
        I_L1 = "{0:.1f}".format(float(I_L1))
        #I_L1 = "{0:.1f}".format((float(P_L1) * 1000) / float(V_L1))
        #print("Amperage lijn 1: %s " % I_L1)
        ###################################
        start = p1_telegram.find(currentPL2Id) + 11
        end = p1_telegram.find('*', start)
        P_L2 = p1_telegram[start:end].strip("(")
        start = p1_telegram.find(currentIL2Id) + 11
        end = p1_telegram.find('*', start)
        I_L2 = p1_telegram[start:end].strip("(")
        I_L2 = "{0:.1f}".format(float(I_L2))
        #I_L2 = "{0:.1f}".format((float(P_L2) * 1000) / float(V_L2))
        #print("Amperage lijn 2: %s " % I_L2)
        ###################################
        start = p1_telegram.find(currentPL3Id) + 11
        end = p1_telegram.find('*', start)
        P_L3 = p1_telegram[start:end].strip("(")
        start = p1_telegram.find(currentIL3Id) + 11
        end = p1_telegram.find('*', start)
        I_L3 = p1_telegram[start:end].strip("(")
        I_L3 = "{0:.1f}".format(float(I_L3))
        #I_L3 = "{0:.1f}".format((float(P_L3) * 1000) / float(V_L3))
        #print("Amperage lijn 3: %s " % I_L3)
        ###################################
        #Use the database connection to get the LoadManagement setting from the database.
        loadMngt = getDataFromDb("select LoadMngt FROM Configuration ")
        #Fill the queue with the result value. The number of times we write it to the queue is equal 
        #to the number of times we need the value in the web client.
        while not I_L1queue.full():
            I_L1queue.put(I_L1)
        while not I_L2queue.full():
            I_L2queue.put(I_L2)
        while not I_L3queue.full():
            I_L3queue.put(I_L3)		 
        #Check if load management for line 1 (amperage L1) car charger is enabled and apply load management 
        #on the car-charger unit when required.
        now = datetime.datetime.now()
        now_time = now.time()
        #When 0; function is switched off in GUI when now_time falls withing the offhours, the powermanagement is skipped.
        if ( loadMngt != 0 and datetime.time(int(offhour),int(offmin)) < now_time > datetime.time(int(onhour),int(onmin)) ):
        	if ( float(I_L1) >= float(loadMngt) ):
        		powerMngt = ToggleDect200.main(un, pw, AIN, 'status')
        		if ( powerMngt == "OFF" ):
        			logger.info("(101): Charging unit interrupted.")
        			ToggleDect200.main(un, pw, AIN, 'on')
        	elif ( float(I_L1) + 16 < (float(loadMngt)) ):
        		powerMngt = ToggleDect200.main(un, pw, AIN, 'status')
        		if ( powerMngt == "ON" ):
        			logger.info("(102): Charging unit reconnected.")
        			ToggleDect200.main(un, pw, AIN, 'off')
    except:
        logger.error("(413): Unexpected error in loadManagement function: %s", sys.exc_info()[0])
        pass

########################################################################################## 
#Write the data to the Database
##########################################################################################
def writeToDb(Solar, tu1_flo, tu2_flo, td1_flo, td2_flo, p1_flo, E_Usage, G_Usage, E_Deliv):
    try:
        timestamp = str(datetime.datetime.now())
        DBconnect = pymysql.connect(host="127.0.0.1",port=3307,user="root",passwd="",db="SmartMeter" ) 
        cursor = DBconnect.cursor() 
        DBconnect.autocommit(True) #Autocommit all changes before closing the database.   
        if Solar == 1:
            #Write the Electricity values to the Electricity table
            cursor.execute("INSERT into Electricity (countT1, countT2, deliverT1, deliverT2, myUsage, myDelivery) \
            VALUES ( %s, %s, %s, %s, %s, %s)", (float(tu1_flo), float(tu2_flo), float(td1_flo), float(td2_flo), float("{0:.3f}".format(E_Usage)), float("{0:.3f}".format(E_Deliv))))
            #Write the gas counter only on the full hour. Intermediate counters are always 0 (empty)
            if ( ":00:" in timestamp ):
                #Update the usage in the last entry 
                #cursor.execute("update Gas SET myUsage = %s ORDER BY datetime DESC limit 1",(float("{0:.3f}".format(G_Usage)))) 
                #Write the Gas values to the Gas table. Because the P1 Interface only provides Gas data once every hour,
                #the data is from the past hour.
                cursor.execute("INSERT into Gas (countVal, myUsage, datetime) \
                VALUES ( %s, %s, DATE_ADD(now(),INTERVAL - 1 HOUR))", (float(p1_flo), float("{0:.3f}".format(G_Usage))))
        else:
            #Write the Electricity values to the Electricity table
            cursor.execute("INSERT into Electricity (countT1, countT2, myUsage) \
            VALUES ( %s, %s, %s)", (float(tu1_flo), float(tu2_flo), float("{0:.3f}".format(E_Usage))))
            #Write the gas counter only on the full hour.
            #Intermediate counters are always the same therefor we dont write these to the database.
            if ( ":00:" in timestamp ):
                #Write the Gas values to the Gas table. Because the P1 Interface only provides Gas 
                #data once every hour, the data is from the past hour.
                cursor.execute("INSERT into Gas (countVal, myUsage, datetime) \
                VALUES ( %s, %s, DATE_ADD(now(),INTERVAL - 1 HOUR))", (float(p1_flo),float("{0:.3f}".format(G_Usage))))
        DBconnect.close()
    except:
        DBconnect.close()
        logger.error("(414): Unexpected error in writeToDb Module: %s", sys.exc_info()[0])

##############################################################################
#Check time for writing to Database
##############################################################################
def checkDBWriteTime():
    try:
        DbDateTime =  str(getDataFromDb("SELECT datetime from Electricity ORDER BY id DESC LIMIT 1"))
        DbDateTime = DbDateTime.replace("-",",")
        DbDateTime = DbDateTime.replace(":",",")
        DbDateTime = DbDateTime.replace(" ",",")
        prev_time = DbDateTime.split(",")
        prev_minute = str(prev_time[4])
        prev_hour = str(prev_time[3])
        #writeToDbTime = ("00,15,30,45")
        writeToDbTime = str(getDataFromDb("SELECT getData from Configuration"))
        cur_time = datetime.datetime.now()
        cur_minute = "%02d" %cur_time.minute
        cur_hour = "%02d" %cur_time.hour
        if ( str(cur_minute) in writeToDbTime):
            if ( prev_minute == cur_minute and prev_hour != cur_hour):
                return "True"
            elif ( prev_minute != cur_minute ):
                return "True"
        else:
            return "False"
    except:
        logger.error("(415): Unexpected error in checkDBWriteTime Module: %s", sys.exc_info()[0])
        return "False"

##############################################################################
#Open the P1 interface port
##############################################################################
def openP1Port():
     #Initialize the database connection.    
    DBconnect = pymysql.connect(host="127.0.0.1",port=3307,user="root",passwd="",db="SmartMeter" ) 
    cursor = DBconnect.cursor() 
    DBconnect.autocommit(True) #Autocommit all changes before closing the database.                                                          
    cursor.execute("select * FROM MeterBrand WHERE Brand IN (select MeterBrand from Configuration) AND Model IN (select MeterType from Configuration)") 
    DbResponse = cursor.fetchall()
    for item in DbResponse:
            meterbrand = "%s" % item[1]
            baudrate = int(item[4])
            bytesize = int(item[5])
            parity = "%s" % item[6]
            stopbits = int(item[7])
            xonxoff = int(item[8])
            rtscts = int(item[9])
            timeout = int(item[10])
    #Set COM port config
    ser.baudrate = baudrate
    ser.bytesize = bytesize
    ser.parity = parity
    ser.stopbits = stopbits
    ser.xonxoff = xonxoff
    ser.rtscts = rtscts
    ser.timeout = timeout
    ser.port = "/dev/ttyUSB0"
       
    #Open the serial connection to the P1 imnterface.
    try:
        ser.open() 
        print("Running P1 deamon on %s" % ser.port)
        logger.info("(104): Running P1 deamon on %s" % ser.port)
        print("Running version %s" % version)
        logger.info("(105): Running version %s" % version)
        return 0
    except:
        ser.close()
        logger.debug("(321): Connecting to serial interface  %s failed"  % ser.port)
        return 1
    
##############################################################################
#Read the P1 interface (Main process)
##############################################################################
def getData( I_L1queue, I_L2queue, I_L3queue):
    #Define function variables
    Solar = getDataFromDb("Select Solar FROM Configuration")  
    L1_telegram2 = 0.0
    retryCount = 1

    #Open serial port
    openP1 = openP1Port()
    if ( openP1 == 0 ):
        logger.info("101): Serial port %s successfully opened" % ser.port)
        p1_data = ""
    else:
        sys.exit(logger.error("(422): Failed to open serial port. Check connection to serial port." ))

    #Start Main process-loop    
    while ser.is_open == True:
            try:
                cur_time = datetime.datetime.now()
                cur_minute = "%02d" %cur_time.minute
                cur_hour = "%02d" %cur_time.hour
                #if (cur_hour == "06" and cur_minute == "30"):
                    #raise Exeption
                p1_raw = ser.readline()
                p1_data = p1_data + str(p1_raw) #Add telegram line to our data buffer
                if ( "!" in p1_data ):
                    #logger.debug(p1_data)
                    #search the check buffer for our response data. If pressent continue
                    if ( EnergyT1CountId in p1_data and EnergyT2CountId in p1_data and \
                            gasCountId in p1_data and currentPL1Id in p1_data and \
                            currentPL2Id in p1_data and currentPL3Id in p1_data and \
                            currentIL1Id in p1_data and currentIL2Id in p1_data and \
                            currentIL3Id in p1_data and EnergyT1DelivId in p1_data and \
                            EnergyT2DelivId in p1_data  ):
                        loadManagement( p1_data, I_L1queue, I_L2queue, I_L3queue )
                        if (  checkDBWriteTime() == "True" ):
                            tu1_flo, tu2_flo, td1_flo, td2_flo, p1_flo, E_Usage, G_Usage, E_Deliv = processTelegram(Solar, p1_data)
                            writeToDb(Solar, tu1_flo, tu2_flo, td1_flo, td2_flo, p1_flo, E_Usage, G_Usage, E_Deliv)
                        p1_data = ""
                        p1_raw = ""
                        ser.flush()
                    else:
                        logger.info("(102): Incomplete telegram received. Waiting for next.")
                        #Clear any incomplete data from our buffer
                        p1_data = ""
                        p1_raw = ""
                        ser.flush()
                        #Wait for the next telegram to arrive.
            except Exception:
                #Try to reestablish the serial connection
                logger.error("(417): Cannot currently read from Seriel port %s." % ser.name )
                logger.debug("(301): Closing connection with seriel port %s." % ser.name )
                p1_data = ""
                p1_raw = ""
                ser.reset_input_buffer()
                ser.close
                time.sleep(60)
                logger.debug("(302): Retry (%d) to reastablish serial connection to %s." % (retryCount, ser.name) )
                openP1 = openP1Port
                retryCount = retryCount + 1
                if ( openP1 == 0 ):
                    logger.debug("(303): Previous error 417 revoked.")
                    Solar = getDataFromDb("Select Solar FROM Configuration")  
                    p1_data = ""
                    pass
                else:
                    logger.debug("(323): Check connection to serial port." )
                    pass
            
####End Main process-loop    

