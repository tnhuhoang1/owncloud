-- MySQL dump 10.13  Distrib 8.0.23, for Linux (x86_64)
--
-- Host: localhost    Database: ownclouddb
-- ------------------------------------------------------
-- Server version	8.0.23-0ubuntu0.20.04.1

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
-- Table structure for table `oc_account_terms`
--

DROP TABLE IF EXISTS `oc_account_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_account_terms` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `account_id` bigint unsigned NOT NULL,
  `term` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `account_id_index` (`account_id`),
  KEY `term_index` (`term`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_account_terms`
--

LOCK TABLES `oc_account_terms` WRITE;
/*!40000 ALTER TABLE `oc_account_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_account_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_accounts`
--

DROP TABLE IF EXISTS `oc_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_accounts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `lower_user_id` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `quota` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `last_login` int NOT NULL DEFAULT '0',
  `backend` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `home` varchar(1024) COLLATE utf8mb4_bin NOT NULL,
  `state` smallint NOT NULL DEFAULT '0' COMMENT '0: initial, 1: enabled, 2: disabled, 3: deleted',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_907AA303A76ED395` (`user_id`),
  UNIQUE KEY `lower_user_id_index` (`lower_user_id`),
  KEY `display_name_index` (`display_name`),
  KEY `email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_accounts`
--

LOCK TABLES `oc_accounts` WRITE;
/*!40000 ALTER TABLE `oc_accounts` DISABLE KEYS */;
INSERT INTO `oc_accounts` VALUES (1,NULL,'admin','admin','admin',NULL,1619231426,'OC\\User\\Database','/var/www/html/owncloud/data/admin',1),(2,'nhuhoang2@gmail.com','hoang','hoang','hoang',NULL,1617966861,'OC\\User\\Database','/var/www/html/owncloud/data/hoang',1),(3,'hung@gmail.com','hung','hung','hung',NULL,0,'OC\\User\\Database','/var/www/html/owncloud/data/hung',1),(5,'member@gmail.com','member','member','member',NULL,0,'OC\\User\\Database','/var/www/html/owncloud/data/member',1),(6,'nhuhoang.afk2@gmail.com','testGuest','testguest','testGuest',NULL,0,'OC\\User\\Database','/var/www/html/owncloud/data/testGuest',1),(8,'test@test.com','test','test','test',NULL,0,'OC\\User\\Database','/var/www/html/owncloud/data/test',1);
/*!40000 ALTER TABLE `oc_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_addressbookchanges`
--

DROP TABLE IF EXISTS `oc_addressbookchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_addressbookchanges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `synctoken` int unsigned NOT NULL DEFAULT '1',
  `addressbookid` int NOT NULL,
  `operation` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addressbookid_synctoken` (`addressbookid`,`synctoken`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_addressbookchanges`
--

LOCK TABLES `oc_addressbookchanges` WRITE;
/*!40000 ALTER TABLE `oc_addressbookchanges` DISABLE KEYS */;
INSERT INTO `oc_addressbookchanges` VALUES (1,'Database:admin.vcf',1,2,1),(2,'Database:hoang.vcf',2,2,1),(3,'Database:hoang.vcf',3,2,2),(4,'Database:hoang.vcf',4,2,2),(5,'Database:hoang.vcf',5,2,2),(6,'Database:hoang.vcf',6,2,2),(7,'Database:hoang.vcf',7,2,2),(8,'Database:hoang.vcf',8,2,2),(9,'Database:hoang.vcf',9,2,2),(10,'Database:hoang.vcf',10,2,2),(11,'Database:hoang.vcf',10,2,2),(12,'Database:hoang.vcf',12,2,2),(13,'Database:hoang.vcf',13,2,2),(14,'Database:hung.vcf',14,2,1),(15,'Database:hung.vcf',15,2,2),(16,'Database:newUser.vcf',16,2,1),(17,'Database:newUser.vcf',17,2,2),(18,'Database:member.vcf',18,2,1),(19,'Database:member.vcf',19,2,2),(20,'Database:newUser.vcf',20,2,3),(21,'Database:testGuest.vcf',21,2,1),(22,'Database:testGuest.vcf',22,2,2),(23,'0e41a179-00fa-4f87-b5fc-58ef3ed4ade8.vcf',1,1,1),(24,'0e41a179-00fa-4f87-b5fc-58ef3ed4ade8.vcf',2,1,2),(25,'478a6fc8-1a19-4e24-95d7-4cf0034372c7.vcf',3,1,1),(26,'Database:yeuthuykieu.vcf',23,2,1),(27,'Database:yeuthuykieu.vcf',24,2,2),(28,'Database:yeuthuykieu.vcf',25,2,3),(29,'Database:test.vcf',26,2,1),(30,'Database:test.vcf',27,2,2);
/*!40000 ALTER TABLE `oc_addressbookchanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_addressbooks`
--

DROP TABLE IF EXISTS `oc_addressbooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_addressbooks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `principaluri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `displayname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `synctoken` int unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `addressbook_index` (`principaluri`,`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_addressbooks`
--

LOCK TABLES `oc_addressbooks` WRITE;
/*!40000 ALTER TABLE `oc_addressbooks` DISABLE KEYS */;
INSERT INTO `oc_addressbooks` VALUES (1,'principals/users/admin','Danh bạ','contacts',NULL,4),(2,'principals/system/system','system','system','System addressbook which holds all users of this instance',28),(3,'principals/users/hoang','Danh bạ','contacts',NULL,1);
/*!40000 ALTER TABLE `oc_addressbooks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_appconfig`
--

DROP TABLE IF EXISTS `oc_appconfig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_appconfig` (
  `appid` varchar(32) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `configkey` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `configvalue` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`appid`,`configkey`),
  KEY `appconfig_config_key_index` (`configkey`),
  KEY `appconfig_appid_key` (`appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_appconfig`
--

LOCK TABLES `oc_appconfig` WRITE;
/*!40000 ALTER TABLE `oc_appconfig` DISABLE KEYS */;
INSERT INTO `oc_appconfig` VALUES ('afterlogic','enabled','yes'),('afterlogic','installed_version','1.2.3'),('afterlogic','signed','true'),('afterlogic','types',''),('backgroundjob','lastjob','8'),('comments','enabled','no'),('comments','installed_version','0.3.0'),('comments','types','logging,dav'),('configreport','enabled','no'),('configreport','installed_version','0.2.0'),('configreport','types','filesystem'),('contacts','enabled','yes'),('contacts','installed_version','1.5.5'),('contacts','signed','true'),('contacts','types',''),('core','backgroundjobs_mode','cron'),('core','enable_external_storage','no'),('core','first_install_version','10.5.0.10'),('core','installedat','1617676742.6053'),('core','lastcron','1618025114'),('core','lastupdateResult','[]'),('core','lastupdatedat','1619231426'),('core','oc.integritycheck.checker','[]'),('core','public_files','files_sharing/public.php'),('core','public_webdav','dav/appinfo/v1/publicwebdav.php'),('core','shareapi_enforce_links_password_read_write_delete','yes'),('core','umgmt_set_password','false'),('core','umgmt_show_backend','false'),('core','umgmt_show_email','false'),('core','umgmt_show_is_enabled','true'),('core','umgmt_show_last_login','false'),('core','umgmt_show_password','true'),('core','umgmt_show_quota','true'),('core','umgmt_show_storage_location','false'),('core','vendor','owncloud'),('customgroups','enabled','yes'),('customgroups','installed_version','0.6.1'),('customgroups','signed','true'),('customgroups','types','authentication,dav'),('dav','enabled','yes'),('dav','installed_version','0.6.0'),('dav','types','filesystem'),('extract','enabled','yes'),('extract','installed_version','1.2.4'),('extract','signed','true'),('extract','types',''),('federatedfilesharing','enabled','yes'),('federatedfilesharing','installed_version','0.5.0'),('federatedfilesharing','types','filesystem'),('federation','enabled','yes'),('federation','installed_version','0.1.0'),('federation','types','authentication'),('files','cronjob_scan_files','500'),('files','enabled','yes'),('files','installed_version','1.5.2'),('files','types','filesystem'),('files_external','enabled','yes'),('files_external','installed_version','0.7.1'),('files_external','types','filesystem'),('files_mediaviewer','enabled','no'),('files_mediaviewer','installed_version','1.0.3'),('files_mediaviewer','types',''),('files_pdfviewer','enabled','yes'),('files_pdfviewer','installed_version','0.12.1'),('files_pdfviewer','signed','true'),('files_pdfviewer','types',''),('files_sharing','enabled','yes'),('files_sharing','installed_version','0.14.0'),('files_sharing','types','filesystem'),('files_texteditor','enabled','no'),('files_texteditor','installed_version','2.3.0'),('files_texteditor','signed','true'),('files_texteditor','types',''),('files_trashbin','enabled','yes'),('files_trashbin','installed_version','0.9.1'),('files_trashbin','types','filesystem'),('files_versions','enabled','no'),('files_versions','installed_version','1.3.0'),('files_versions','types','filesystem'),('firstrunwizard','enabled','yes'),('firstrunwizard','installed_version','1.2.0'),('firstrunwizard','types',''),('guests','enabled','yes'),('guests','group','guest_app'),('guests','installed_version','0.9.0'),('guests','signed','true'),('guests','types','authentication'),('guests','usewhitelist','true'),('guests','whitelist','settings,avatar,files_external,files_trashbin,files_versions,files_sharing,files_texteditor,activity,firstrunwizard,gallery,notifications,password_policy,oauth2,files_pdfviewer,files_mediaviewer,richdocuments,onlyoffice,wopi'),('market','enabled','yes'),('market','files_mediaviewer','1.0.4'),('market','installed_version','0.6.0'),('market','types',''),('music','enabled','yes'),('music','installed_version','1.1.0'),('music','signed','true'),('music','types','filesystem'),('notifications','enabled','yes'),('notifications','installed_version','0.5.2'),('notifications','types','logging'),('provisioning_api','enabled','yes'),('provisioning_api','installed_version','0.5.0'),('provisioning_api','types','prevent_group_restriction'),('systemtags','enabled','no'),('systemtags','installed_version','0.3.0'),('systemtags','types','logging'),('updatenotification','core','10.6.0'),('updatenotification','enabled','yes'),('updatenotification','installed_version','0.2.1'),('updatenotification','types','');
/*!40000 ALTER TABLE `oc_appconfig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_authtoken`
--

DROP TABLE IF EXISTS `oc_authtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_authtoken` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `login_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `password` longtext COLLATE utf8mb4_bin,
  `name` longtext COLLATE utf8mb4_bin NOT NULL,
  `token` varchar(200) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `type` smallint unsigned NOT NULL DEFAULT '0',
  `last_activity` int unsigned NOT NULL DEFAULT '0',
  `last_check` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `authtoken_token_index` (`token`),
  KEY `authtoken_last_activity_index` (`last_activity`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_authtoken`
--

LOCK TABLES `oc_authtoken` WRITE;
/*!40000 ALTER TABLE `oc_authtoken` DISABLE KEYS */;
INSERT INTO `oc_authtoken` VALUES (22,'admin','admin','a3f7a5fe51c72b11e551f073af7f6cce|vzkkEGxjhjvhgHz2|1ab241ea7418ac4898f7144490b927b0d4a8858addb2cb3b2ec7bd3b2ca5491096bbeac78d6ea18eb3db2c910a5843d676e6a1d0fc4fb95d36744353c3bae319','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','cccddabc263e9b67c564e06ddeb6ac9e2f227ad7920d928a57fb70f0001f961943b6d394af658084c975a52529a13cfcc23aabd2119403b25b959454153ca4f5',0,1617977440,1617977259),(23,'admin','admin','3385bf916bacb4f5732a2f9a7591c965|ZXySxM0TnBslWZ0r|2caf9ea3387516831da9703d4aa37410c5e2215c6f1b5fdb0ddc162d109cbb91030bae02861385956dcf750a74c4883227b1c8d4dba3e8e026c11fa0d9752843','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','d013eb16236fb77af0e7c655820bf4c7320f0cb394e908fdf103117e797b3408dcf40f43e00a5d2b6f051e7721f851ee0eb0be480f9210eb998b0ecd8cfe3c17',0,1617978880,1617978879),(26,'admin','admin','v2|a2d27baa729cd31669a5b82d7fd65da6|aa811f3aff68f075ca3e1d66674889cc|59cfe1a11ce4c8eb5175a14531c35f652373778f52b3abaac8c0136a783eb2e6c7e1d703409ee41b6ab4f2bd469a1174fbe807b541b866aec5adbe459d9c7eb6','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','737c7ea0dd50e9bb74c9c23d4e191ca9948e573924ad0cb7e6002fd924e658a0828670f277e466ab9b648e95032b84d5effc3708e632a500935bac23c0ac87db',0,1618025174,1618025039),(27,'admin','Admin','v2|17282d582efb6b5193c7b7115aafd290|bc5e71d6b4dd34bd8f646bfaac14e6a3|94e838645bf24fc6148abffd89682bb47fb203e5dfef88f4efbcf78eacbb0d20790ed4af6819b40c935ab3d0fdcac3bc9d405c2ea79f0affa4123fe109bcd552','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36','dca039cf743d24fa37c2eaac2af390b41bcec2abb58f294850c18e3588426fe0111a503a92cda2d8c1c611ad0a5fe9b10e99ccce7f813be085da83518b454ef4',0,1618715147,1618715147),(28,'admin','admin','v2|82ee40e4f30f9ef9cb949b7f8689dfc5|ae1e071af41641784aef4fc23547431b|8c86075d375005b13909c901e062d0f6f591cef920b5bb5046ebeddfbea29d5c27bc945617f2400bd1faad799dc17867e2cb7866f49f9ccfca54cb87493422c7','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','fce9047c0a445108762ebe43083db69f455a8653d4189d0525aae1a62633ed4886b00716086f71c22f57022e0acf9b201dced6d2d80d665bc90cdb6d9578dfc6',0,1618732029,1618731945),(30,'admin','admin','v2|79f89a5096bc5e09d85ece56bf79d6a1|98306e03f6553b2749d8dbacc090d2c6|5ee9d37b6a4961fed1a9e6b85438cfcaa0ac81c73253ced71702ba2436ffab25d0de49e69eeed63c9fa5c70dbc3ee9cabf50027fd33f4b903c8ae95a94cc3bba','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','ad1174618657f6bd9ea2828660bd15188b30b6e6b887eaee4de0d9276a3194540410175b86413f16e108a8cf22e40d2de353dc447abd057f5736897cced73cff',0,1619051734,1619051614),(31,'admin','Admin','v2|c8278309484223aece1fd9e49a78c900|2f2e1683c9e9d7dcb8e179edffd6f765|0335bf024580f0051c88dde3e3c96944bc7fbd35a86bf1ed7393ce503f35bae6374689e60a90933cbeb2d8b9b400aa20b886528cf80d93235b073cf17dfc78ab','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36','e5eae61f375b83cfde04366343a1505131d74a0b2bb6d01c0938ffe5304c99401a908079e8bc42af639348129d2fc358125a9dff6d0f72517e134ea9022bedfd',0,1619164200,1619164080),(32,'admin','admin','v2|491c22b8006c6db0437cb997788c7089|da91637dd2838754037bd3b05d3024f7|61edd631c13efe313d41f277201fdeb659a845183bc1b2f48aee59c327ccf9a53b93a8108957db41b3ee0657b8928ed74d25d99d5a5f9abbf955829f227213c3','Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/94.0.202 Chrome/88.0.4324.202 Safari/537.36','85047818fd8db85c6ae106597aeaa8d7231f855084b0f0629d70e1f28bf0942c5682595499be39de63f159b6ef78270b3f293e19d09417cee0add962a41829fe',0,1619231426,1619231426);
/*!40000 ALTER TABLE `oc_authtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_calendarchanges`
--

DROP TABLE IF EXISTS `oc_calendarchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_calendarchanges` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `synctoken` int unsigned NOT NULL DEFAULT '1',
  `calendarid` int NOT NULL,
  `operation` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `calendarid_synctoken` (`calendarid`,`synctoken`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_calendarchanges`
--

LOCK TABLES `oc_calendarchanges` WRITE;
/*!40000 ALTER TABLE `oc_calendarchanges` DISABLE KEYS */;
INSERT INTO `oc_calendarchanges` VALUES (1,'system-Database:newUser.vcf.ics',1,2,3),(2,'system-Database:newUser.vcf-death.ics',2,2,3),(3,'system-Database:newUser.vcf-anniversary.ics',3,2,3),(4,'system-Database:yeuthuykieu.vcf.ics',4,2,3),(5,'system-Database:yeuthuykieu.vcf-death.ics',5,2,3),(6,'system-Database:yeuthuykieu.vcf-anniversary.ics',6,2,3);
/*!40000 ALTER TABLE `oc_calendarchanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_calendarobjects`
--

DROP TABLE IF EXISTS `oc_calendarobjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_calendarobjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `calendardata` longblob,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `calendarid` int unsigned NOT NULL,
  `lastmodified` int unsigned DEFAULT NULL,
  `etag` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `size` bigint unsigned NOT NULL,
  `componenttype` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `firstoccurence` bigint unsigned DEFAULT NULL,
  `lastoccurence` bigint unsigned DEFAULT NULL,
  `uid` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `classification` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `calobjects_index` (`calendarid`,`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_calendarobjects`
--

LOCK TABLES `oc_calendarobjects` WRITE;
/*!40000 ALTER TABLE `oc_calendarobjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_calendarobjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_calendars`
--

DROP TABLE IF EXISTS `oc_calendars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_calendars` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `principaluri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `displayname` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `synctoken` int unsigned NOT NULL DEFAULT '1',
  `description` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `calendarorder` int unsigned NOT NULL DEFAULT '0',
  `calendarcolor` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `timezone` longtext COLLATE utf8mb4_bin,
  `components` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `transparent` smallint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `calendars_index` (`principaluri`,`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_calendars`
--

LOCK TABLES `oc_calendars` WRITE;
/*!40000 ALTER TABLE `oc_calendars` DISABLE KEYS */;
INSERT INTO `oc_calendars` VALUES (1,'principals/users/admin','Cá nhân','personal',1,NULL,0,'#1B223D',NULL,'VEVENT,VTODO',0),(2,'principals/system/system','Contact birthdays','contact_birthdays',7,NULL,0,'#FFFFCA',NULL,'VEVENT,VTODO',0),(3,'principals/users/hoang','Cá nhân','personal',1,NULL,0,'#1B223D',NULL,'VEVENT,VTODO',0),(5,'principals/users/admin','Contact birthdays','contact_birthdays',1,NULL,0,'#FFFFCA',NULL,'VEVENT,VTODO',0);
/*!40000 ALTER TABLE `oc_calendars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_calendarsubscriptions`
--

DROP TABLE IF EXISTS `oc_calendarsubscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_calendarsubscriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `principaluri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `source` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `displayname` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `refreshrate` varchar(10) COLLATE utf8mb4_bin DEFAULT NULL,
  `calendarorder` int unsigned NOT NULL DEFAULT '0',
  `calendarcolor` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `striptodos` smallint DEFAULT NULL,
  `stripalarms` smallint DEFAULT NULL,
  `stripattachments` smallint DEFAULT NULL,
  `lastmodified` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `calsub_index` (`principaluri`,`uri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_calendarsubscriptions`
--

LOCK TABLES `oc_calendarsubscriptions` WRITE;
/*!40000 ALTER TABLE `oc_calendarsubscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_calendarsubscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_cards`
--

DROP TABLE IF EXISTS `oc_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_cards` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `addressbookid` int NOT NULL DEFAULT '0',
  `carddata` longblob,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `lastmodified` bigint unsigned DEFAULT NULL,
  `etag` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `size` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addressbookid_uri_index` (`addressbookid`,`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_cards`
--

LOCK TABLES `oc_cards` WRITE;
/*!40000 ALTER TABLE `oc_cards` DISABLE KEYS */;
INSERT INTO `oc_cards` VALUES (1,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.0//EN\r\nUID:admin\r\nFN:admin\r\nN:admin;;;;\r\nCLOUD:admin@35.247.130.112/owncloud\r\nEND:VCARD\r\n','Database:admin.vcf',1617677074,'68b5f9894ca4aa1ac8cbed03be2260b7',150),(2,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.0//EN\r\nUID:hoang\r\nCLOUD:hoang@35.247.130.112/owncloud\r\nEMAIL:nhuhoang2@gmail.com\r\nPHOTO;ENCODING=b;TYPE=image/jpeg:/9j/4AAQSkZJRgABAQEAYABgAAD//gA+Q1JFQVRPUj\r\n ogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBkZWZhdWx0IHF1YWxpdHkK/9sA\r\n QwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB\r\n 8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy\r\n MjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAYABgAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQ\r\n EBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNR\r\n YQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVl\r\n dYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrC\r\n w8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAA\r\n AAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKB\r\n CBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2\r\n RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG\r\n x8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8CxRRSg0AIBU0f\r\n WowKliHNNAXYSRitOFjtFZ0K9K7/wh/Z9hptzf3uhf2o7HYgaTaIl6FgOpbPpyMVrEzZyjEnA5\r\n 5qpchsHHQcGuq16SC+kie301LKQxl9iyqx2gkfMOoPfnnHWubuEJATHB5NNiRjSjrVY1duVw1V\r\n iKyZoRYoxUm2k20gI8UAVL5ZzUixHHSmkFyDBqWMEU7yzU0cfTNCQXLEIIwa6yXQ5dM8Ox3+qW\r\n j+XPhkSSPOE6q3tlhj1x6g1r/D46d4exrWrQRl7j93ZGXG1cEZbnpzwD7NV3Vb+xv45Lm5vTi6\r\n Jk2cSbfmydmTwMnt/dzVt2RK1ZgWOnXGteXJb2EdtC6/IVUJvJLEkDgt/kYqveaT9kaNJSHkcF\r\n lVB9769wfaui01LO21G1v9GsJL6K3iUvcXB8xzJ1wFJ46Acdga15dc/trVbnS7/TrOxuJUaSC5\r\n hwjblT7pPGTkfr9KzhXpuXs+ZXNp4Wsoe05dDxu9jKyMHBV1OCpGMVSxXR65FEXZkmEhACgjPI\r\n H9K5/wAs1clqZJ6EZoqUxEDNNAqbDLhtsZyy5HbvUqwYXpWrcwSXV405C5kJY8YH6VqafpvnTy\r\n grG5WINgLwP8ccV0KBi5nJGA54FSwWryzJGilmchVHqTWw2mTF5dkZYR8vgfdGcUW0JguYZcH5\r\n HDcexpcg+Y157e51O+WwthDFFpybw/mMd+MABcgAcj69eTTdL0b7Wkj3s9xGqIGijBT5w2T8xz\r\n xjjjGea1tRgTRNT12W1M3N0sSIWO4od+5UOST8jqc9uK4xPtKajKjLKpILESMBwemeTg9OKwqX\r\n 5XY6KKjzpS2PbPCmmx2WgxMsyF2iOGEe0gjOTjPP1rlNbty2iy6tEg+12t6XDDPBDEgYPYgfrW\r\n z4Q1N0sTCyQSHb8pSdXKBjjnnA5GPrXOxXZGsalp0rhLa/k8tn24KMMhTnsMnB9ifSvlsNQrTr\r\n zkt42frrt9x9HVqwpe7J3jLT5WOL1eNGMU0MiNFMoYKpyR9f5fhWSYh2rrtd02yttJ0prSDy2M\r\n bpINxPzI7KSc+vX8a51ojngGvro+9FSXU+XqJ05uL6OxQkiOylt9NnuQ5iTcVXfjuwyAcep56V\r\n pfZWKjKnmnpbPGDs4OPSm4E8x2974UnhCPaTQ3MRBMTwzIfMAGSVGc/1rFk0bWI76NZna1STgG\r\n QbcYIJ781f0fQdU02SJDDbyT2zbwskU7bSR0IUe+fyp+tR30mvxQ6oUJlOTFGSAoxg4zyPx9Pr\r\n VXb0ZNrbEMdtExkjgmEpP8RPLAd8VYtdKR5UEp2oXGT7ZrT0bwtcR3KXzXK+VEZFjQqCxXodxz\r\n j14HfNa8mmLJMohUgkZIBreCutTGUknoedXusRJNqCwL5itPJJEQ5bDEYB579OPbFc7qt4dRvD\r\n NeZ+17VWQn5eQMflx2rtvFWkw2WpG8tY2juSqFIZ0DiZtw4AAwTz7g4xXLatY3d7fwQtaRRAhI\r\n ojHyZOgyck856+9ck09jqhJbmp4ZtBqmlalDFFMrxqpWUZABUllA5zyc8bT+HWta10kxWi3WoX\r\n yLFJIzSzSJsEP94EdSQc/WsbwvaXGnalqFq7FHthIH+UdVz059v0711unFNUsZopFBVnLOpIdS\r\n STnBB/yfrXn4aM1iZQX/DaHq4uUZYWE2zEm+y6nLNJZ3Es9sJGK+Yc4zg8egOc4+tRvpG0bgAT\r\n jHcYrr4tIhhtfLihWJQOAoqC6iW2t3lMPmFF3bc47dT7CvYp0vZ01HseHVrOpNy7sTWLQ3PhPS\r\n o4kBEYG9gOQeRya5210lpZ/JVczEHaPoK7fR4ZbnwushCb5gskmzgKM8Y9+lN0+CK01G2nkQMQ\r\n rEMSflPIq7aXMua2hymoeL9Wn16HUwksCJtyyAhGxjkjp2Hr0qG58ViVZbi7iiuLl5T8zKBszj\r\n pxnJx2wAB71s6jZW+nRxGZY5rc8SIhwcfpXITaTDPd4kBj4AXy8/NwOeRXnYes6sOax6+NwsaF\r\n Tk5rnb+EdeutWNz9tRxHblWiZcnb6qQT0IwfqK9CsraK6tI5xGF3ryVH3TjpXmvhOxuNJuYArX\r\n G2YsSoJUHBxzgjP/669z0e1ik0qCRlwXjHB5211Kpyo8+dJtnivi3SzfeLNN0ZpXmlDqqkL8wR\r\n /vHjqVADDGBz0rgbUmx8XWUdyq7I7pCwUcDDDjj0H+FfSh8JWY8eR64quJUtm53cbyAgOP8Adz\r\n XzV4oSSw8U3kchd7qKYjcTjkHjj9cD1rNy5tTVRsrG/wDEKz/sL4gagYzJGLiNSiqccFQCfcEg\r\n 10/gfQLuRjqFzMJ4p418vGfugYwewxj079a5nxfqt/qmpaZPdxeVcvYwq2V5Y469O/WvefCGg/\r\n 2Z4ds4LlD5qxrkNwR7EUR5E/adSqntORU+hy6aO5mZZDtUZxj1rhPHVxJYTx2IiDlVLsWBVVDc\r\n A5B5PB68fXNe/HTYDJvK85rg/Hvgey1E/bIWlS7kGxVyShfgD6da0lXUlYwhRaZxfw9uy7T6d5\r\n jSW+zMW7t3OPboR/KuultYjJGXiO2MHIXGT79DWl4G8MW+m6IVkkW5xLuXZGV2t3GTyR/9esrx\r\n FcX9trZe0Zo7YLwiED2xyeeR+tVTqXVkTUpWl7zLGv8Aw+066sZZINUkwgMgSVw4OB0zXA6Pp0\r\n lxqSrHAk5UFHKjcI/RjjOOO59K0/DvxDDW0FrdIjKi7WLN14+laseteHpWyiQQMcgmJTzXAsS4\r\n vk5T1Y4Nz/eOX9fNm/Y21hJJuRWD7nCuSNuB6fhXcWcPkWkcWQcDqK8ssL/SrKcFYFcRk7STuH\r\n Psa6ePxmg6AEdhW0nzfCYypOK95o7PA3bsc4xmvlPxtDGPiZciafAe5bcxGRy2Qf1r6Fi8YwSR\r\n hmjIz7GvB/inpBm8QJrNkdyTsS6dNrDv+NK0kZxlG56Pc6JpkvxF0o3k5kiuolktzgclVBwfrX\r\n rFeK2WlG6uPDepyam3k2lopkWTJk37RgA4xtHT8K9X0/Vre4gUByWAwc96yhGcYrm8y6soyl7r\r\n vsaYJqG5t4rhAJRkKwYHPQiq9zqttbIWZxn0ziud1PxhbLHti8zHUshGR+FOTdtEEYu99jq7e2\r\n htIRHEoVM5rF1PTbqd28hbcp0UbBnH41gRfEO2BKNM5Yf3oSP14FDfEW2zhZYG+oNR7dw+yy/q\r\n zqPdP5n/2Q==\r\nFN:hoang\r\nN:hoang;;;;\r\nEND:VCARD\r\n','Database:hoang.vcf',1617695951,'bcd0ba6453348df60ae5c2b8a024f7c4',4504),(3,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.0//EN\r\nUID:hung\r\nFN:hung\r\nN:hung;;;;\r\nCLOUD:hung@35.247.130.112/owncloud\r\nEMAIL:hung@gmail.com\r\nEND:VCARD\r\n','Database:hung.vcf',1617696417,'418fc1ae0117c124ad05a4bbb5b93330',168),(5,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.0//EN\r\nUID:member\r\nFN:member\r\nN:member;;;;\r\nCLOUD:member@35.247.130.112/owncloud\r\nEMAIL:member@gmail.com\r\nEND:VCARD\r\n','Database:member.vcf',1617843548,'32574686ee8586d6b70998be5aec4aaa',178),(6,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.0//EN\r\nUID:testGuest\r\nFN:testGuest\r\nN:testGuest;;;;\r\nCLOUD:testGuest@35.247.130.112/owncloud\r\nEMAIL:nhuhoang.afk2@gmail.com\r\nEND:VCARD\r\n','Database:testGuest.vcf',1617960494,'55a5ce083d9b3235691476a4b2a2c47d',197),(7,1,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:New contact\r\nUID:0e41a179-00fa-4f87-b5fc-58ef3ed4ade8\r\nTEL;TYPE=HOME,VOICE:0387448824\r\nREV:20210409T110308Z\r\nEND:VCARD','0e41a179-00fa-4f87-b5fc-58ef3ed4ade8.vcf',1617966189,'e2d4258e1da00cb4dd07cce0a7adc4b1',147),(8,1,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nFN:New contact\r\nUID:478a6fc8-1a19-4e24-95d7-4cf0034372c7\r\nEND:VCARD','478a6fc8-1a19-4e24-95d7-4cf0034372c7.vcf',1617966200,'a364ce47425ae5c8980ee69bc5047bb7',93),(10,2,_binary 'BEGIN:VCARD\r\nVERSION:3.0\r\nPRODID:-//Sabre//Sabre VObject 4.3.5//EN\r\nUID:test\r\nFN:test\r\nN:test;;;;\r\nCLOUD:test@35.247.130.112/owncloud\r\nEMAIL:test@test.com\r\nEND:VCARD\r\n','Database:test.vcf',1619231442,'02ecb8cf2913ad22a7515755f302a398',167);
/*!40000 ALTER TABLE `oc_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_cards_properties`
--

DROP TABLE IF EXISTS `oc_cards_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_cards_properties` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `addressbookid` bigint NOT NULL DEFAULT '0',
  `cardid` bigint unsigned NOT NULL DEFAULT '0',
  `name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `value` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `preferred` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `card_value_index` (`value`),
  KEY `card_name_index` (`name`),
  KEY `card_contactid_index` (`cardid`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_cards_properties`
--

LOCK TABLES `oc_cards_properties` WRITE;
/*!40000 ALTER TABLE `oc_cards_properties` DISABLE KEYS */;
INSERT INTO `oc_cards_properties` VALUES (1,2,1,'UID','admin',0),(2,2,1,'FN','admin',0),(3,2,1,'N','admin;;;;',0),(4,2,1,'CLOUD','admin@35.247.130.112/owncloud',0),(59,2,2,'UID','hoang',0),(60,2,2,'CLOUD','hoang@35.247.130.112/owncloud',0),(61,2,2,'EMAIL','nhuhoang2@gmail.com',0),(62,2,2,'FN','hoang',0),(63,2,2,'N','hoang;;;;',0),(68,2,3,'UID','hung',0),(69,2,3,'FN','hung',0),(70,2,3,'N','hung;;;;',0),(71,2,3,'CLOUD','hung@35.247.130.112/owncloud',0),(72,2,3,'EMAIL','hung@gmail.com',0),(86,2,5,'UID','member',0),(87,2,5,'FN','member',0),(88,2,5,'N','member;;;;',0),(89,2,5,'CLOUD','member@35.247.130.112/owncloud',0),(90,2,5,'EMAIL','member@gmail.com',0),(95,2,6,'UID','testGuest',0),(96,2,6,'FN','testGuest',0),(97,2,6,'N','testGuest;;;;',0),(98,2,6,'CLOUD','testGuest@35.247.130.112/owncloud',0),(99,2,6,'EMAIL','nhuhoang.afk2@gmail.com',0),(102,1,7,'FN','New contact',0),(103,1,7,'UID','0e41a179-00fa-4f87-b5fc-58ef3ed4ade8',0),(104,1,7,'TEL','0387448824',0),(105,1,8,'FN','New contact',0),(106,1,8,'UID','478a6fc8-1a19-4e24-95d7-4cf0034372c7',0),(120,2,10,'UID','test',0),(121,2,10,'FN','test',0),(122,2,10,'N','test;;;;',0),(123,2,10,'CLOUD','test@35.247.130.112/owncloud',0),(124,2,10,'EMAIL','test@test.com',0);
/*!40000 ALTER TABLE `oc_cards_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_comments`
--

DROP TABLE IF EXISTS `oc_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_comments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int unsigned NOT NULL DEFAULT '0',
  `topmost_parent_id` int unsigned NOT NULL DEFAULT '0',
  `children_count` int unsigned NOT NULL DEFAULT '0',
  `actor_type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `actor_id` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `message` longtext COLLATE utf8mb4_bin,
  `verb` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `creation_timestamp` datetime DEFAULT NULL,
  `latest_child_timestamp` datetime DEFAULT NULL,
  `object_type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `object_id` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `comments_parent_id_index` (`parent_id`),
  KEY `comments_topmost_parent_id_idx` (`topmost_parent_id`),
  KEY `comments_object_index` (`object_type`,`object_id`,`creation_timestamp`),
  KEY `comments_actor_index` (`actor_type`,`actor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_comments`
--

LOCK TABLES `oc_comments` WRITE;
/*!40000 ALTER TABLE `oc_comments` DISABLE KEYS */;
INSERT INTO `oc_comments` VALUES (1,0,0,0,'users','hoang','hello','comment','2021-04-06 07:59:04',NULL,'files','17'),(2,0,0,0,'users','hoang','Đây là 1 bình luận','comment','2021-04-06 08:12:36',NULL,'files','17');
/*!40000 ALTER TABLE `oc_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_comments_read_markers`
--

DROP TABLE IF EXISTS `oc_comments_read_markers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_comments_read_markers` (
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `marker_datetime` datetime DEFAULT NULL,
  `object_type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `object_id` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  UNIQUE KEY `comments_marker_index` (`user_id`,`object_type`,`object_id`),
  KEY `comments_marker_object_index` (`object_type`,`object_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_comments_read_markers`
--

LOCK TABLES `oc_comments_read_markers` WRITE;
/*!40000 ALTER TABLE `oc_comments_read_markers` DISABLE KEYS */;
INSERT INTO `oc_comments_read_markers` VALUES ('admin','2021-04-06 08:06:24','files','17'),('hoang','2021-04-06 08:12:36','files','17');
/*!40000 ALTER TABLE `oc_comments_read_markers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_credentials`
--

DROP TABLE IF EXISTS `oc_credentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_credentials` (
  `user` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `identifier` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `credentials` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`user`,`identifier`),
  KEY `credentials_user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_credentials`
--

LOCK TABLES `oc_credentials` WRITE;
/*!40000 ALTER TABLE `oc_credentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_credentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_custom_group`
--

DROP TABLE IF EXISTS `oc_custom_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_custom_group` (
  `group_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uri` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `display_name` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `cg_uri_index` (`uri`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_custom_group`
--

LOCK TABLES `oc_custom_group` WRITE;
/*!40000 ALTER TABLE `oc_custom_group` DISABLE KEYS */;
INSERT INTO `oc_custom_group` VALUES (1,'custom group','custom group'),(2,'custom group 2','custom group 2');
/*!40000 ALTER TABLE `oc_custom_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_custom_group_member`
--

DROP TABLE IF EXISTS `oc_custom_group_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_custom_group_member` (
  `group_id` bigint unsigned NOT NULL,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `role` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`group_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_custom_group_member`
--

LOCK TABLES `oc_custom_group_member` WRITE;
/*!40000 ALTER TABLE `oc_custom_group_member` DISABLE KEYS */;
INSERT INTO `oc_custom_group_member` VALUES (1,'admin',1),(1,'hung',0),(2,'hoang',1);
/*!40000 ALTER TABLE `oc_custom_group_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_dav_job_status`
--

DROP TABLE IF EXISTS `oc_dav_job_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_dav_job_status` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `uuid` char(36) COLLATE utf8mb4_bin NOT NULL COMMENT '(DC2Type:guid)',
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `status_info` varchar(4000) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_18BBA548D17F50A6` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_dav_job_status`
--

LOCK TABLES `oc_dav_job_status` WRITE;
/*!40000 ALTER TABLE `oc_dav_job_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_dav_job_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_dav_properties`
--

DROP TABLE IF EXISTS `oc_dav_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_dav_properties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `propertypath` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `propertyname` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `propertyvalue` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `propertytype` smallint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `propertypath_index` (`propertypath`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_dav_properties`
--

LOCK TABLES `oc_dav_properties` WRITE;
/*!40000 ALTER TABLE `oc_dav_properties` DISABLE KEYS */;
INSERT INTO `oc_dav_properties` VALUES (1,'customgroups/groups/custom group','{http://owncloud.org/ns}role','admin',1),(2,'customgroups/groups/custom group 2','{http://owncloud.org/ns}role','admin',1),(3,'customgroups/groups/cusGroup 1','{http://owncloud.org/ns}role','admin',1);
/*!40000 ALTER TABLE `oc_dav_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_dav_shares`
--

DROP TABLE IF EXISTS `oc_dav_shares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_dav_shares` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `principaluri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `access` smallint DEFAULT NULL,
  `resourceid` int unsigned NOT NULL,
  `publicuri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dav_shares_index` (`principaluri`,`resourceid`,`type`,`publicuri`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_dav_shares`
--

LOCK TABLES `oc_dav_shares` WRITE;
/*!40000 ALTER TABLE `oc_dav_shares` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_dav_shares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_external_applicable`
--

DROP TABLE IF EXISTS `oc_external_applicable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_external_applicable` (
  `applicable_id` bigint NOT NULL AUTO_INCREMENT,
  `mount_id` bigint NOT NULL,
  `type` int NOT NULL,
  `value` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`applicable_id`),
  UNIQUE KEY `applicable_type_value_mount` (`type`,`value`,`mount_id`),
  KEY `applicable_mount` (`mount_id`),
  KEY `applicable_type_value` (`type`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_external_applicable`
--

LOCK TABLES `oc_external_applicable` WRITE;
/*!40000 ALTER TABLE `oc_external_applicable` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_external_applicable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_external_config`
--

DROP TABLE IF EXISTS `oc_external_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_external_config` (
  `config_id` bigint NOT NULL AUTO_INCREMENT,
  `mount_id` bigint NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `value` varchar(4096) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`config_id`),
  UNIQUE KEY `config_mount_key` (`mount_id`,`key`),
  KEY `config_mount` (`mount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_external_config`
--

LOCK TABLES `oc_external_config` WRITE;
/*!40000 ALTER TABLE `oc_external_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_external_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_external_mounts`
--

DROP TABLE IF EXISTS `oc_external_mounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_external_mounts` (
  `mount_id` bigint NOT NULL AUTO_INCREMENT,
  `mount_point` varchar(128) COLLATE utf8mb4_bin NOT NULL,
  `storage_backend` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `auth_backend` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `priority` int NOT NULL DEFAULT '100',
  `type` int NOT NULL,
  PRIMARY KEY (`mount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_external_mounts`
--

LOCK TABLES `oc_external_mounts` WRITE;
/*!40000 ALTER TABLE `oc_external_mounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_external_mounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_external_options`
--

DROP TABLE IF EXISTS `oc_external_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_external_options` (
  `option_id` bigint NOT NULL AUTO_INCREMENT,
  `mount_id` bigint NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `value` varchar(256) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_mount_key` (`mount_id`,`key`),
  KEY `option_mount` (`mount_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_external_options`
--

LOCK TABLES `oc_external_options` WRITE;
/*!40000 ALTER TABLE `oc_external_options` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_external_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_federated_reshares`
--

DROP TABLE IF EXISTS `oc_federated_reshares`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_federated_reshares` (
  `share_id` bigint NOT NULL,
  `remote_id` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'share ID at the remote server',
  UNIQUE KEY `share_id_index` (`share_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_federated_reshares`
--

LOCK TABLES `oc_federated_reshares` WRITE;
/*!40000 ALTER TABLE `oc_federated_reshares` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_federated_reshares` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_file_locks`
--

DROP TABLE IF EXISTS `oc_file_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_file_locks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `lock` int NOT NULL DEFAULT '0',
  `key` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `ttl` int NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `lock_key_index` (`key`),
  KEY `lock_ttl_index` (`ttl`)
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_file_locks`
--

LOCK TABLES `oc_file_locks` WRITE;
/*!40000 ALTER TABLE `oc_file_locks` DISABLE KEYS */;
INSERT INTO `oc_file_locks` VALUES (48,0,'files/debca4e5c7faf19678bb2a295a3e28fe',1619235042),(57,0,'files/80135f14e6f4fda923b9c67f0feb3ff6',1619235042),(63,0,'files/1ed9cc0f538cbc761b4f7d1a399513cc',1619235042),(64,0,'files/3df433bd1aacb55b0db4492a928ce34b',1619235042),(66,0,'files/89210ebccef7fe42e4561f9bb370c6ff',1619235029),(67,0,'files/125d72d7b35f7802c65437ec94b8f5a5',1619235029),(68,0,'files/b8fd696236fec9a1c4b33d6fa57b740b',1619235029),(69,0,'files/3d4e2449728d20b84324ab98ab04753d',1619235029),(70,0,'files/28e3813ad52573085f2f26ec2eec2f69',1619235029),(71,0,'files/9180d8c97500cd81f94db578cc19bcd9',1619235029),(72,0,'files/95b1c905feb49822c24cf5f619de06d5',1619235029),(73,0,'files/0c978723251c7a7aec1bdba06f6adc1e',1619235029),(79,0,'files/22b849c6de663b6c4c2ba4496154dc4a',1618759665),(80,0,'files/e49649785542ba53dca70c4f65c9a74c',1618759688),(81,0,'files/b6ef755cfc70b5eb94f5d3aad8ba833d',1619051024),(82,0,'files/bdb62f534ce05f533609286ca1b9a882',1618759767),(83,0,'files/41fac6583b33c620c0592d0b0af1afd2',1619051018),(84,0,'files/3513aba8aa4305d3ad33fc7122d4af30',1619051024);
/*!40000 ALTER TABLE `oc_file_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_filecache`
--

DROP TABLE IF EXISTS `oc_filecache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_filecache` (
  `fileid` bigint NOT NULL AUTO_INCREMENT,
  `storage` int NOT NULL DEFAULT '0',
  `path` varchar(4000) COLLATE utf8mb4_bin DEFAULT NULL,
  `path_hash` varchar(32) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `parent` bigint NOT NULL DEFAULT '0',
  `name` varchar(250) COLLATE utf8mb4_bin DEFAULT NULL,
  `mimetype` int NOT NULL DEFAULT '0',
  `mimepart` int NOT NULL DEFAULT '0',
  `size` bigint NOT NULL DEFAULT '0',
  `mtime` bigint NOT NULL DEFAULT '0',
  `storage_mtime` bigint NOT NULL DEFAULT '0',
  `encrypted` int NOT NULL DEFAULT '0',
  `unencrypted_size` bigint NOT NULL DEFAULT '0',
  `etag` varchar(40) COLLATE utf8mb4_bin DEFAULT NULL,
  `permissions` int DEFAULT '0',
  `checksum` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`fileid`),
  UNIQUE KEY `fs_storage_path_hash` (`storage`,`path_hash`),
  KEY `fs_parent_name_hash` (`parent`,`name`),
  KEY `fs_storage_mimetype` (`storage`,`mimetype`),
  KEY `fs_storage_mimepart` (`storage`,`mimepart`),
  KEY `fs_storage_size` (`storage`,`size`,`fileid`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_filecache`
--

LOCK TABLES `oc_filecache` WRITE;
/*!40000 ALTER TABLE `oc_filecache` DISABLE KEYS */;
INSERT INTO `oc_filecache` VALUES (1,1,'','d41d8cd98f00b204e9800998ecf8427e',-1,'',2,1,32355927,1618755999,1617970447,0,0,'607c419f445bf',23,''),(2,1,'cache','0fea6a13c52b4d4725368f24b045ca84',1,'cache',2,1,0,1618715147,1618715147,0,0,'607ba20b89824',31,''),(3,1,'files','45b963397aa40d4a0063e0d85e4fe7a1',1,'files',2,1,32088801,1617970451,1617970451,0,0,'607045136cb0c',31,''),(4,1,'files/Documents','0ad78ba05b6961d92f7970b2b3922eca',3,'Documents',2,1,36227,1617676828,1617676828,0,0,'606bca1c2dff8',31,''),(5,1,'files/Documents/Example.odt','c89c560541b952a435783a7d51a27d50',4,'Example.odt',4,3,36227,1617676828,1617676828,0,0,'3d735ce496ba6aa47fb458d2b4cfb01b',27,'SHA1:a2c861e88db506c0deadb9f7d78a1e27212ce9fc MD5:12348c01fb20e0230c1afdacfe514308 ADLER32:85ffdff5'),(6,1,'files/ownCloud Manual.pdf','a73aa0f95f162297bbb7ffa3fb5ad709',3,'ownCloud Manual.pdf',5,3,6110772,1617676828,1617676828,0,0,'ee37e73dbb10cf636217a9468c46995a',27,'SHA1:73a9024b2579e6ac2c92f5494145fd817e11f184 MD5:3732c93b8c0bc5fd4534dd5c317c6225 ADLER32:10828dc1'),(7,1,'files/Photos','d01bb67e7b71dd49fd06bad922f521c9',3,'Photos',2,1,1011464,1617676828,1617676828,0,0,'606bca1ccc950',31,''),(8,1,'files/Photos/Portugal.jpg','99079102f2763830ef072aa7459c0b13',7,'Portugal.jpg',7,6,243733,1617676828,1617676828,0,0,'250cbf1f5dc91019c25225bc27e1afa2',27,'SHA1:872adcabcb4e06bea6265200c0d71b12defe2df1 MD5:01b38c622feac31652d738a94e15e86b ADLER32:6959358d'),(9,1,'files/Photos/Lake-Constance.jpg','7055b85346dc19417e7f3d7b3e7a154a',7,'Lake-Constance.jpg',7,6,538942,1617676828,1617676828,0,0,'70ec01e2fec50963e927f412c41583ea',27,'SHA1:b26d5544e642330e2858a4d8528cb108ddbca9e3 MD5:147156bc95dba89fab2227507462ebea ADLER32:f21d8700'),(10,1,'files/Photos/Teotihuacan.jpg','704b0aeb1b065272539e87218dee5f7a',7,'Teotihuacan.jpg',7,6,228789,1617676828,1617676828,0,0,'b987f8ceb61cc985ce92542e90ee5489',27,'SHA1:8ae951c9412a00be206912b95fe8e5c7c3c05667 MD5:2617bb41ab25b8acd0c18cefefbf6360 ADLER32:91867251'),(11,2,'','d41d8cd98f00b204e9800998ecf8427e',-1,'',2,1,-1,1617958298,1617958298,0,0,'60701c8d08d47',23,''),(12,2,'avatars','aec9f4efc5a055bbd053f220538c61e0',11,'avatars',2,1,-1,1618024189,1618024189,0,0,'60711a50d852a',31,''),(13,2,'files_external','c270928b685e7946199afdfb898d27ea',11,'files_external',2,1,0,1617682431,1617682431,0,0,'606bdfff9d104',31,''),(14,3,'','d41d8cd98f00b204e9800998ecf8427e',-1,'',2,1,26346680,1617710537,1617695317,0,0,'606c4dc91a9d0',23,''),(15,3,'cache','0fea6a13c52b4d4725368f24b045ca84',14,'cache',2,1,0,1617696466,1617696466,0,0,'606c16d2927aa',31,''),(16,3,'files','45b963397aa40d4a0063e0d85e4fe7a1',14,'files',2,1,15903941,1617710537,1617710536,0,0,'606c4dc9106d9',31,''),(17,3,'files/Documents','0ad78ba05b6961d92f7970b2b3922eca',16,'Documents',2,1,36227,1617682480,1617682480,0,0,'606be030ac651',31,''),(18,3,'files/Documents/Example.odt','c89c560541b952a435783a7d51a27d50',17,'Example.odt',4,3,36227,1617682480,1617682480,0,0,'aae27adfed3e939718d1015a1f95ca93',27,'SHA1:a2c861e88db506c0deadb9f7d78a1e27212ce9fc MD5:12348c01fb20e0230c1afdacfe514308 ADLER32:85ffdff5'),(19,3,'files/ownCloud Manual.pdf','a73aa0f95f162297bbb7ffa3fb5ad709',16,'ownCloud Manual.pdf',5,3,6110772,1617682480,1617682480,0,0,'4acf00ae45e80fd32e10e881bdec37b0',27,'SHA1:73a9024b2579e6ac2c92f5494145fd817e11f184 MD5:3732c93b8c0bc5fd4534dd5c317c6225 ADLER32:10828dc1'),(20,3,'files/Photos','d01bb67e7b71dd49fd06bad922f521c9',16,'Photos',2,1,538942,1617695317,1617695317,0,0,'606c1255edb50',31,''),(21,3,'files_trashbin/files/Portugal.jpg.d1617695317','5010022b3e2607911d81c66d48971d21',40,'Portugal.jpg.d1617695317',8,3,243733,1617682481,1617682481,0,0,'db3ad8dfcca001e8fc04f348fa0ab8e5',27,'SHA1:872adcabcb4e06bea6265200c0d71b12defe2df1 MD5:01b38c622feac31652d738a94e15e86b ADLER32:6959358d'),(22,3,'files/Photos/Lake-Constance.jpg','7055b85346dc19417e7f3d7b3e7a154a',20,'Lake-Constance.jpg',7,6,538942,1617682481,1617682481,0,0,'0b43a086e71e8275cf1abf21857aaa03',27,'SHA1:b26d5544e642330e2858a4d8528cb108ddbca9e3 MD5:147156bc95dba89fab2227507462ebea ADLER32:f21d8700'),(23,3,'files_trashbin/files/Teotihuacan.jpg.d1617695317','cf512aae175658bcedf8104703640833',40,'Teotihuacan.jpg.d1617695317',8,3,228789,1617682481,1617682481,0,0,'6a5665ac96e905de1a15ee2bd9e85717',27,'SHA1:8ae951c9412a00be206912b95fe8e5c7c3c05667 MD5:2617bb41ab25b8acd0c18cefefbf6360 ADLER32:91867251'),(26,3,'thumbnails','3b8779ba05b8f0aed49650f3ff8beb4b',14,'thumbnails',2,1,752217,1617710537,1617710537,0,0,'606c4dc91a9d0',31,''),(33,3,'thumbnails/22','53d91e5d0404e82175284822c12d0174',26,'22',2,1,382311,1617695168,1617695168,0,0,'606c11c0111e0',31,''),(34,3,'thumbnails/22/2048-541-max.png','de2df1c225626755b72f015994e78c40',33,'2048-541-max.png',9,6,210954,1617695125,1617695125,0,0,'2955fb32b254b6beee4c660f4d9ccda3',27,'SHA1:a55d92a36a7832bc13984579b90cc20d20d7b06e MD5:2034c2800e886c84d4a82c6eca289713 ADLER32:96a73b28'),(35,3,'thumbnails/22/32-32.png','2ff01b7fa1b9a6f72efaaa5c0080ace3',33,'32-32.png',9,6,1005,1617695125,1617695125,0,0,'049bebc867804bb244daaa7e5e517299',27,'SHA1:91cb60504116f9346b69377c13b0e9025071d168 MD5:267888663f4428eb7704213fe2a6b6a1 ADLER32:a42b87e2'),(38,3,'thumbnails/22/1920-507-with-aspect.png','453524c2e41e8df63fc8b4051216dda3',33,'1920-507-with-aspect.png',9,6,170352,1617695168,1617695168,0,0,'7152e0902646a5e46187396fc8d6a883',27,'SHA1:da6267cc8fd55982017a5b24f1bdd5f1370d82f0 MD5:212a7e2f02391d837664817ba37e2f14 ADLER32:7e5a91da'),(39,3,'files_trashbin','fb66dca5f27af6f15c1d1d81e6f8d28b',14,'files_trashbin',2,1,9690522,1617710536,1617695317,0,0,'606c4dc90a978',31,''),(40,3,'files_trashbin/files','3014a771cbe30761f2e9ff3272110dbf',39,'files',2,1,9690522,1617710536,1617710536,0,0,'606c4dc90a978',31,''),(41,3,'files_trashbin/versions','c639d144d3f1014051e14a98beac5705',39,'versions',2,1,0,1617695317,1617695317,0,0,'606c1255cd0ea',31,''),(42,3,'files_trashbin/keys','9195c7cfc1b867f229ac78cc1b6a0be3',39,'keys',2,1,0,1617695317,1617695317,0,0,'606c1255d2736',31,''),(43,3,'thumbnails/21','883a436f8aa3dee9f97c880e4892a4a7',26,'21',2,1,127424,1617695319,1617695319,0,0,'606c12579ec18',31,''),(44,3,'thumbnails/21/1024-768-max.png','5a86876e024ec0570615119813f90e42',43,'1024-768-max.png',9,6,126124,1617695319,1617695319,0,0,'3121add5f8f92124f4b52fcd01e18c91',27,'SHA1:086cebd754e5c9904bbaa2dc059a6121a14de04c MD5:5c2870efdf5d7801fa3130dadb51fd19 ADLER32:3ba5ac68'),(45,3,'thumbnails/23','44d5bfbdde2531d3c0ba65c1ea6b030f',26,'23',2,1,90431,1617695319,1617695319,0,0,'606c1257a99aa',31,''),(46,3,'thumbnails/21/44-44.png','1a089aef4420edd1cb0a7a5d66cf8062',43,'44-44.png',9,6,1300,1617695319,1617695319,0,0,'c38a546b340bcb8a056e3287cfbcb251',27,'SHA1:84004b08a8eeb4ef2e659a39f87f4e899eaeda61 MD5:896314efbe91e1a32914a4b7d5ed20f0 ADLER32:81611cbf'),(47,3,'thumbnails/23/1024-768-max.png','aaa6f5df4d53ca307468669a969baa6b',45,'1024-768-max.png',9,6,89157,1617695319,1617695319,0,0,'6c2a7fe0fc7145cd6a86f926ed23a89c',27,'SHA1:d6153622a1cd5f1a4461714093fd79fa1a4b9eff MD5:4ae275ee9657ef18a8d00f2d6531e635 ADLER32:f116b037'),(48,3,'thumbnails/23/44-44.png','17f5bb40793a88afff5081c5271d01f1',45,'44-44.png',9,6,1274,1617695319,1617695319,0,0,'687093486ecd8a34ca1cd8e3f64cd27f',27,'SHA1:b1e9ef7649faace93930440efd607cbbbccdf725 MD5:e181e3d07a1543b19339c452184c758f ADLER32:62ff097e'),(49,3,'files/new','5abe554a39b852348e527570ee931bbb',16,'new',2,1,0,1617703389,1617703389,0,0,'606c31dd4288b',31,''),(50,1,'thumbnails','3b8779ba05b8f0aed49650f3ff8beb4b',1,'thumbnails',2,1,266823,1618755999,1617967216,0,0,'607c419f445bf',31,''),(51,1,'thumbnails/22','53d91e5d0404e82175284822c12d0174',50,'22',2,1,211959,1617704490,1617704490,0,0,'606c362abcffb',31,''),(52,1,'thumbnails/22/2048-541-max.png','de2df1c225626755b72f015994e78c40',51,'2048-541-max.png',9,6,210954,1617704490,1617704490,0,0,'cf24b573fbb0e2f9f6dbc3ec2cec6903',27,'SHA1:a55d92a36a7832bc13984579b90cc20d20d7b06e MD5:2034c2800e886c84d4a82c6eca289713 ADLER32:96a73b28'),(53,1,'thumbnails/22/32-32.png','2ff01b7fa1b9a6f72efaaa5c0080ace3',51,'32-32.png',9,6,1005,1617704490,1617704490,0,0,'69389d4110bfc7220705d69bf89e2b3d',27,'SHA1:91cb60504116f9346b69377c13b0e9025071d168 MD5:267888663f4428eb7704213fe2a6b6a1 ADLER32:a42b87e2'),(54,3,'files/07_4k.jpg','a1a4a7bf33271092bc4da8091088a372',16,'07_4k.jpg',7,6,9218000,1573380974,1573380974,0,0,'1912010d585667457c33f045a311f4ec',27,'SHA1:fbba508971a2a041d9763af4410a2d6de8b9a68b MD5:9f47d7c9045d9f5dfd1c95a85e1f37d4 ADLER32:b8b6f7ac'),(55,3,'thumbnails/54','1948c83af4584bcaf6f1c01d569e5480',26,'54',2,1,152051,1617710499,1617710499,0,0,'606c4da3943fd',31,''),(56,3,'thumbnails/54/2048-1152-max.png','8cf96bd4440bb65877746755cdc69662',55,'2048-1152-max.png',9,6,151132,1617710499,1617710499,0,0,'89ba7d97a1860cf84b0a60a3d1de0c35',27,'SHA1:12710a65a9917f8acbb7e62d9447c25d1b82957e MD5:2d21cf9688e3bacd98b59fd4f5ab6a3c ADLER32:dc7f51d8'),(57,3,'thumbnails/54/32-32.png','cef2e6bfc86f8b17a2fffd9b791a3b9b',55,'32-32.png',9,6,919,1617710499,1617710499,0,0,'f367b236e535cec7f9f9a09354a2c2ff',27,'SHA1:1e87b70d2ef535d2a3a0368f4a008cbb4947ff68 MD5:38ee30cd8fef9d7a5c42fef1dc5f5568 ADLER32:5f9d50c4'),(58,3,'files_trashbin/files/07_4k (2).jpg.d1617710536','e051a90b04a28a38cc8f5ffe0f8d09a5',40,'07_4k (2).jpg.d1617710536',8,3,9218000,1573380974,1573380974,0,0,'d6e4154ceabb9fd3692b5438761093a7',27,'SHA1:fbba508971a2a041d9763af4410a2d6de8b9a68b MD5:9f47d7c9045d9f5dfd1c95a85e1f37d4 ADLER32:b8b6f7ac'),(86,2,'admin','21232f297a57a5a743894a0e4a801fc3',11,'admin',2,1,-1,1617704490,1617704490,0,0,'60701c8d0c469',31,''),(87,2,'index.html','eacf331f0ffc35d4b482f1d15a887d3b',11,'index.html',15,12,0,1617676756,1617676756,0,0,'d6166a2d94576e067620b17c21025aa4',27,''),(88,2,'hoang','f82e62d7c3ea69cc12b5cdb8d621dab6',11,'hoang',2,1,-1,1617695317,1617695317,0,0,'60701c8d0e744',31,''),(89,2,'.ocdata','a840ac417b1f143f29a22c7261756dad',11,'.ocdata',8,3,0,1617676756,1617676756,0,0,'56b54b6d98d27c75204bad59c7051a13',27,''),(90,2,'htaccesstest.txt','7bccc20f7af3caba6981199fe6d83002',11,'htaccesstest.txt',13,12,145,1617958298,1617958298,0,0,'80b73c51154902ad9677414121597e58',27,''),(91,2,'owncloud.log','9703bd00121351aafcb85ff51784acc5',11,'owncloud.log',8,3,4648,1617959196,1617959196,0,0,'e6a813e06a585b9cb12f9bcfbbcb5e17',27,''),(92,2,'avatars/f8','3f8e373bbb58728ed04e00ef7ee7cfaf',12,'f8',2,1,-1,1618024189,1618024189,0,0,'60711a50db485',31,''),(93,1,'files/y2mate.com - Mangoo  Happi InstrumentalArcadeMusic Version.mp3','4772bc8cf5c3e3dea6f084ea13d30dbb',3,'y2mate.com - Mangoo  Happi InstrumentalArcadeMusic Version.mp3',17,16,2606530,1612251621,1612251621,0,0,'e7d17b21fca6cc17745ab9ae3e0630a1',27,'SHA1:8e0e415800e8ff85eaf3e04d75de67aa8244a0b1 MD5:10fca9efab21cbec29963892bad2f14c ADLER32:f1b87004'),(94,1,'files/linux.txt','7d08089a31d98827353f7862f5b2c6ad',3,'linux.txt',13,12,307,1617967886,1617967886,0,0,'1ddc7657d3f8414d7f94249630b3448c',27,'SHA1:5fe09ff6828446d34113d7c734785f2185e9c591 MD5:a19822d49580424f12601e3502a958d2 ADLER32:14946c5a'),(95,1,'thumbnails/94','35a42f1d5a5a51d9cb862f2373134a33',50,'94',2,1,54864,1618755999,1618755999,0,0,'607c419f445bf',31,''),(98,1,'files_versions','9692aae50022f45f1098646939b287b1',1,'files_versions',2,1,303,1617967886,1617967886,0,0,'60703b0ee7b44',31,''),(99,1,'files_versions/linux.txt.v1614135662','498423979fa76a36a76475faf750b916',98,'linux.txt.v1614135662',8,3,303,1617967886,1617967886,0,0,'ed915d343f2202319080ef9472b7e131',27,''),(100,1,'thumbnails/94/2048-2048-max.png','0fb48695896cb794abc96c16e50080f4',95,'2048-2048-max.png',9,6,48284,1617967888,1617967888,0,0,'e6716e6406b80bb29bdfb07800cab6d8',27,'SHA1:d81797becacefa75a03d28b979d2f7e818a9031d MD5:3fad82dbc9cb6f55ee42342a78ff5b94 ADLER32:656a1226'),(101,1,'thumbnails/94/32-32.png','c474aa331d50948cf71716a83375c8a8',95,'32-32.png',9,6,1669,1617967888,1617967888,0,0,'f78a653b0df75f5ee33435e6dc41af74',27,'SHA1:28c00d79036af56466b3a6a6b2bc3f7044d3d00f MD5:50d7ba047d9be3d617e519b3406b1e41 ADLER32:5aa0383e'),(103,1,'uploads','5128f35c9b4be13788ba41bdb6d1fc1f',1,'uploads',2,1,0,1617970451,1617970451,0,0,'607045137ae8e',31,''),(108,1,'files/ThucHanh5BT1.rar','1bd8e1ff56d8d7580522b546752d061c',3,'ThucHanh5BT1.rar',19,3,22323501,1617552411,1617552411,0,0,'1dec8acfd206057644b3a5a18d0b3a31',27,'SHA1:51620e30fde02fb7fdecd984f0263832a97b745b MD5:17cc57b9c6b137109f529615cbc6406f ADLER32:33669fb3'),(109,1,'thumbnails/94/75-75.png','410e1022c1e54df7e1bb3cb21d26c7b3',95,'75-75.png',9,6,4911,1618755999,1618755999,0,0,'078441f9a009db21e5783b827ec9be73',27,'SHA1:26887008feeb13095f092bc8d1e32495153a9902 MD5:8780cb39c1ae355d7d0d13c0ecf1a9b9 ADLER32:fe3e5705');
/*!40000 ALTER TABLE `oc_filecache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_files_trash`
--

DROP TABLE IF EXISTS `oc_files_trash`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_files_trash` (
  `auto_id` bigint NOT NULL AUTO_INCREMENT,
  `id` varchar(250) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `user` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `timestamp` varchar(12) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `location` varchar(512) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `type` varchar(4) COLLATE utf8mb4_bin DEFAULT NULL,
  `mime` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`auto_id`),
  KEY `id_index` (`id`),
  KEY `timestamp_index` (`timestamp`),
  KEY `user_index` (`user`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_files_trash`
--

LOCK TABLES `oc_files_trash` WRITE;
/*!40000 ALTER TABLE `oc_files_trash` DISABLE KEYS */;
INSERT INTO `oc_files_trash` VALUES (1,'Teotihuacan.jpg','hoang','1617695317','Photos',NULL,NULL),(2,'Portugal.jpg','hoang','1617695317','Photos',NULL,NULL),(3,'07_4k (2).jpg','hoang','1617710536','.',NULL,NULL);
/*!40000 ALTER TABLE `oc_files_trash` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_group_admin`
--

DROP TABLE IF EXISTS `oc_group_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_group_admin` (
  `gid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `uid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`,`uid`),
  KEY `group_admin_uid` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_group_admin`
--

LOCK TABLES `oc_group_admin` WRITE;
/*!40000 ALTER TABLE `oc_group_admin` DISABLE KEYS */;
INSERT INTO `oc_group_admin` VALUES ('guest_app','testGuest');
/*!40000 ALTER TABLE `oc_group_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_group_user`
--

DROP TABLE IF EXISTS `oc_group_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_group_user` (
  `gid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `uid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`,`uid`),
  KEY `gu_uid_index` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_group_user`
--

LOCK TABLES `oc_group_user` WRITE;
/*!40000 ALTER TABLE `oc_group_user` DISABLE KEYS */;
INSERT INTO `oc_group_user` VALUES ('admin','admin'),('members','hoang'),('members','hung'),('members','member');
/*!40000 ALTER TABLE `oc_group_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_groups`
--

DROP TABLE IF EXISTS `oc_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_groups` (
  `gid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_groups`
--

LOCK TABLES `oc_groups` WRITE;
/*!40000 ALTER TABLE `oc_groups` DISABLE KEYS */;
INSERT INTO `oc_groups` VALUES ('admin'),('members');
/*!40000 ALTER TABLE `oc_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_jobs`
--

DROP TABLE IF EXISTS `oc_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_jobs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `class` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `argument` varchar(4000) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `last_run` int DEFAULT '0',
  `last_checked` int DEFAULT '0',
  `reserved_at` int DEFAULT '0',
  `execution_duration` int NOT NULL DEFAULT '-1',
  PRIMARY KEY (`id`),
  KEY `job_class_index` (`class`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_jobs`
--

LOCK TABLES `oc_jobs` WRITE;
/*!40000 ALTER TABLE `oc_jobs` DISABLE KEYS */;
INSERT INTO `oc_jobs` VALUES (1,'OCA\\Files\\BackgroundJob\\ScanFiles','null',1617976700,1617976700,0,0),(2,'OCA\\Files\\BackgroundJob\\DeleteOrphanedItems','null',1618025029,1618025029,0,0),(3,'OCA\\Files\\BackgroundJob\\CleanupFileLocks','null',1618025050,1618025050,0,0),(4,'OCA\\Files\\BackgroundJob\\CleanupPersistentFileLocks','null',1618025060,1618025060,0,0),(5,'OCA\\DAV\\CardDAV\\SyncJob','null',1617958256,1618025067,0,0),(6,'OCA\\DAV\\BackgroundJob\\CleanProperties','null',1617958268,1618025070,0,0),(7,'OCA\\Federation\\SyncJob','null',1617958323,1618025078,0,0),(8,'OCA\\Files_Sharing\\DeleteOrphanedSharesJob','null',1618025114,1618025114,0,0),(9,'OCA\\Files_Sharing\\ExpireSharesJob','null',1617958365,1617970109,0,0),(10,'OCA\\Files_Sharing\\External\\ScanExternalSharesJob','null',1617970362,1617970362,0,0),(11,'OCA\\Files_Trashbin\\BackgroundJob\\ExpireTrash','null',1617970379,1617970379,0,0),(12,'OCA\\Files_Versions\\BackgroundJob\\ExpireVersions','null',1617971393,1617971392,0,0),(13,'OCA\\Market\\CheckUpdateBackgroundJob','null',1617958464,1617971437,0,2),(14,'OCA\\UpdateNotification\\Notification\\BackgroundJob','null',1617957823,1617976691,0,1),(15,'\\OC\\Authentication\\Token\\DefaultTokenCleanupJob','null',1617976545,1617976545,0,0),(21,'OC\\BackgroundJob\\Legacy\\RegularJob','[\"OCA\\\\Music\\\\Backgroundjob\\\\Cleanup\",\"run\"]',0,1617970324,0,-1);
/*!40000 ALTER TABLE `oc_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_migrations`
--

DROP TABLE IF EXISTS `oc_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_migrations` (
  `app` varchar(177) COLLATE utf8mb4_bin NOT NULL,
  `version` varchar(14) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`app`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_migrations`
--

LOCK TABLES `oc_migrations` WRITE;
/*!40000 ALTER TABLE `oc_migrations` DISABLE KEYS */;
INSERT INTO `oc_migrations` VALUES ('core','20170101010100'),('core','20170101215145'),('core','20170111103310'),('core','20170213215145'),('core','20170214112458'),('core','20170221114437'),('core','20170221121536'),('core','20170315173825'),('core','20170320173955'),('core','20170418154659'),('core','20170516100103'),('core','20170526104128'),('core','20170605143658'),('core','20170711191432'),('core','20170804201253'),('core','20170928120000'),('core','20171026130750'),('core','20180123131835'),('core','20180302155233'),('core','20180319102121'),('core','20180607072706'),('core','20181017105216'),('core','20181017120818'),('core','20181113071753'),('core','20181220085457'),('core','20190125162909'),('core','20200610110817'),('customgroups','20161209151129'),('dav','20170116150538'),('dav','20170116170538'),('dav','20170202213905'),('dav','20170202220512'),('dav','20170427182800'),('dav','20170519091921'),('dav','20170526100342'),('dav','20170711193427'),('dav','20170927201245'),('dav','20180622095921'),('dav','20181115210344'),('dav','20190823065724'),('dav','20200114181454'),('dav','20200427142541'),('federatedfilesharing','20170804201125'),('federatedfilesharing','20170804201253'),('federatedfilesharing','20190410160725'),('files_external','20170814051424'),('files_sharing','20170804201125'),('files_sharing','20170804201253'),('files_sharing','20170830112305'),('files_sharing','20171115154900'),('files_sharing','20171215103657'),('files_sharing','20190426123324'),('files_sharing','20200504211654'),('files_sharing','20200823121322'),('files_trashbin','20170804201125'),('files_trashbin','20170804201253'),('notifications','20170801085340'),('notifications','20170801152524'),('notifications','20180119080933'),('notifications','20180604132522');
/*!40000 ALTER TABLE `oc_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_mimetypes`
--

DROP TABLE IF EXISTS `oc_mimetypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_mimetypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mimetype` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mimetype_id_index` (`mimetype`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_mimetypes`
--

LOCK TABLES `oc_mimetypes` WRITE;
/*!40000 ALTER TABLE `oc_mimetypes` DISABLE KEYS */;
INSERT INTO `oc_mimetypes` VALUES (3,'application'),(18,'application/json'),(8,'application/octet-stream'),(5,'application/pdf'),(4,'application/vnd.oasis.opendocument.text'),(14,'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),(19,'application/x-rar-compressed'),(16,'audio'),(17,'audio/mpeg'),(1,'httpd'),(2,'httpd/unix-directory'),(6,'image'),(7,'image/jpeg'),(9,'image/png'),(12,'text'),(15,'text/html'),(13,'text/plain');
/*!40000 ALTER TABLE `oc_mimetypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_mounts`
--

DROP TABLE IF EXISTS `oc_mounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_mounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `storage_id` int NOT NULL,
  `root_id` bigint NOT NULL,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `mount_point` varchar(4000) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mounts_user_root_index` (`user_id`,`root_id`),
  KEY `mounts_user_index` (`user_id`),
  KEY `mounts_storage_index` (`storage_id`),
  KEY `mounts_root_index` (`root_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_mounts`
--

LOCK TABLES `oc_mounts` WRITE;
/*!40000 ALTER TABLE `oc_mounts` DISABLE KEYS */;
INSERT INTO `oc_mounts` VALUES (1,1,1,'admin','/admin/'),(2,3,14,'hoang','/hoang/'),(3,3,17,'admin','/admin/files/Documents (2)/'),(4,3,17,'hung','/hung/files/Documents (2)/'),(6,3,19,'admin','/admin/files/ownCloud Manual (2).pdf/'),(7,3,49,'hung','/hung/files/new/'),(10,3,49,'member','/member/files/new/'),(11,1,4,'hung','/hung/files/Documents/');
/*!40000 ALTER TABLE `oc_mounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_albums`
--

DROP TABLE IF EXISTS `oc_music_albums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_albums` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `cover_file_id` bigint DEFAULT NULL,
  `mbid` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL,
  `disk` int unsigned DEFAULT NULL COMMENT 'deprecated',
  `mbid_group` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL,
  `album_artist_id` int DEFAULT NULL,
  `hash` varchar(32) COLLATE utf8mb4_bin NOT NULL COMMENT 'Unique hash formed from the fields composing the identity of the album',
  `starred` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ma_user_id_hash_idx` (`user_id`,`hash`),
  KEY `ma_cover_file_id_idx` (`cover_file_id`),
  KEY `ma_album_artist_id_idx` (`album_artist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_albums`
--

LOCK TABLES `oc_music_albums` WRITE;
/*!40000 ALTER TABLE `oc_music_albums` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_albums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_ampache_sessions`
--

DROP TABLE IF EXISTS `oc_music_ampache_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_ampache_sessions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `expiry` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `music_ampache_sessions_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_ampache_sessions`
--

LOCK TABLES `oc_music_ampache_sessions` WRITE;
/*!40000 ALTER TABLE `oc_music_ampache_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_ampache_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_ampache_users`
--

DROP TABLE IF EXISTS `oc_music_ampache_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_ampache_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `description` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `hash` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `music_ampache_users_index` (`hash`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_ampache_users`
--

LOCK TABLES `oc_music_ampache_users` WRITE;
/*!40000 ALTER TABLE `oc_music_ampache_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_ampache_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_artists`
--

DROP TABLE IF EXISTS `oc_music_artists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_artists` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `cover_file_id` bigint DEFAULT NULL,
  `mbid` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL,
  `hash` varchar(32) COLLATE utf8mb4_bin NOT NULL COMMENT 'Unique hash formed from the artist name. The name field as such is too long to be indexed.',
  `starred` datetime DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_hash_idx` (`user_id`,`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_artists`
--

LOCK TABLES `oc_music_artists` WRITE;
/*!40000 ALTER TABLE `oc_music_artists` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_artists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_bookmarks`
--

DROP TABLE IF EXISTS `oc_music_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_bookmarks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `track_id` int NOT NULL,
  `position` int NOT NULL,
  `comment` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `music_bookmarks_user_track` (`user_id`,`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_bookmarks`
--

LOCK TABLES `oc_music_bookmarks` WRITE;
/*!40000 ALTER TABLE `oc_music_bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_cache`
--

DROP TABLE IF EXISTS `oc_music_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_cache` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `data` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  UNIQUE KEY `music_cache_index` (`user_id`,`key`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_cache`
--

LOCK TABLES `oc_music_cache` WRITE;
/*!40000 ALTER TABLE `oc_music_cache` DISABLE KEYS */;
INSERT INTO `oc_music_cache` VALUES (1,'collection','admin','d751713988987e9331980363e24189ce'),(2,'cover_access_token','admin','d4b1b37c63f976c056ed0f8ee078a62ebf69100513ac20f05affa252ad68719c');
/*!40000 ALTER TABLE `oc_music_cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_genres`
--

DROP TABLE IF EXISTS `oc_music_genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_genres` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `lower_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Used to enforce uniquenes of genres in case insensitive sense',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `mg_lower_name_user_id_idx` (`lower_name`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_genres`
--

LOCK TABLES `oc_music_genres` WRITE;
/*!40000 ALTER TABLE `oc_music_genres` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_playlists`
--

DROP TABLE IF EXISTS `oc_music_playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_playlists` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `track_ids` longtext COLLATE utf8mb4_bin COMMENT '|-delimited list of track IDs',
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `comment` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_playlists`
--

LOCK TABLES `oc_music_playlists` WRITE;
/*!40000 ALTER TABLE `oc_music_playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_radio_stations`
--

DROP TABLE IF EXISTS `oc_music_radio_stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_radio_stations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL,
  `stream_url` varchar(2048) COLLATE utf8mb4_bin NOT NULL,
  `home_url` varchar(2048) COLLATE utf8mb4_bin DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_radio_stations`
--

LOCK TABLES `oc_music_radio_stations` WRITE;
/*!40000 ALTER TABLE `oc_music_radio_stations` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_radio_stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_music_tracks`
--

DROP TABLE IF EXISTS `oc_music_tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_music_tracks` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `title` varchar(256) COLLATE utf8mb4_bin NOT NULL,
  `number` int unsigned DEFAULT NULL,
  `disk` int unsigned DEFAULT NULL,
  `year` int unsigned DEFAULT NULL,
  `artist_id` int DEFAULT NULL,
  `album_id` int DEFAULT NULL,
  `length` int unsigned DEFAULT NULL,
  `file_id` bigint NOT NULL,
  `bitrate` int unsigned DEFAULT NULL,
  `mimetype` varchar(256) COLLATE utf8mb4_bin NOT NULL,
  `mbid` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL,
  `starred` datetime DEFAULT NULL,
  `genre_id` int unsigned DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `music_tracks_file_user_id_idx` (`file_id`,`user_id`),
  KEY `music_tracks_artist_id_idx` (`artist_id`),
  KEY `music_tracks_album_id_idx` (`album_id`),
  KEY `music_tracks_user_id_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_music_tracks`
--

LOCK TABLES `oc_music_tracks` WRITE;
/*!40000 ALTER TABLE `oc_music_tracks` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_music_tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_notifications`
--

DROP TABLE IF EXISTS `oc_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `app` varchar(32) COLLATE utf8mb4_bin NOT NULL,
  `user` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `timestamp` int NOT NULL DEFAULT '0',
  `object_type` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `object_id` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `subject` varchar(64) COLLATE utf8mb4_bin NOT NULL,
  `subject_parameters` longtext COLLATE utf8mb4_bin,
  `message` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `message_parameters` longtext COLLATE utf8mb4_bin,
  `link` varchar(4000) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `actions` longtext COLLATE utf8mb4_bin,
  `icon` varchar(4000) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`notification_id`),
  KEY `IDX_16B80748C96E70CF` (`app`),
  KEY `IDX_16B807488D93D649` (`user`),
  KEY `IDX_16B80748A5D6E63E` (`timestamp`),
  KEY `IDX_16B8074811CB6B3A232D562B` (`object_type`,`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_notifications`
--

LOCK TABLES `oc_notifications` WRITE;
/*!40000 ALTER TABLE `oc_notifications` DISABLE KEYS */;
INSERT INTO `oc_notifications` VALUES (1,'market','admin',1617683578,'files_mediaviewer','1.0.4','update_available','[]','','[]','http://35.247.130.112/owncloud/index.php/apps/market/#/app/files_mediaviewer','[]',''),(3,'customgroups','hung',1617959113,'customgroup','1','added_member','[\"admin\",\"custom group\"]','added_member','[\"admin\",\"custom group\"]','http://35.247.130.112/owncloud/index.php/settings/personal?sectionid=customgroups&group=custom%20group','[]',''),(4,'customgroups','hung',1617959115,'customgroup','1','changed_member_role','[\"admin\",\"custom group\",1]','changed_member_role','[\"admin\",\"custom group\",1]','http://35.247.130.112/owncloud/index.php/settings/personal?sectionid=customgroups&group=custom%20group','[]',''),(5,'customgroups','hung',1617959116,'customgroup','1','changed_member_role','[\"admin\",\"custom group\",0]','changed_member_role','[\"admin\",\"custom group\",0]','http://35.247.130.112/owncloud/index.php/settings/personal?sectionid=customgroups&group=custom%20group','[]','');
/*!40000 ALTER TABLE `oc_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_persistent_locks`
--

DROP TABLE IF EXISTS `oc_persistent_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_persistent_locks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `file_id` bigint NOT NULL COMMENT 'FK to fileid in table oc_file_cache',
  `owner_account_id` bigint unsigned DEFAULT NULL COMMENT 'owner of the lock - FK to account table',
  `owner` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'owner of the lock - just a human readable string',
  `timeout` int unsigned NOT NULL COMMENT 'timestamp when the lock expires',
  `created_at` int unsigned NOT NULL COMMENT 'timestamp when the lock was created',
  `token` varchar(1024) COLLATE utf8mb4_bin NOT NULL COMMENT 'uuid for webdav locks - 1024 random chars for WOPI locks',
  `token_hash` varchar(32) COLLATE utf8mb4_bin NOT NULL COMMENT 'md5(token)',
  `scope` smallint NOT NULL COMMENT '1 - exclusive, 2 - shared',
  `depth` smallint NOT NULL COMMENT '0, 1 or infinite',
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_F0C3D55BB3BC57DA` (`token_hash`),
  KEY `IDX_F0C3D55B93CB796C` (`file_id`),
  KEY `IDX_F0C3D55BC901C6FF` (`owner_account_id`),
  CONSTRAINT `FK_F0C3D55B93CB796C` FOREIGN KEY (`file_id`) REFERENCES `oc_filecache` (`fileid`) ON DELETE CASCADE,
  CONSTRAINT `FK_F0C3D55BC901C6FF` FOREIGN KEY (`owner_account_id`) REFERENCES `oc_accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_persistent_locks`
--

LOCK TABLES `oc_persistent_locks` WRITE;
/*!40000 ALTER TABLE `oc_persistent_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_persistent_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_preferences`
--

DROP TABLE IF EXISTS `oc_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_preferences` (
  `userid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `appid` varchar(32) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `configkey` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `configvalue` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`userid`,`appid`,`configkey`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_preferences`
--

LOCK TABLES `oc_preferences` WRITE;
/*!40000 ALTER TABLE `oc_preferences` DISABLE KEYS */;
INSERT INTO `oc_preferences` VALUES ('admin','core','lang','vi'),('admin','core','timezone','Asia/Jakarta'),('admin','firstrunwizard','show','0'),('hoang','core','lang','vi'),('hoang','core','timezone','Asia/Jakarta'),('hoang','files','file_sorting','name'),('hoang','files','file_sorting_direction','desc'),('hoang','files','show_hidden','1'),('hoang','firstrunwizard','show','0'),('hung','owncloud','lostpassword','1617696417:149841313573439305283'),('member','owncloud','lostpassword','1617843548:467660644750184407815'),('testGuest','owncloud','lostpassword','1617960494:468986705347496312073');
/*!40000 ALTER TABLE `oc_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_privatedata`
--

DROP TABLE IF EXISTS `oc_privatedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_privatedata` (
  `keyid` int unsigned NOT NULL AUTO_INCREMENT,
  `user` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `app` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `key` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `value` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`keyid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_privatedata`
--

LOCK TABLES `oc_privatedata` WRITE;
/*!40000 ALTER TABLE `oc_privatedata` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_privatedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_properties`
--

DROP TABLE IF EXISTS `oc_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_properties` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fileid` bigint unsigned NOT NULL,
  `propertyname` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `propertyvalue` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `propertytype` smallint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `fileid_index` (`fileid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_properties`
--

LOCK TABLES `oc_properties` WRITE;
/*!40000 ALTER TABLE `oc_properties` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_schedulingobjects`
--

DROP TABLE IF EXISTS `oc_schedulingobjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_schedulingobjects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `principaluri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `calendardata` longblob,
  `uri` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `lastmodified` int unsigned DEFAULT NULL,
  `etag` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `size` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_schedulingobjects`
--

LOCK TABLES `oc_schedulingobjects` WRITE;
/*!40000 ALTER TABLE `oc_schedulingobjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_schedulingobjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_share`
--

DROP TABLE IF EXISTS `oc_share`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_share` (
  `id` int NOT NULL AUTO_INCREMENT,
  `share_type` smallint NOT NULL DEFAULT '0',
  `share_with` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `uid_owner` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `uid_initiator` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `parent` int DEFAULT NULL,
  `item_type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `item_source` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `item_target` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `file_source` bigint DEFAULT NULL,
  `file_target` varchar(512) COLLATE utf8mb4_bin DEFAULT NULL,
  `permissions` smallint NOT NULL DEFAULT '0',
  `stime` bigint NOT NULL DEFAULT '0',
  `accepted` smallint NOT NULL DEFAULT '0',
  `expiration` datetime DEFAULT NULL,
  `token` varchar(32) COLLATE utf8mb4_bin DEFAULT NULL,
  `mail_send` smallint NOT NULL DEFAULT '0',
  `share_name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `attributes` longtext COLLATE utf8mb4_bin,
  PRIMARY KEY (`id`),
  KEY `item_share_type_index` (`item_type`,`share_type`),
  KEY `file_source_index` (`file_source`),
  KEY `token_index` (`token`),
  KEY `share_with_index` (`share_with`),
  KEY `item_source_index` (`item_source`),
  KEY `item_source_type_index` (`item_source`,`share_type`,`item_type`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_share`
--

LOCK TABLES `oc_share` WRITE;
/*!40000 ALTER TABLE `oc_share` DISABLE KEYS */;
INSERT INTO `oc_share` VALUES (1,0,'admin','hoang','hoang',NULL,'folder','17',NULL,17,'/Photos/Documents (2)',31,1617696290,0,NULL,NULL,0,NULL,NULL),(2,0,'hung','hoang','admin',NULL,'folder','17',NULL,17,'/Documents (2)',31,1617696436,0,NULL,NULL,0,NULL,NULL),(4,3,NULL,'hoang','hoang',NULL,'folder','17',NULL,17,'/Documents',1,1617700982,0,NULL,'8Ode0cIcMmiXxR5',0,'Liên kết công khai',NULL),(5,3,NULL,'hoang','hoang',NULL,'folder','17',NULL,17,'/Documents',1,1617701024,0,NULL,'2wfYZr8Kff0j9j2',0,'hello',NULL),(9,0,'admin','hoang','hoang',NULL,'file','19',NULL,19,'/ownCloud Manual (2).pdf',19,1617703635,0,NULL,NULL,0,NULL,NULL),(10,0,'hung','hoang','hoang',NULL,'folder','49',NULL,49,'/new',31,1617704091,0,NULL,NULL,0,NULL,NULL),(11,1,'members','hoang','hoang',NULL,'folder','49',NULL,49,'/new',31,1617704098,0,NULL,NULL,0,NULL,NULL),(12,3,NULL,'hoang','hoang',NULL,'folder','20',NULL,20,'/Photos',4,1617705426,0,NULL,'SeBFVsbBEVTP5uj',0,'Liên kết công khai',NULL),(13,1,'customgroup_custom group','admin','admin',NULL,'folder','4',NULL,4,'/Documents',31,1617959172,0,NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `oc_share` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_share_external`
--

DROP TABLE IF EXISTS `oc_share_external`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_share_external` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `remote` varchar(512) COLLATE utf8mb4_bin NOT NULL COMMENT 'Url of the remote owncloud instance',
  `remote_id` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '-1',
  `share_token` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'Public share token',
  `password` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Optional password for the public share',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'Original name on the remote server',
  `owner` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'User that owns the public share on the remote server',
  `user` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'Local user which added the external share',
  `mountpoint` varchar(4000) COLLATE utf8mb4_bin NOT NULL COMMENT 'Full path where the share is mounted',
  `mountpoint_hash` varchar(32) COLLATE utf8mb4_bin NOT NULL COMMENT 'md5 hash of the mountpoint',
  `accepted` int NOT NULL DEFAULT '0',
  `lastscan` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sh_external_mp` (`user`,`mountpoint_hash`),
  KEY `sh_external_user` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_share_external`
--

LOCK TABLES `oc_share_external` WRITE;
/*!40000 ALTER TABLE `oc_share_external` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_share_external` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_storages`
--

DROP TABLE IF EXISTS `oc_storages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_storages` (
  `id` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `numeric_id` int NOT NULL AUTO_INCREMENT,
  `available` int NOT NULL DEFAULT '1',
  `last_checked` int DEFAULT NULL,
  PRIMARY KEY (`numeric_id`),
  UNIQUE KEY `storages_id_index` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_storages`
--

LOCK TABLES `oc_storages` WRITE;
/*!40000 ALTER TABLE `oc_storages` DISABLE KEYS */;
INSERT INTO `oc_storages` VALUES ('home::admin',1,1,NULL),('local::/var/www/html/owncloud/data/',2,1,NULL),('home::hoang',3,1,NULL),('home::hung',4,1,NULL),('home::member',6,1,NULL),('home::testGuest',7,1,NULL);
/*!40000 ALTER TABLE `oc_storages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_systemtag`
--

DROP TABLE IF EXISTS `oc_systemtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_systemtag` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `visibility` smallint NOT NULL DEFAULT '1',
  `editable` smallint NOT NULL DEFAULT '1',
  `assignable` smallint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_ident` (`name`,`visibility`,`editable`,`assignable`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_systemtag`
--

LOCK TABLES `oc_systemtag` WRITE;
/*!40000 ALTER TABLE `oc_systemtag` DISABLE KEYS */;
INSERT INTO `oc_systemtag` VALUES (2,'image',1,1,1);
/*!40000 ALTER TABLE `oc_systemtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_systemtag_group`
--

DROP TABLE IF EXISTS `oc_systemtag_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_systemtag_group` (
  `systemtagid` int unsigned NOT NULL DEFAULT '0',
  `gid` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`gid`,`systemtagid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_systemtag_group`
--

LOCK TABLES `oc_systemtag_group` WRITE;
/*!40000 ALTER TABLE `oc_systemtag_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_systemtag_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_systemtag_object_mapping`
--

DROP TABLE IF EXISTS `oc_systemtag_object_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_systemtag_object_mapping` (
  `objectid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `objecttype` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `systemtagid` int unsigned NOT NULL DEFAULT '0',
  UNIQUE KEY `mapping` (`objecttype`,`objectid`,`systemtagid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_systemtag_object_mapping`
--

LOCK TABLES `oc_systemtag_object_mapping` WRITE;
/*!40000 ALTER TABLE `oc_systemtag_object_mapping` DISABLE KEYS */;
INSERT INTO `oc_systemtag_object_mapping` VALUES ('19','files',2),('20','files',2);
/*!40000 ALTER TABLE `oc_systemtag_object_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_trusted_servers`
--

DROP TABLE IF EXISTS `oc_trusted_servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_trusted_servers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(512) COLLATE utf8mb4_bin NOT NULL COMMENT 'Url of trusted server',
  `url_hash` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '' COMMENT 'sha1 hash of the url without the protocol',
  `token` varchar(128) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'token used to exchange the shared secret',
  `shared_secret` varchar(256) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'shared secret used to authenticate',
  `status` int NOT NULL DEFAULT '2' COMMENT 'current status of the connection',
  `sync_token` varchar(512) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'cardDav sync token',
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_hash` (`url_hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_trusted_servers`
--

LOCK TABLES `oc_trusted_servers` WRITE;
/*!40000 ALTER TABLE `oc_trusted_servers` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_trusted_servers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_users`
--

DROP TABLE IF EXISTS `oc_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_users` (
  `uid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `displayname` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_users`
--

LOCK TABLES `oc_users` WRITE;
/*!40000 ALTER TABLE `oc_users` DISABLE KEYS */;
INSERT INTO `oc_users` VALUES ('admin',NULL,'1|$2y$10$PVVTdvnwNA81zKlBoaMT6eQXNNWGS4wRbZFyyye2jy6.5LborJqkq'),('hoang','hoang','1|$2y$10$tnACcqTr5lDhiuqamgbdquCK0E/tTCA17dIJ8yCqwKmroRXlJJyg.'),('hung',NULL,'1|$2y$10$i4sPcOMqfTE2k7ALACnoju.QL/ABnZ6TouRuLXMK3OTKa9qWHGB3C'),('member',NULL,'1|$2y$10$vEubvJo23rJh5izKN1t2xuKDXuYmS3ytFYe/z3rukSD50eFtgG/xO'),('test',NULL,'1|$2y$10$TkG3s8JpFC00u8fomqjKJO4qP7p0Ekzh1MvPzT5aqKVndB/mKG17O'),('testGuest',NULL,'1|$2y$10$hBeqNCEH7nI4FqQKnMj23ujnTWWbY/001.eVY/mrARJ1jnIb2u49O');
/*!40000 ALTER TABLE `oc_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_vcategory`
--

DROP TABLE IF EXISTS `oc_vcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_vcategory` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `category` varchar(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `uid_index` (`uid`),
  KEY `type_index` (`type`),
  KEY `category_index` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_vcategory`
--

LOCK TABLES `oc_vcategory` WRITE;
/*!40000 ALTER TABLE `oc_vcategory` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_vcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oc_vcategory_to_object`
--

DROP TABLE IF EXISTS `oc_vcategory_to_object`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oc_vcategory_to_object` (
  `objid` bigint unsigned NOT NULL DEFAULT '0',
  `categoryid` int unsigned NOT NULL DEFAULT '0',
  `type` varchar(64) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  PRIMARY KEY (`categoryid`,`objid`,`type`),
  KEY `vcategory_objectd_index` (`objid`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=COMPRESSED;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oc_vcategory_to_object`
--

LOCK TABLES `oc_vcategory_to_object` WRITE;
/*!40000 ALTER TABLE `oc_vcategory_to_object` DISABLE KEYS */;
/*!40000 ALTER TABLE `oc_vcategory_to_object` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-24  2:33:01
