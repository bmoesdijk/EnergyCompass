#!/bin/sh
#========================================================
#Restore database from backup:
#========================================================

baseDir="/volume1/web/energycompass/backup"
Date=`date`
MYSQL=`which mysql`

echo "=============================================================================="
echo "                  Beginning SmartMeter database restore                       "
echo "=============================================================================="
echo " This script can restore the SmartMeter database to the last backup           "
echo " Prerequisite is that the Backup script DB_Backup.sh is scheduled in cron     "
echo " This script will display the available backup files from the backup directory"
echo "                                                                              "
echo "=============================================================================="
echo "                Available SmartMeter database backup files                    "
echo "=============================================================================="
ls -l $baseDir
echo ""
echo "Provide the SmartMeter database backup file:"
read DB_Backup_File
echo "$Date: Press 'Enter' when asked for password or type the mySQL password when set"
echo "$Date: Rebuilding the database..."

$MYSQL -h localhost -u root -p SmartMeter < "$baseDir/$DB_Backup_File"
echo "SmartMeter database resored"
exit