-- MySQL dump 10.13  Distrib 8.0.18, for macos10.14 (x86_64)
--
-- Host: localhost    Database: dbbin
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `t_ac`
--

DROP TABLE IF EXISTS `t_ac`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_ac` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  `sn` varchar(40) DEFAULT NULL,
  `channel` tinyint(4) DEFAULT NULL,
  `online` tinyint(4) DEFAULT '0',
  `online_count` tinyint(4) DEFAULT '0',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sn` (`sn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_ac`
--

LOCK TABLES `t_ac` WRITE;
/*!40000 ALTER TABLE `t_ac` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_ac` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_categories`
--

DROP TABLE IF EXISTS `t_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `p_level` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_categories`
--

LOCK TABLES `t_categories` WRITE;
/*!40000 ALTER TABLE `t_categories` DISABLE KEYS */;
INSERT INTO `t_categories` VALUES (1,'手机',1,1),(2,'电脑',1,1),(3,'平板电脑',1,1),(4,'电视',1,1),(5,'家具',1,1),(8,'厨具',1,1),(9,'母婴',1,1),(10,'文娱',1,2),(11,'文娱',1,2);
/*!40000 ALTER TABLE `t_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_relay`
--

DROP TABLE IF EXISTS `t_relay`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_relay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  `sn` varchar(40) DEFAULT NULL,
  `channel_1` tinyint(4) DEFAULT '0',
  `channel_2` tinyint(4) DEFAULT '0' COMMENT '通道2状态 1代表开 0代表关',
  `online` tinyint(4) DEFAULT '0',
  `online_count` tinyint(4) DEFAULT '0',
  `ip_address` varchar(30) DEFAULT NULL,
  `open_at` varchar(20) DEFAULT NULL,
  `close_at` varchar(20) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sn` (`sn`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_relay`
--

LOCK TABLES `t_relay` WRITE;
/*!40000 ALTER TABLE `t_relay` DISABLE KEYS */;
INSERT INTO `t_relay` VALUES (1,'DAM0200','JY032015066apMzq',0,0,1,0,'172.16.1.87','22:49:00','22:51:10','2020-11-13 07:22:13'),(2,'DAM0200','JY032015065t1G9F',0,0,1,1,'172.16.1.160','22:49:00','22:51:10','2020-11-13 07:22:54');
/*!40000 ALTER TABLE `t_relay` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_shop`
--

DROP TABLE IF EXISTS `t_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_shop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `no` int(11) NOT NULL,
  `relay` int(11) DEFAULT NULL,
  `ac` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `no` (`no`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_shop`
--

LOCK TABLES `t_shop` WRITE;
/*!40000 ALTER TABLE `t_shop` DISABLE KEYS */;
INSERT INTO `t_shop` VALUES (1,1,1,NULL),(2,2,2,NULL);
/*!40000 ALTER TABLE `t_shop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_users`
--

DROP TABLE IF EXISTS `t_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_users`
--

LOCK TABLES `t_users` WRITE;
/*!40000 ALTER TABLE `t_users` DISABLE KEYS */;
INSERT INTO `t_users` VALUES (1,'admin','$2b$10$QkFjZZK5hopzbXSfFQaGC.MMCsw01KhfPOwlStLkiHr9B8nfc//f.','13545126358','23801504@qq.com','http://abc.com/123.png','2020-10-22 13:47:49');
/*!40000 ALTER TABLE `t_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-16 22:53:15
