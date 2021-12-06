-- MySQL dump 10.19  Distrib 10.3.29-MariaDB, for Linux ()
--
-- Host: localhost    Database: SmartMeter
-- ------------------------------------------------------
-- Server version   10.3.29-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Configuration`
--

DROP TABLE IF EXISTS `Configuration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Configuration` (
  `id` int(6) DEFAULT 1,
  `Address` varchar(16) DEFAULT 'straatweg 1',
  `contractStartDate` varchar(16) DEFAULT '01-01',
  `ElecEst` decimal(10,0) DEFAULT 1000,
  `GasEst` decimal(10,0) DEFAULT 1000,
  `TempAllow` tinyint(1) NOT NULL DEFAULT 0,
  `TempGraphColor` varchar(16) DEFAULT '',
  `DftOverview` varchar(16) DEFAULT 'Gas',
  `ElecGraphType` varchar(16) DEFAULT 'line',
  `ElecGraphColor` varchar(16) DEFAULT '',
  `DelivElecGraphColor` varchar(16) DEFAULT '',
  `GasGraphType` varchar(16) DEFAULT 'bar',
  `GasGraphColor` varchar(16) DEFAULT '',
  `AverageGraphColor` varchar(16) DEFAULT '',
  `weatherStationId` decimal(10,0) DEFAULT 6260,
  `getData` varchar(36) DEFAULT '00,15,30,45',
  `ChartTheme` varchar(16) DEFAULT 'light',
  `startDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `MeterBrand` varchar(24) DEFAULT NULL,
  `MeterType` varchar(24) DEFAULT NULL,
  `Solar` tinyint(1) NOT NULL DEFAULT 0,
  `TarifType` tinyint(1) NOT NULL DEFAULT 0,
  `SingleTarif` decimal(10,4) DEFAULT 0.0000,
  `NormalTarif` decimal(10,4) DEFAULT 0.0000,
  `LowTarif` decimal(10,4) DEFAULT 0.0000,
  `ElecDeliveryCost` decimal(10,4) DEFAULT 0.0000,
  `ElecFacilityCost` decimal(10,4) DEFAULT NULL,
  `GasTarif` decimal(10,4) DEFAULT 0.0000,
  `GasDeliveryCost` decimal(10,4) DEFAULT NULL,
  `TaxDeduct` decimal(10,4) DEFAULT 0.0000,
  `GasFacilityCost` decimal(10,4) DEFAULT NULL,
  `LoadMngt` float DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Configuration`
--

LOCK TABLES `Configuration` WRITE;
/*!40000 ALTER TABLE `Configuration` DISABLE KEYS */;
INSERT INTO `Configuration` (`id`, `Address`, `contractStartDate`, `ElecEst`, `GasEst`, `TempAllow`, `TempGraphColor`, `DftOverview`, `ElecGraphType`, `ElecGraphColor`, `DelivElecGraphColor`, `GasGraphType`, `GasGraphColor`, `AverageGraphColor`, `weatherStationId`, `getData`, `ChartTheme`, `startDate`, `MeterBrand`, `MeterType`, `Solar`, `TarifType`, `SingleTarif`, `NormalTarif`, `LowTarif`, `ElecDeliveryCost`, `ElecFacilityCost`, `GasTarif`, `GasDeliveryCost`, `TaxDeduct`, `GasFacilityCost`, `LoadMngt`) VALUES (1,'Jupiterweg 11','01-08-2021',11000,1000,1,'red','Electricity','area','green','DoNotShow','bar','#66CCFF','orange',6269,'00,15,30,45','dark','2017-04-14 22:00:00','Landis+Gyr','E350 (ZCF100)',0,3,0.2504,0.2604,0.2404,0.1903,0.7512,0.8747,0.6110,1.5303,0.0000,0);
/*!40000 ALTER TABLE `Configuration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Electricity`
--

DROP TABLE IF EXISTS `Electricity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Electricity` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `countT1` decimal(10,3) DEFAULT NULL,
  `countT2` decimal(10,3) DEFAULT NULL,
  `myUsage` decimal(10,3) DEFAULT 0.000,
  `deliverT1` decimal(10,3) DEFAULT NULL,
  `deliverT2` decimal(10,3) DEFAULT NULL,
  `mydelivery` decimal(10,3) DEFAULT 0.000,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=189008 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Electricity`
