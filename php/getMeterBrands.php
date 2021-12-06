<?php
#Date: 13-Jun-2019
#version: 1.1 
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


#/tmp:/var/services/tmp:/var/services/web:/var/services/homes:/var/spool/cron

         if (PHP_SAPI === 'cli') {
              $query = $argv[1];
        }
        else {
              $query = $_POST["query"];                   
        }
        
        #echo json_encode(array(response1=>["Iskra","Kaifa","Kamstrup","Landis+Gyr","Sagemcom"]));
        #exit(0);
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
        $items = array(); //Array to hold our series1 values
        /* Connect to the database */
        $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
        if($mysqli->connect_error) {
          die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        }
        /* Run the query */
        if ($result = $mysqli->query($query)) {
         	 /* Fetch the result row as a numeric array */
          	while( $row = $result->fetch_array(MYSQLI_NUM)){
           		 /* Push the UNIQUE values from each row into the items array */
           		 if ( !in_array($row[0], $items) ) {
            		array_push($items, $row[0]);
            	 }
	        }
           	/* Free the result set */
          	$result->close();
        }
        /* Close database connection */
        $mysqli->close(); 
        
        /* format the response and return the response to the client */
        #$items = '[,' . join($items, ',') . ',]';
        
        #array array_unique ( array $array [, int $sort_flags = SORT_STRING ] )
        echo json_encode(array('response1'=>$items));     
      ?>

