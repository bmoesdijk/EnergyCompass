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
    openlog('mySQL_History.php', LOG_CONS | LOG_NDELAY | LOG_PID, LOG_USER | LOG_PERROR);
		syslog(LOG_INFO, "My logging text");
		closelog();
	<<<
--------------------------------------------------------------------------------------    
SELECT avg(temperature) FROM Weather WHERE DATE(datetime) BETWEEN '2019-02-01' AND '2019-02-31' GROUP by MONTH(datetime) ORDER BY datetime;"
*/
        if (PHP_SAPI === 'cli') {				//2018-05-08 Electricity
              $myDate = $argv[1];
              $myYear = explode("-", $myDate)[0];
              $myMonth = explode("-", $myDate)[1];
              $mySource = $argv[2];
        }
        else {
              $myDate = $_POST["myDate"];         //myDate=2018-05-08&mySource=Electricity
              $myYear = explode("-", $myDate)[0];
              $myMonth = explode("-", $myDate)[1];
              $mySource = $_POST["btnName"];
        }

        /* Our database information below */
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
      

        if (strpos($mySource, 'Gas') === false) {
           $query1 = "SELECT datetime, myUsage, mydelivery FROM Electricity where datetime like '%$myDate%';";
           $query2 = "SELECT SUM(myUsage), MAX(myUsage), SUM(mydelivery), MAX(mydelivery) FROM Electricity WHERE datetime LIKE '%$myDate%';";
          //For query3 we want to obtain the first and the last record of the given date $myDate
           $query3 = "SELECT countT1, countT2, deliverT1, deliverT2 FROM Electricity WHERE datetime=(SELECT MIN(datetime) from Electricity WHERE datetime LIKE '%$myDate%') OR datetime=(SELECT MAX(datetime) FROM Electricity WHERE datetime LIKE '%$myDate%');";
           $query4 = "SELECT SUM(myUsage), SUM(mydelivery) FROM Electricity WHERE DATE(datetime) BETWEEN ' $myYear-01-01' AND '$myYear-12-31' GROUP by YEAR(datetime) ORDER BY datetime;";
           $query5 = "SELECT SUM(myUsage), SUM(mydelivery) FROM Electricity WHERE DATE(datetime) BETWEEN ' $myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by Month(datetime) ORDER BY datetime;";
           $query6 = "SELECT MAX(temperature) FROM Weather WHERE DATE(datetime) BETWEEN '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by MONTH(datetime) ORDER BY datetime;";
           $query7 = "SELECT datetime, SUM(myUsage), SUM(mydelivery) FROM  Electricity WHERE DATE(datetime) BETWEEN  '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by DAY(datetime) ORDER BY datetime;";
           $query8 = "SELECT datetime, MAX(temperature) FROM  Weather WHERE DATE(datetime) BETWEEN  '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by DAY(datetime) ORDER BY datetime;";
           $query9 = "SELECT datetime, temperature FROM Weather WHERE DATE(datetime) like '%$myDate%' GROUP by HOUR(datetime) ORDER BY datetime;";
        } else {
        	#$query1 = "SELECT datetime, myUsage FROM Gas where datetime like '%$myDate%' GROUP BY HOUR(datetime);";
        	$query1 = "SELECT datetime, myUsage FROM Gas where datetime like '%$myDate%';";
        	$query2 = "SELECT SUM(myUsage), MAX(myUsage) FROM Gas WHERE datetime LIKE '%$myDate%';";
        	//For query3 we want to obtain the first and the last record of the given date $myDate
        	$query3 = "SELECT countVal FROM Gas WHERE datetime=(SELECT MIN(datetime) from Gas WHERE datetime LIKE '%$myDate%') OR datetime=(SELECT MAX(datetime) FROM Gas WHERE datetime LIKE '%$myDate%');";
        	$query4 = "SELECT SUM(myUsage) FROM Gas WHERE DATE(datetime) BETWEEN ' $myYear-01-01' AND '$myYear-12-31' GROUP by YEAR(datetime) ORDER BY datetime;";
        	$query5 = "SELECT SUM(myUsage) FROM Gas WHERE DATE(datetime) BETWEEN ' $myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by Month(datetime) ORDER BY datetime;";
        	$query6 = "SELECT AVG(temperature) FROM Weather WHERE DATE(datetime) BETWEEN '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by MONTH(datetime) ORDER BY datetime;";
        	$query7 = "SELECT datetime, SUM(myUsage) FROM  Gas WHERE DATE(datetime) BETWEEN  '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by DAY(datetime) ORDER BY datetime;"; 
        	$query8 = "SELECT datetime, MAX(temperature) FROM  Weather WHERE DATE(datetime) BETWEEN  '$myYear-$myMonth-01' AND '$myYear-$myMonth-31' GROUP by DAY(datetime) ORDER BY datetime;";
        	$query9 = "SELECT datetime, temperature FROM Weather WHERE DATE(datetime) like '%$myDate%' GROUP by HOUR(datetime) ORDER BY datetime;";
        }
        /* Declare the arrays that we need for the response items */
        $time = array(); // Array to hold our time values
        $usage = array(); // Array to hold our series values
        $deliveries = array(); // Array to hold our series deliveries
        $counterT1 = array(); //Array to hold the meter counter value 1
        $counterT2 = array(); //Array to hold the meter counter value 2
        $deliverT1 = array(); //Array to hold the meter counter value 1
        $deliverT2 = array(); //Array to hold the meter counter value 2
        $dates = array(); // Array to hold our dates values
        $histMonthUsage = array(); // Array to hold our history month daily usage
        $histMonthDelivery = array(); // Array to hold our history month daily delivery
        $histMonthMaxTemp = array(); //Array to hold the history month daily maxTemperatures
        $histDayHourlyTemp=array(); //Array to hold te history day hourly temperature
        
        /* Connect to the database and retreive all the data from the different queries*/
        $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
        	if($mysqli->connect_error) {
          		die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
        	}
        	/* Run the first query to get the history usage */
        	if ($result = $mysqli->query($query1)) {
          		/* Fetch the result row as a numeric array */
         		 while( $row = $result->fetch_array(MYSQLI_NUM)){
            		/* Push the values from each row into the $date and $series arrays */
            		array_push($time, $row[0]);
            		array_push($usage, $row[1]);
            		array_push($deliveries, $row[2]);
          		}
           		/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           		foreach ($time as &$value){ 
                   	$value = strtotime( $value ) * 1000;
                }                 
          		/* Free the result set */
          		$result->close();
        	}
        	
        	/* Run the second query to get the data for the overview table */
        	$result = $mysqli->query($query2);
          	/* Fetch the result row as a numeric array */
        	$row = $result->fetch_array(MYSQLI_NUM);     
       		$totalUsage = $row[0];
        	$peakUsage = $row[1];
        	$totalDelivery = $row[2];
        	$peakDelivery = $row[3];
        	/* Free the result set */
          	$result->close();
         	
         	/* Run the third query to get the meter data for the overview table */
        	$result = $mysqli->query($query3);
          	/* Fetch the result row as a numeric array */
        	while( $row = $result->fetch_array(MYSQLI_NUM)){
            	/* Push the values from each row into the $counters */ 
        		array_push($counterT1, $row[0]);
        		array_push($counterT2, $row[1]);
        		array_push($deliverT1, $row[2]);
        		array_push($deliverT2, $row[3]);
        	}
        	/* Free the result set */
          	$result->close();
        
        	/* Run the third query to get the history yearly usage */
        	$result = $mysqli->query($query4);
          	/* Fetch the result row as a numeric array */
        	$row = $result->fetch_array(MYSQLI_NUM);     
        	$yearUsage = $row[0];
        	$yearDelivery = $row[1];
        	$yearUsage = (float)number_format($yearUsage, 0, '.', '');
        	$yearDelivery = (float)number_format($yearDelivery, 0, '.', '');
        	/* Free the result set */
         	$result->close();

        	/* Run the third query to get the history monthly total usage */
        	$result = $mysqli->query($query5);
          	/* Fetch the result row as a numeric array */
        	$row = $result->fetch_array(MYSQLI_NUM);     
        	$monthUsage = $row[0];
        	$monthDelivery = $row[1];
        	$monthUsage = (float)number_format($monthUsage, 0, '.', '');
        	$monthDelivery = (float)number_format($monthDelivery, 0, '.', '');
        	/* Free the result set */
          	$result->close();
          	
          	/* Run the sixst query to get the average temperature for in the total monthly usage*/
          	$result = $mysqli->query($query6);
          	/* Fetch the result row as a numeric array */
        	$row = $result->fetch_array(MYSQLI_NUM);     
        	$avgTemp = $row[0];
        	$avgTemp = (float)number_format($avgTemp, 2, '.', '');
        	/* Free the result set */
          	$result->close();
          	
          	/* Run the seventh query to get the history per day monthly usage*/
        	if ($result = $mysqli->query($query7)) {
          		/* Fetch the result row as a numeric array */
         		 while( $row = $result->fetch_array(MYSQLI_NUM)){
            		/* Push the values from each row into the $date and $series arrays */
            		array_push($dates, $row[0]);
            		array_push($histMonthUsage, $row[1]);
            		if (strpos($mySource, 'Gas') === false) {
            		    array_push($histMonthDelivery, $row[2]);
            		}
          		}
           		/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           		foreach ($dates as &$value){ 
                   	$value = strtotime( $value ) * 1000;
                }                 
          		/* Free the result set */
          		$result->close();
        	}

            /* Run the eigth query to get the history per day monthly temperature*/
        	if ($result = $mysqli->query($query8)) {
          		/* Fetch the result row as a numeric array */
         		 while( $row = $result->fetch_array(MYSQLI_NUM)){
            		/* Push the values from each row into the $date and $series arrays */
            		//array_push($dates, $row[0]);
            		array_push($histMonthMaxTemp, $row[1]);
          		}
           		/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           		//foreach ($dates as &$value){ 
                //   	$value = strtotime( $value ) * 1000;
                //}                 
          		/* Free the result set */
          		$result->close();
        	}
          	
          	 /* Run the eigth query to get the history per day monthly temperature*/
        	if ($result = $mysqli->query($query9)) {
          		/* Fetch the result row as a numeric array */
         		 while( $row = $result->fetch_array(MYSQLI_NUM)){
            		/* Push the values from each row into the $date and $series arrays */
            		array_push($histDayHourlyTemp, $row[1]);
          		}
           		/* Convert each date value to a Unix timestamp, multiply by 1000 for milliseconds */
           		//foreach ($dates as &$value){ 
                //   	$value = strtotime( $value ) * 1000;
                //}                 
          		/* Free the result set */
          		$result->close();
        	}
        /* Close database connection */
        $mysqli->close();
        
        /* Provide bracked enclose coma surounded responses for those elements that will be
        used to create a Zingchart chart. (e.g [,1234.56,]) */
        $times  = '[,' . join($time, ',') . ',]';
        $useValues = '[,' . join($usage, ',') . ',]'; 
        $delValues = '[,' . join($deliveries, ',') . ',]';
        $counter1 = '[,' . join($counterT1, ',') . ',]';
        $counter2 = '[,' . join($counterT2, ',') . ',]';
        $deliver1 = '[,' . join($deliverT1, ',') . ',]';
        $deliver2 = '[,' . join($deliverT2, ',') . ',]';
        $yearUsage = '[,' . $yearUsage . ',]';
        $yearDelivery = '[,' . $yearDelivery . ',]';
        $monthUsage = '[,' . $monthUsage . ',]';
        $monthDelivery = '[,' . $monthDelivery . ',]';
        $avgTemperature = '[,' . $avgTemp . ',]';
        $dates = '[,' . join($dates, ',') . ',]';
        $histMonthUsage = '[,' . join($histMonthUsage, ',') . ',]';
        $histMonthDelivery = '[,' . join($histMonthDelivery, ',') . ',]';
        $histMonthMaxTemp = '[,' . join($histMonthMaxTemp, ',') . ',]';
        $histDayHourlyTemp = '[,' . join($histDayHourlyTemp, ',') . ',]';
        
        //$js_series = json_encode($series); /* Provides brackeded quotated response like ["1234.56"] */
    	//Send the response values back to the webserver
       	echo json_encode(array
        		('response1'=>$times, 
        		'response2'=>$useValues, 
        		'response3'=>$totalUsage, 
        		'response4'=>$peakUsage, 
        		'response5'=>$counter1, 
        		'response6'=>$counter2, 
        		'response7'=>$delValues, 
        		'response8'=>$totalDelivery, 
        		'response9'=>$peakDelivery, 
        		'response10'=>$deliver1, 
        		'response11'=>$deliver2, 
        		'response12'=>$yearUsage, 
        		'response13'=>$monthUsage, 
        		'response14'=>$yearDelivery, 
        		'response15'=>$monthDelivery,
        		'response16'=>$avgTemperature,
        		'response17'=>$dates,
        		'response18'=>$histMonthUsage,
        		'response19'=>$histMonthDelivery,
        		'response20'=>$histMonthMaxTemp,
        		'response21'=>$histDayHourlyTemp)
        		);
      ?>

