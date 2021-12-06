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
              $query = $argv[1];
        }
        else {
              $query = $_POST["query"];             
        }
        
        /* The host name in which the database is available */
        $host = "127.0.0.1:3307";     
        /* The database port number */
        $port = 3306;
        /* The username to connect to the database */
        $usernm = "root";
        /* The password associated with the username */
        $passwd = "";
        /* The database to which to connect */
        $dbname = "ScreenControl";
        /* ---------------- */
        
        /* Connect to the database */
        $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
        /* turn autocommit on */
		$mysqli->autocommit(TRUE);
        if($mysqli->connect_error) {
          die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        }
        if (strpos($query, "SET") !== false) {
        	/* Run the query */
        	$result = $mysqli->query($query);
        	$mysqli->close();
        	if ($result === true) {
        		echo $result;
        	}
        	else { 
        		echo $result;
        	}
        }
        Else {	
        	/* Run the query */
        	if ($result = $mysqli->query($query)) {
          	/* Fetch the result row as a numeric array */
          	while( $item = $result->fetch_array(MYSQLI_NUM)){
            	/* Push the values from each row into variables */
            	/* Push the values from each row into variables */
            	$ScreenName = $item[1];
            	$ScreenStatus=$item[2];   
            	$ScreenAIN= $item[3];
            	$FritzDect400AIN=$item[4];
            	$ScreenResetTime = $item[5];
            	$ScreenShadowStart = $item[6];
            	$ScreenShadowEnd = $item[7]; 
            	$sunRiseEndTime = $item[8];
            	$sunSetStartTime = $item[9];
            	$deltaXmlAge = $item[10];
            	$weatherStationId =  $item[11];
            	$setGusts = $item[12];
            	$setSunIntensity = $item[13];
            	$sunRiseSetReduction = $item[14];
            	$switchDif = $item[15];
            	$location = $item[16];
          	}
	          /* Free the result set */
    	      $result->close();
        	}
        	$sunRiseSetReduction = 1 - $sunRiseSetReduction;
        	/* Close database connection */
        	$mysqli->close(); 
        	echo json_encode(array('ScreenName'=>$ScreenName, 'ScreenStatus'=>$ScreenStatus, 'ScreenAIN'=>$ScreenAIN, 
        			'FritzDect400AIN'=>$FritzDect400AIN, 'ScreenResetTime'=>$ScreenResetTime, 'ScreenShadowStart'=> $ScreenShadowStart, 
        			'ScreenShadowEnd'=>$ScreenShadowEnd, 'sunRiseEndTime'=>$sunRiseEndTime, 
        			'sunSetStartTime'=>$sunSetStartTime, 'deltaXmlAge'=>$deltaXmlAge,
        			'weatherStationId'=>$weatherStationId, 'setGusts'=>$setGusts, 
        			'setSunIntensity'=>$setSunIntensity, 'sunRiseSetReduction'=>round($sunRiseSetReduction , 2), 
        			'switchDif'=>$switchDif, 'GPSlocation'=>$location,));
      }
?>
