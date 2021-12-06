<?php
#Date: 27-Jul-2021
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
  // This script is scheduled to run (via crontab) every 10 minutes
  /* some variables */
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
    /* Get the selected weather station ID to use in the buienradar weather info request */
    $query = "select WeatherStationId from Configuration;";
    /* Connect to the database */
    $mysqli = new mysqli($host, $usernm, $passwd, $dbname);
    if($mysqli->connect_error) {
        die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
    }
    /* Run the query and get the result from the database */
    $result = $mysqli->query($query);
    /* Fetch the weatherStationId as a numeric array */
    $weatherStationId = $result->fetch_array(MYSQLI_NUM);
    /* Free the result set */
    $result->close();
    /* Close database connection */
    $mysqli->close(); 

  /* Get the weather report from the weather station via Buienradar */
   $url = 'data.buienradar.nl/1.0/feed/xml';
   $xml = new SimpleXMLElement('http://data.buienradar.nl/1.0/feed/xml', null, true);
   	foreach ($xml->weergegevens->actueel_weer->weerstations->children() as $station) { 
     	if ($station->stationcode == $weatherStationId[0]) {
       		break; // stop the foreach loop if station is found 
      	}
  	} 
   // $weerdata = $xml->weergegevens->actueel_weer->weerstations->weerstation[9]->children(); 
   // $weerdata contains  luchtvochtigheid, temperatuurGC, windsnelheidBF, windsnelheidMS, 
   //                     windrichting, windrichtingGR, luchtdruk, zichtmeters, windstotenMS, 
   //                     regenMMPU, temperatuur10cm
   $weerdata = $station->children();
   $sn = $weerdata->stationnaam; 
   $rh = intval($weerdata->luchtvochtigheid); 
   $tm = floatval($weerdata->temperatuurGC); 
   $ws = intval($weerdata->windsnelheidBF); 
   $wd = $weerdata->windrichting; 
   $ap = intval($weerdata->luchtdruk);
   $pt = intval($weerdata->regenMMPU); 
 	$query="INSERT INTO Weather (temperature, airPressure, humidity, windSpeed, windDirection, precipitation, station) Values('$tm', '$ap', '$rh', '$ws', '$wd', '$pt', '$sn')";
 	echo $query;
 	/* Connect to the database */
	
	$mysqli = new mysqli($host, $usernm, $passwd, $dbname);
    if($mysqli->connect_error) {
    die('Connect Error (' . $mysqli->connect_errno . ')' . $mysqli->connect_error);
    }
    /* Run the query */
    $result = $mysqli->query($query);
    $mysqli->close();
    if ($result === true) {
        echo $result;
    }
    else { 
    	echo $result;
    }
?>
