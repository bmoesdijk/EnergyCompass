<?php
#Date: 10-Nov-2017
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
        //First check what type of query is received
              switch (true) {
              	case stristr($argv[1],'d_Query'):
              		$queryType = "dayQuery";
              		$query = substr($argv[1], 8);
              		break;
              	case stristr($argv[1],'w_Query'):
              		$queryType = "weekQuery";
              		$query = substr($argv[1], 8);
              		break;
              	case stristr($argv[1],'m_Query'):
              		$queryType = "monthQuery";
              		$query = substr($argv[1], 8);
              		break;
              	case stristr($argv[1],'y_Query'):
              		$queryType = "yearQuery";
              		$query = substr($argv[1], 8);
              		break;
              	}
        } else {
        //First check what type of query is received
              If ($_POST["d_Query"]) {
              	$queryType = "dayQuery";
              	$query = $_POST["d_Query"];
              	}
              elseif ($_POST["w_Query"]) {
              	$queryType = "weekQuery";
              	$query = $_POST["w_Query"];
              	}
              elseif ($_POST["m_Query"]) {
              	$queryType = "monthQuery";
              	$query = $_POST["m_Query"];
              	}
              elseif ($_POST["y_Query"]) {
              	$queryType = "yearQuery";
              	$query = $_POST["y_Query"];
              	}
              //$query = $_POST["query"];                   
        }
        /* Create the Weather Query from the received data query by changing some attributes */
        /* Received query from the client web interface: 
        	SELECT datetime, SUM(myUsage) FROM Gas WHERE DATE(datetime) BETWEEN 
        	'2017-05-09' AND '2017-05-16' GROUP by DAY(datetime) ORDER BY datetime;
        Will be replaced to:
            select datetime, max(temperature) as max_value FROM Weather
        	SELECT datetime, AVG(temperature) FROM Weather WHERE DATE(datetime) BETWEEN 
        	'2017-05-09' AND '2017-05-16' GROUP by DAY(datetime) ORDER BY datetime; */
        if ($queryType == "dayQuery") {
        	//$wQuery = str_replace('Gas', 'Weather', $query);
        	//$weatherQuery = str_replace('myUsage', 'temperature', $wQuery);
            $weatherQuery = "SELECT datetime, temperature FROM Weather WHERE 
                                          datetime >= now() - INTERVAL 21 HOUR GROUP BY HOUR(datetime) ORDER BY datetime;";
        	}
        elseif ($queryType == "weekQuery" or $queryType == "monthQuery") {
            $wQuery = str_replace('Gas', 'Weather', $query);
        	$wQuery = str_replace('myUsage', 'temperature', $wQuery);
        	$weatherQuery = str_replace('SUM', 'MAX', $wQuery);
            } 	
        elseif ($queryType == "yearQuery") {
        	$wQuery = str_replace('Gas', 'Weather', $query);
        	$wQuery = str_replace('myUsage', 'temperature', $wQuery);
        	$weatherQuery = str_replace('SUM', 'AVG', $wQuery);
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
        $time = array(); // Array to hold our time values
        $series = array(); // Array to hold our series values
        $deliveries = array(); // Array to hold our elec-delivery values
        $averageArray=array(); //Array to hold the average values
        $wtime=array(); //Array to hold the weather date values
        $temp=array(); //Array to hold the temperature values
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
            	array_push($series, $row[1]);
            	array_push($deliveries, $row[2]);
	        }
           
           	/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           	foreach ($time as &$value){ 
                   $value = strtotime( $value ) * 1000;
                   }
           	If (strpos($query, 'Gas') !== false) {
           				/* Run the weather query */
                 		if ($result = $mysqli->query($weatherQuery)) {
         					 /* Fetch the result row as a numeric array */
          					while( $row = $result->fetch_array(MYSQLI_NUM)){
            					/* Push the values from each row into the $date and $series arrays */
            					array_push($wtime, $row[0]);
            					array_push($temp, round($row[1],1));
          					}
          					foreach ($wtime as &$value){ 
                   				$value = strtotime( $value ) * 1000;
                   			}
                   		}
            }
            /* Calculate the average use */
           	$seriesTotal = 0;
           	$i=0;
           	while ($i <= count($series)) { 
               	$seriesTotal = $seriesTotal + $series[$i];
               	$i++;
               	array_push($averageArray,round(($seriesTotal/$i),2,PHP_ROUND_HALF_UP));
           	} 
           	/* Free the result set */
          	$result->close();
        }
        $dates  = '[,' . join($time, ',') . ',]';
        $wdates  = '[,' . join($wtime, ',') . ',]';
        $values = '[,' . join($series, ',') . ',]';
        $delivery = '[,' . join($deliveries, ',') . ',]';
        $temperature = '[,' . join($temp, ',') . ',]';
        $average = '[,' . join($averageArray, ',') . ',]';
        echo json_encode(array('response1'=>$dates, 'response2'=>$values, 'response3'=>$average, 
        	'response4'=>$wdates, 'response5'=>$temperature, 'response6'=>$delivery));    
?>

