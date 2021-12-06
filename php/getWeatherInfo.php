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
    openlog('getWeatherInfos.php', LOG_CONS | LOG_NDELAY | LOG_PID, LOG_USER | LOG_PERROR);
		syslog(LOG_INFO, "My logging text");
		closelog();
	<<<
-------------------------------------------------------------------------------------- 
*/

      
      
      
        if (PHP_SAPI === 'cli') {
              $query = $argv[1];
        }
        else {
              $query = $_POST["query"];                   
        }
        
        /* Database connection parameters */
        /* The host name in which the database is available */
        $host = "127.0.0.1:3307"; 
        /* The database port number */
        $port = 3307;
        /* The username to connect to the database */
        $usernm = "root";
        /* The password associated with the username */
        $passwd = "";
        /* The database to which to connect */
        $dbname = "SmartMeter";
        /* ---------------- */
        $time = array(); //Array to hold our time values
        $series1 = array(); //Array to hold our series1 values
        $series2 = array(); //Array to hold our series1 values
        $series3 = array(); //Array to hold our series1 values
        $series4 = array(); //Array to hold our series1 values
        $series5 = array(); //Array to hold our series1 values
        $series6 = array(); //Array to hold our series1 values
        $series7 = array(); //Array to hold our series1 values
        /* Connect to the database */
        $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
        if($mysqli->connect_error) {
          die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        }
        /* Run the query */
        if ($result = $mysqli->query($query)) {
         	 /* Fetch the result row as a numeric array */
          	while( $row = $result->fetch_array(MYSQLI_NUM)){
           		 /* Push the values from each row into the $date and $series arrays */
            	array_push($time, $row[0]);
            	array_push($series1, $row[1]);
            	array_push($series2, $row[2]);
            	array_push($series3, $row[3]);
            	array_push($series4, $row[4]);
            	array_push($series5, $row[5]);
            	array_push($series6, $row[6]);    
            	array_push($series6, $row[7]); 	
	        }
           	/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           	foreach ($time as &$value){ 
                   $value = strtotime( $value ) * 1000;
                   } 
           	/* Free the result set */
          	$result->close();
        }
        /* Close database connection */
        $mysqli->close(); 
        
        /* format the response and return the response to the client */
        $dates  = '[,' . join($time, ',') . ',]';
        $series1 = '[,' . join($series1, ',') . ',]';
        $series2 = '[,' . join($series2, ',') . ',]';
        $series3 = '[,' . join($series3, ',') . ',]';
    	$series4 = '[,' . join($series4, ',') . ',]';
        $series5 = '[,' . join($series5, ',') . ',]';
        $series6 = '[,' . join($series6, ',') . ',]';
        $series7 = '[,' . join($series7, ',') . ',]';
        echo json_encode(array('response1'=>$dates, 'response2'=>$series1, 'response3'=>$series2, 
        	'response4'=>$series3, 'response4'=>$series4, 'response5'=>$series5, 
        	'response6'=>$series6, 'response7'=>$series7));     
?>

