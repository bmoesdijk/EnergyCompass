 <?php
#Date: 25-Jul-2017
#version: 1.0 
#Author: B. van de Moesdijk
#License: 
/*	This file is part of EnergyCompas.

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
--------------------------------------------------------------------------------------    
    For tracing and bugfixing purposes use the following lines anywhere in the 
    script code to log to syslog (/var/log/messages on a Synology NAS)
    >>>
    openlog('getMeterBrands.php', LOG_CONS | LOG_NDELAY | LOG_PID, LOG_USER | LOG_PERROR);
		syslog(LOG_INFO, "My logging text");
		closelog();
	<<<
-------------------------------------------------------------------------------------- 
*/
 
         if (PHP_SAPI === 'cli') {
              $Interval = $argv[1];
        }
        else {
              $Interval = $_REQUEST["runTime"];                   
        }

/* This script will receive crontab update text from a web interface and stores it in the 
crontab file /etc/crontab and restarts the crontab daemon. 
Set some veriables we need. */
$webDir = "/volume1/web/energycompass/tools";
$fileName = "crontab";
$username = get_current_user();
$comments = "";
$cronJob = "*/$Interval	*	*	*	*	root	/volume1/web/energycompass/P1_Interface/getMeterData.sh";
$section = "#[getMeterData]";
$filePath = "/var/spool/cron/crontabs/http";
$start = "0";
$cmd = "$webDir/EC_Crontab.sh";

/* When no new interval value is supplied exit this procedure */
if ( $Interval == "0" || $Interval == "-1" ) {
	unlink($filePath . "/" . $fileName);
   	#exec ( $cmd.' '.'restart', $output, $return_var );
	/* check the return value to see if the refresh of crontab was successfull */
	#If ($return_var == 0) {
		if ( $Interval == "0" ) {
			echo "Ophalen gebruiksgegevens gestopped";
		} else {
			echo "Ophalen gebruiksgegevens via DSM Taakbeheer.";
		}
	#} else {
	#	echo json_encode($output);
	#}
 exit(0);
 }
/* Check if the file exists in the filepath that we set in the initial variables 
at the top */
if (file_exists($filePath . "/" . $fileName)) {
			$fw = fopen($filePath . "/" . $fileName, "w");
			fwrite ($fw, $cronJob . chr(10));
			fclose($fw);
			exec ( $cmd.' '.'restart', $output, $return_var );
			/* check the return value to see if the refresh of crontab (crontab -f) 
			was successfull */
			If ($return_var == 0) {
				echo "Tijdsinterval voor ophalen verbruiksgegevens ingesteld";
			} else {
				echo "Restart Crontab daemon mislukt.";
			}
	}
/* If the file does not exists exit with an error */	
else {
		if (!realpath($filePath)) {
			mkdir ("/var/spool/cron/crontabs/http", 0755, true);
			chown ("/var/spool/cron/crontabs/http", http);
			chgrp ("/var/spool/cron/crontabs/http", http);
			echo "Crontab directory $filePath bestaat niet ";
		}
		if (!file_exists($filePath . "/" . $fileName)) {
			touch("/var/spool/cron/crontabs/http/crontab");
			chown ("/var/spool/cron/crontabs/http/crontab", http);
			chgrp ("/var/spool/cron/crontabs/http/crontab", http);
			chmod ("/var/spool/cron/crontabs/http/crontab", 0777);
			echo "Crontab file aangemaakt voor gebruiker " . $username . Chr(10);
		}
		$fw = fopen($filePath . "/" . $fileName, "w");
		fwrite ($fw, $cronJob . chr(10));
		fclose($fw);
		exec ( $cmd.' '.'restart', $output, $return_var );
		/* check the return value to see if the refresh of crontab (crontab -f) 
		was successfull */
		If ($return_var == 0) {
			echo "Tijdsinterval voor ophalen verbruiksgegevens ingesteld";
		} else {
			echo "Restart Crontab daemon mislukt.";
		}
	
    }	
?>