--

LOCK TABLES `Electricity` WRITE;
/*!40000 ALTER TABLE `Electricity` DISABLE KEYS */;
/*!40000 ALTER TABLE `Electricity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Gas`
--

DROP TABLE IF EXISTS `Gas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Gas` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `countVal` decimal(10,3) DEFAULT NULL,
  `myUsage` decimal(10,3) DEFAULT 0.000,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=47416 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Gas`
--

LOCK TABLES `Gas` WRITE;
/*!40000 ALTER TABLE `Gas` DISABLE KEYS */;
/*!40000 ALTER TABLE `Gas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `MeterBrand`
--

DROP TABLE IF EXISTS `MeterBrand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `MeterBrand` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `Brand` varchar(16) DEFAULT '',
  `Model` varchar(16) DEFAULT '',
  `DSMRv` float DEFAULT 2,
  `baudrate` decimal(10,0) DEFAULT 0,
  `bytesize` decimal(10,0) DEFAULT 0,
  `parity` varchar(1) DEFAULT '',
  `stopbits` tinyint(1) DEFAULT 1,
  `xonxoff` tinyint(1) NOT NULL DEFAULT 0,
  `rtscts` tinyint(1) NOT NULL DEFAULT 0,
  `timeout` decimal(10,0) DEFAULT 20,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `MeterBrand`
--

LOCK TABLES `MeterBrand` WRITE;
/*!40000 ALTER TABLE `MeterBrand` DISABLE KEYS */;
INSERT INTO `MeterBrand` (`id`, `Brand`, `Model`, `DSMRv`, `baudrate`, `bytesize`, `parity`, `stopbits`, `xonxoff`, `rtscts`, `timeout`) VALUES (1,'Iskra','ME382',2.2,9600,7,'E',1,0,0,20),(2,'Kaifa','E0003',4,115200,8,'N',1,0,0,20),(3,'Kaifa','E0025',4,115200,8,'N',1,0,0,20),(4,'Kaifa','MA105',4,115200,8,'N',1,0,0,20),(5,'Kaifa','MA105C',4.2,115200,8,'N',1,0,0,20),(6,'Kaifa','MA304',4,115200,8,'N',1,0,0,20),(7,'Kaifa','MA304C',4.2,115200,8,'N',1,0,0,20),(8,'Kamstrup','165',2.2,9600,7,'E',1,0,0,20),(9,'Kamstrup','351',2.2,9600,7,'E',1,0,0,20),(10,'Kamstrup','382',2.2,9600,7,'E',1,0,0,20),(11,'Landis+Gyr','E350 (ZCF100)',4,115200,8,'N',1,0,0,20),(12,'Landis+Gyr','E350 (ZCF101)',4.2,115200,7,'N',1,0,0,20),(13,'Landis+Gyr','E350 (ZCF110)',4.2,115200,8,'N',1,0,0,20),(14,'Landis+Gyr','E350 (ZFF100)',4,115200,8,'N',1,0,0,20),(15,'Landis+Gyr','E350 (ZMF100)',4,115200,8,'N',1,0,0,20),(16,'Sagemcom','T210-D',5,115200,8,'N',1,0,0,20),(17,'Landis+Gyr','E360',5,115200,8,'N',1,0,0,20);
/*!40000 ALTER TABLE `MeterBrand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Weather`
--

DROP TABLE IF EXISTS `Weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Weather` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `datetime` timestamp NOT NULL DEFAULT current_timestamp(),
  `temperature` decimal(3,1) DEFAULT NULL,
  `airPressure` decimal(10,0) DEFAULT NULL,
  `humidity` decimal(10,0) DEFAULT NULL,
  `windSpeed` decimal(10,0) DEFAULT NULL,
  `windDirection` varchar(4) DEFAULT NULL,
  `precipitation` decimal(10,0) DEFAULT NULL,
  `station` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=140288 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Weather`
--

LOCK TABLES `Weather` WRITE;
/*!40000 ALTER TABLE `Weather` DISABLE KEYS */;
/*!40000 ALTER TABLE `Weather` ENABLE KEYS */;
UNLOCK TABLES;