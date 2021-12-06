<?php
#Date: 16-Jun-2019
#version: 1.4 
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
              $query = $argv[1];
        }
        else {
              $query = $_POST["query"];  
              //$query = "UPDATE Configuration SET Address='Jupiterweg 10', ElecEst='5600', GasEst='2810' WHERE id=1;"                 
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
        $dbname = "SmartMeter";
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
          	while( $row = $result->fetch_array(MYSQLI_NUM)){
            	/* Push the values from each row into variables */
            	$Address = $row[1];
            	$ContStartDate = $row[2];
            	$ElecEst = $row[3];
            	$GasEst = $row[4];
            	$TempAllow = $row[5]; 
            	$TempGraphColor = $row[6];
            	$DftOverview = $row[7];
            	$ElecGraphType = $row[8];
            	$ElecGraphColor = $row[9];
            	$DelivElecGraphColor = $row[10];            	
            	$GasGraphType = $row[11];
            	$GasGraphColor = $row[12];
            	$AverageGraphColor = $row[13];
            	$WeatherStationId = $row[14];
            	$GetData = $row[15];
            	$ChartTheme = $row[16];
            	$appStartDate = $row[17];
            	$MeterBrand = $row[18];
            	$MeterType = $row[19];
            	$Solar = $row[20];
            	$TarifType = $row[21];
            	$SingleTarif = $row[22];
            	$NormalTarif = $row[23];
            	$LowTarif = $row[24];
            	$ElecDeliveryCost = $row[25];
            	$ElecFacilityCost = $row[26];
            	$GasTarif = $row[27];
            	$GasDeliveryCost = $row[28];
				$TaxDeduct = $row[29];
				$LoadMngt = $row[31];
          	}
	          /* Free the result set */
    	      $result->close();
        	}
        	/* Close database connection */
        	$mysqli->close(); 
        	echo json_encode(array('Address'=>$Address, 'contractStartDate'=>$ContStartDate, 'ElecEst'=>$ElecEst, 
        			'GasEst'=>$GasEst, 'TempAllow'=>$TempAllow, 'TempGraphColor'=> $TempGraphColor, 
        			'DftOverview'=>$DftOverview, 'ElecGraphType'=>$ElecGraphType, 
        			'ElecGraphColor'=>$ElecGraphColor, 'DelivElecGraphColor'=>$DelivElecGraphColor,
        			'GasGraphType'=>$GasGraphType, 'GasGraphColor'=>$GasGraphColor, 
        			'AverageGraphColor'=>$AverageGraphColor, 'WeatherStationId'=>$WeatherStationId, 
        			'GetData'=>$GetData, 'ChartTheme'=>$ChartTheme, 'appStartDate'=>$appStartDate,
        			'MeterBrand'=>$MeterBrand, 'MeterType'=>$MeterType, 'Solar'=>$Solar,
        			'TarifType'=>$TarifType, 'SingleTarif'=>$SingleTarif, 'NormalTarif'=>$NormalTarif,
        			'LowTarif'=>$LowTarif, 'ElecDeliveryCost'=>$ElecDeliveryCost, 'ElecFacilityCost'=>$ElecFacilityCost,
					'GasTarif'=>$GasTarif, 'GasDeliveryCost'=>$GasDeliveryCost, 'TaxDeduct'=>$TaxDeduct,
					'LoadMngt'=>$LoadMngt,));
      }
?>
