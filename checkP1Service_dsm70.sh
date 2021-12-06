#!/bin/sh
#Name: 	checkP1Service.sh'
#Date: 		06-Aug-2021
#version:	1.1
#Author: 	B. van de Moesdijk
#License: 
#   This file is part of EnergyCompas.
#
#   EnergyCompass is free software: you can redistribute it and/or modify
#   it under the terms of the GNU General Public License as published by
#   the Free Software Foundation, either version 3 of the License, or
#   any later version.
#
#   EnergyCompass is distributed in the hope that it will be useful,
#   but WITHOUT ANY WARRANTY; without even the implied warranty of
#   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#   GNU General Public License for more details.
#
#   You should have received a copy of the GNU General Public License
#   along with EnergyCompass.  If not, see <http://www.gnu.org/licenses/>.
#
#Variables
Process="p1_service_py3.py" 
python3="/usr/bin/python3"
pythonDir="var/packages/py3k/target/usr/local/bin"
sitePackages="/volume1/homes/admin/.local/lib/python3.8/site-packages"
script="/volume1/web/energycompass/P1_Interface/p1_service_py3.py"
#Declare static Array for the required pyton site packages 
declare -a arrayPackages=("pymysql" "pyserial" "serial" "datetime" "httpserver" "pydect200")
# get length of an array
arraylength=${#arrayPackages[@]}
port="8080"
Date=$(date +%d-%h-%Y/%H:%M:%S)
#suffix=$(date +%d-%h-%Y)
sourceDir="/volume1/web/energycompass"
log="$sourceDir/log/checkP1Service.log"


#Functionscat
depInstall() {
	echo "$Date - Checking library files availability." >> $log
	#Check if the driver files are installed. If not copy them.
	if [ ! -f /lib/modules/usbserial.ko ] || [ ! -f /lib/modules/ftdi_sio.ko ]; then
		echo "$Date - Library files not found." >> $log
		exit(0)
	fi
	#Install the drivers for the FTDI interface
	if ! sudo lsmod | grep usbserial > /dev/null && ! sudo lsmod | grep ftdo_sio > /dev/null; then
		echo "$Date - Installing FTDI driver files" >> $log
		sudo insmod /lib/modules/usbserial.ko
		sudo insmod /lib/modules/ftdi_sio.ko
	fi
	#create the interface ttyUSB0
	if [ ! -f /dev/ttyUSB0 ]; then
		echo "$Date - Creating FTDI interface /dev/ttyUSB0" >> $log
		sudo mknod /dev/ttyUSB0 c 188 0
		tty -F /dev/ttyUSB0 1200 sane evenp parenb cs7 -crtscts
		sudo chmod 777 /dev/ttyUSB0
	fi
	#After interface driver auto installation, start the service process
	return 0
}

depCheck() {
	echo "Checking if all dependancy packages are installed"
	# Use for loop to read all values from the dependancy package array
	for (( i=1; i<${arraylength}+1; i++ ));
	do
		if ($python3 -m pip show ${arrayPackages[$i-1]} | grep "Version");
		then
  			echo " ${arrayPackages[$i-1]} installed."
  		else
  			echo " ${arrayPackages[$i-1]} not installed." >> $log
  			echo "use: 'python3 -m pip install ${arrayPackages[$i-1]}' " >> $log
  			exit
  		fi
	done	
	echo "All dependancy packages installed."
	#Check if the FTDI interface is installed and up.
	echo "Check availability of FTDI device"
	#lsusb
	response="$(dmesg | grep 'FTDI USB Serial Device converter now attached')"

	#First check if the FTDI interface is up.
	#If not install the drivers and bring up the interface
	case "$response" in
		*FTDI*)
			#If the FTDI interface is detected start the python script to get the data from the smart meter
			echo "FTDI Interface installed and available"
			if ! [ -x /dev/ttyUSB0 ]
			then
				sudo chmod 777 /dev/ttyUSB0
			fi
			return 0
		break
		;;
		*) 
			echo "$Date - FTDI Interface NOT found. Check /dev/ttyUSB0" >> $log
			echo "Unplug the P1 serial-USB connector from the server and check if the FTDI device returns. Use:" >> $log
			echo "dmesg | grep 'FTDI'" >> $log
			echo "FTDI Interface NOT found. Check logfile for more info"
			return 1
		break
		;;
	esac
}


#Main
#Check if dependancy packages are installed.
if ps -ef | grep $Process | grep -v grep > /dev/null; then
	echo "$Process is already running"
else
	depCheck $Date
    depCheckResp=$?
	if [ $depCheckResp -eq 0 ]; then
		echo "Starting $Process"
		nohup $python3 $script >> $log &
	else
		depInstall $Date
		depInstallResp=$?
		if [ $depInstallResp -eq 0 ]; then
			echo "Starting $Process"
			nohup $python3 $script >> $log &
		else
			echo "Start $Process FAILED" >> $log
		fi
	fi	
fi
