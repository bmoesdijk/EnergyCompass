 <?php
#Date: 05-Nov-2021
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
    openlog('getP1Statuss.php', LOG_CONS | LOG_NDELAY | LOG_PID, LOG_USER | LOG_PERROR);
		syslog(LOG_INFO, "My logging text");
		closelog();
	<<<
-------------------------------------------------------------------------------------- 
*/
 
         if (PHP_SAPI === 'cli') {
              $param = $argv[1];
        }
        else {
              $param = $_REQUEST["param"];                   
        }
        
        /*Main*/
        /*This script will obtain the status of the p1 service interface*/
        $webDir = "/volume1/web/energycompass";
        $return_val1 = array();
        $return_val2 = array();
        $count = 0;
        
        if ( $param != "status" ) {
                $cmd = "sudo -u admin $webDir/P1_Interface/P1_service_py3.sh ". $param;
                exec ($cmd, $return_val1 );
                foreach ( $return_val1 as $value ) {
        		    echo "$return_val1[$count]. \n"; // For tracing purpose
        		    $count++;
        		}
                sleep(2);
        } 
             
        $count = 0;
     	$cmd = "$webDir/P1_Interface/P1_service_py3.sh status";
       	exec ($cmd, $return_val2 );
     	if ( count($return_val2) >=0 ) {
         	foreach ( $return_val2 as $value ) {
        		echo "$return_val2[$count]. \n"; // For tracing purpose
        		if (  strpos($return_val2[$count], "LISTEN") !== false ) {
        			echo "Running";
        			exit(0);
        		}  elseif ( strpos($return_val2[$count], "port 8080 is still allocated") !== false ||  strpos($return_val2[$count], "TIME_WAIT") !== false ) {
        			echo "TimeWait";
        			exit(0);
        		}  elseif ( strpos($return_val2[$count], "Stopped") !== false ) {
        			echo "Stopped";
        		}
        		
        		$count++;
        	}
        	unset($count);
        }
 
 ?>