<?php
#Date: 15-Apr-2018
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
        if (PHP_SAPI === 'cli') {
              $myDate = $argv[1];
              /* Rewrite the date to the format used in the database */
              $newDate = explode("-", $myDate);
              $startDate = $newDate[2] . "-" . $newDate[1] . "-" . $newDate[0] ."%";
        }
        else {
              $myDate = $_POST["myDate"];         //$myDate = date("%Y-%m-%d");
              /* Rewrite the date to the fowmat used in the database */
              $newDate = explode("-", $myDate);
              $startDate = $newDate[2] . "-" . $newDate[1] . "-" . $newDate[0] ."%";
        }      
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
        $queryGas = "select datetime, SUM(myUsage) FROM Gas WHERE datetime BETWEEN '$startDate' AND now();"; 
        $queryElec = "select datetime, SUM(myUsage) FROM Electricity WHERE datetime BETWEEN '$startDate' AND now();";   
        /* ---------------- */
        $time = array();
        $valueGas = array(); // Array to hold our Gas total value
        $valueElec = array(); // Array to hold our Electricity total value
        /* Connect to the database */
        $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
        if($mysqli->connect_error) {
          die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        }
        /* Run the query */
        if ($result = $mysqli->query($queryGas)) {
          /* Fetch the result row as a numeric array */
          while( $row = $result->fetch_array(MYSQLI_NUM)){
            /* Push the values from each row into the $date and $series arrays */
            array_push($time, $row[0]);
            array_push($valueGas, $row[1]);
          }
        }                                   
          /* Free the result set */
         $result->close();
          /* Run the query */
        if ($result = $mysqli->query($queryElec)) {
          /* Fetch the result row as a numeric array */
          while( $row = $result->fetch_array(MYSQLI_NUM)){
            /* Push the values from each row into the $date and $series arrays */
            array_push($time, $row[0]);
            array_push($valueElec, $row[1]);
          }
        }    
        /* Free the result set */
         $result->close();         
          //$valueElec->close();
        /* Close database connection */
        $mysqli->close(); 
        echo json_encode(array('response1'=>$valueElec, 'response2'=>$valueGas));
?>


