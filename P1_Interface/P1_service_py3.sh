#!/bin/sh
#Name: 	p1_service.py'
#Date: 		07-Dec-2021
#version:	1.4
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
python3="/usr/local/bin/python3"
pythonDir="var/packages/py3k/target/usr/local/bin"
sitePackages="/var/packages/py3k/target/usr/local/lib/python3.8/site-packages"
script="/volume1/web/energycompass/P1_Interface/p1_service_py3.py"
#Declare static Array for the required pyton site packages 
declare -a arrayPackages=("pymysql" "pyserial" "serial" "datetime" "httpserver" "pydect200")
# get length of an array
arraylength=${#arrayPackages[@]}
port="8080"
Date=$(date +%d-%h-%Y/%H:%M:%S)
#suffix=$(date +%d-%h-%Y)
sourceDir="/volume1/web/energycompass"
log="$sourceDir/log/p1_serviceStartup_py3.log"

#Functionscat 
depCheck() {
	echo "Checking if all dependancy packages are installed"
	# Use for loop to read all values from the dependancy package array
	for (( i=1; i<${arraylength}+1; i++ ));
	do
		if ($python3 -m pip show ${arrayPackages[$i-1]} | grep "Version");
		then
  			echo " ${arrayPackages[$i-1]} installed."
  		else
  			echo " ERROR: - ${arrayPackages[$i-1]} NOT installed."
  			echo "use: 'python3 -m pip install ${arrayPackages[$i-1]}' "
  			exit
  		fi
	done	
	echo "$Date - All dependancy packages installed." >> $log
	echo "All dependancy packages installed."
	#Check if the FTDI interface is installed and up.
	echo "$Date - Check availability of FTDI device" >> $log
	echo "Check availability of FTDI device"
	#lsusb
	response="$(dmesg | grep 'FTDI USB Serial Device converter now attached')"

	#First check if the FTDI interface is up.
	#If not install the drivers and bring up the interface
	case "$response" in
		*FTDI*)
			#If the FTDI interface is detected start the python script to get the data from the smart meter
			echo "$Date - FTDI Interface installed and available" >> $log
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
			echo "ERROR: - FTDI Interface NOT found. Check logfile for more info"
			return 1
		break
		;;
	esac
}

depInstall() {
	echo "$Date - Checking library files availability." >> $log
	#Check if the driver files are installed. If not copy them.
	if [ ! -f /lib/modules/usbserial.ko ] || [ ! -f /lib/modules/ftdi_sio.ko ]; then
		echo "$Date - ERROR - Library files NOT found." >> $log
		echo "ERROR: - Library files NOT found."
		return 1
	fi
	#Install the drivers for the FTDI interface
	echo "$Date - Installing FTDI driver files" >> $log
	sudo insmod /lib/modules/usbserial.ko
	sudo insmod /lib/modules/ftdi_sio.ko
	#create the interface ttyUSB0
	echo "$Date - Creating FTDI interface /dev/ttyUSB0" >> $log
	mknod /dev/ttyUSB0 c 188 0
	tty -F /dev/ttyUSB0 1200 sane evenp parenb cs7 -crtscts
	sudo chmod 777 /dev/ttyUSB0
	#After interface driver auto installation, start the service process
	return 0
}

#Main
#Check if dependancy packages are installed.
if [ -z $1 ]; then
	echo "Usage: P1_service start | stop | status"
else
	case $1 in
		start) 
			if ps -ef | grep $Process | grep -v grep > /dev/null || netstat -na | grep :$port > /dev/null; then
					echo "$Process is already running or port $port is still allocated"
					ps -ef | grep $Process
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
						fi
					fi	
			fi
		break
		;;
		stop) 
			ps -ef | grep p1_service_py3 | grep -v grep | awk '{print $2}' | xargs kill
			echo "P1_service Stopped"
		break
		;;
		status)
			if !(ps -ef | grep $Process | grep -v grep > /dev/null); then
				echo "P1_service Stopped"
			fi
			ps -ef | grep "[p]1_service_py3"
			netstat -na | grep :$port
		break
		;;
		*)
	esac
fi
