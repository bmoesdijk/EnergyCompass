#!/bin/sh
#version:	1.1 
#Author:	B. van de Moesdijk
#Date:		09-May-2018
#Change: 	Delete old backup files when the last backup was successful
#License: 
#	This file is part of EnergyCompas.
#
#    EnergyCompass is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    any later version.
#
#    EnergyCompass is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with EnergyCompass.  If not, see <http://www.gnu.org/licenses/>.
#
#Define some variables
DB_domains=""
sqldbname="SmartMeter"
mysqldump="/usr/local/mariadb10/bin/mysqldump"
Date=`date`
storePath="/volume1/web/energycompass/backup/"
mysqlhost="localhost"
logFile="/var/log/EnergyCompassDB_bck.log"
mySQLdumpLog="/var/log/mySQLDump.log"
username="root"
password=""
suffix=$(date +%m-%d-%Y)

#Main
for (( i = 0; i < ${#DB_domains[@]}; i++))
do
	cpath=$storePath${DB_domains[$i]}
		if [ -d $cpath ]
			then
				echo "$Date - Backup path $cpath found. Starting backup" >> $logFile
			else
				echo "$Date - Creating $cpath" >> $logFile
				mkdir -p $cpath
		fi
		$mysqldump -v -c -h $mysqlhost --user $username --password=$password ${sqldbname[$i]} > ${cpath}/${sqldbname[$i]}_$suffix.sql 2> $mySQLdumpLog
		#Only delete old backup files when the last backup was successful
		if [ -f $mySQLdumpLog ] && [[ ! $(grep -R "error" $mySQLdumpLog) ]]
			then
				#Delete all backup files older than 30 days.
				find $storePath -name "*.sql"  -type f -mtime +30 -delete
		fi
		#Write the backup response to the backup logfile and delete the temporary response file
		cat $mySQLdumpLog >> $logFile | rm $mySQLdumpLog
		echo "$Date - Backup finished." >> $logFile
done
# To restore the backup file, use:
#mysql -u root -p<password> exampledb < /path/to/exampledb.sql
