<?php
#Date: 04-May-2021
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
# php74 ScreenConfig.ph "SELECT * FROM ScreenConfig WHERE ScreenName='Back';"
        if (PHP_SAPI === 'cli') {
              $location = $argv[1];
        }
        else {
              $location = $_POST["location"];             
        }
        
		$curDate = date("d-m-Y");
		$linesShown = 100;
		$fileName = "/volume1/FamilyDocuments/HomeNetwork/HomeAutomation/log/" . $location . "Control_" . $curDate . ".log";
//Main
        if ( file_exists($fileName )) {
            $file = new SplFileObject($fileName);
             $file->seek(PHP_INT_MAX); // cheap trick to seek to EoF
		    $totalLines = $file->key(); // last line number

		    // output the last twenty lines
		    if ( $totalLines >= $linesShown ) {
		        $reader = new LimitIterator($file, $totalLines - $linesShown); //Start rearing from (totalLines - $lineShown) untill the end line
    		} else {
	    	     $reader = new LimitIterator($file, 0, $totalLines); //Start reading from the begin untill the end line
		    }
		    foreach ($reader as $line) {
    		    print $line . "\n"; // includes newlines
            }
        } else {
             print "\n";
             print "\n";
             print "\n";
             print "\n";
             print "\n";
             print "\n";
             print "\n";
             print "                                                  ERROR: NO LOG-DATA FOUND FOR TODAY";
    }
    ?>