-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: collabspace
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

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
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `title` varchar(200) NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('Pending','Submitted','Graded') DEFAULT 'Pending',
  `grade` varchar(5) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
INSERT INTO `assignments` VALUES (1,1,1,'ER Diagram Assignment','2026-04-05','Pending',NULL,'2026-04-02 12:51:00'),(2,1,1,'SQL Queries Lab','2026-04-08','Pending',NULL,'2026-04-02 12:51:00'),(3,1,2,'Linear Regression Model','2026-04-10','Submitted',NULL,'2026-04-02 12:51:00'),(4,1,3,'React Portfolio','2026-04-15','Pending',NULL,'2026-04-02 12:51:00'),(5,1,4,'Process Scheduling','2026-04-03','Graded',NULL,'2026-04-02 12:51:00'),(6,2,1,'er','2026-04-03','Submitted',NULL,'2026-04-02 12:56:01'),(7,2,1,'diag','2026-04-04','Pending',NULL,'2026-04-02 12:59:32');
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,15,2,'hiii this swami','2026-04-21 15:23:20'),(2,14,2,'more to add','2026-04-21 15:23:53'),(3,11,2,'gdfg','2026-04-22 13:54:47'),(4,13,2,'gyh','2026-04-22 14:10:29'),(5,10,2,'fd','2026-04-22 14:22:03'),(6,13,2,'hfgh','2026-04-22 14:49:50');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'farhana','farhanabhatt@gmail','hii atharva',0,'2026-04-22 09:51:18'),(2,'RIYA','riya@gmail.com','hii there',0,'2026-04-22 10:06:37'),(3,'sdfg','fsdgfg','fgg',0,'2026-04-22 13:54:11'),(4,'grg','tgtery','trgtrey',0,'2026-04-22 14:22:47'),(5,'df','fsdf','fsdf',0,'2026-04-22 14:33:36'),(6,'dsfdsf','fdsfsdf','dsfsdfsdf',0,'2026-04-22 14:49:00');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `professor` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `semester` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'CS301','Database Systems','Prof. Sharma','Computer Science','Sem 5','2026-04-02 12:51:00'),(2,'CS402','Machine Learning','Prof. Patel','Computer Science','Sem 5','2026-04-02 12:51:00'),(3,'CS305','Web Development','Prof. Kumar','Computer Science','Sem 5','2026-04-02 12:51:00'),(4,'CS401','Operating Systems','Prof. Singh','Computer Science','Sem 5','2026-04-02 12:51:00');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,2,1,'hii',0,'2026-04-22 13:47:06'),(2,2,3,'hii',0,'2026-04-22 13:47:16'),(3,2,1,'hello',0,'2026-04-22 14:06:03'),(4,2,1,'yo',0,'2026-04-22 14:13:03'),(5,2,3,'ji',0,'2026-04-22 14:13:27'),(6,2,1,'hiiiiiiiii',0,'2026-04-22 14:23:40');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'test','🔔 Test','This is a test notification',1,'2026-03-25 13:59:56'),(2,2,'test','New Notification','Someone joined your project',1,'2026-03-25 14:06:40'),(3,2,'join','👥 New member!','John Doe joined your project: science',1,'2026-03-25 14:09:22'),(4,2,'join','👥 New member!','John Doe joined your project: OOP',1,'2026-03-25 14:09:34'),(5,2,'join','👥 New member!','John Doe joined your project: sfg',1,'2026-03-25 14:40:22'),(6,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-02 12:48:37'),(7,2,'join','👥 New member!','atharva pardeshi joined your project: science',1,'2026-04-02 13:08:13'),(8,2,'join','👥 New member!','John Doe joined your project: sfg',1,'2026-04-02 13:12:38'),(9,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-02 13:13:06'),(10,1,'join','👥 New member!','John Doe joined your project: Web Dev Portfolio',0,'2026-04-15 15:29:31'),(11,1,'join','👥 New member!','John Doe joined your project: Web Dev Portfolio',0,'2026-04-15 15:29:34'),(12,1,'join','👥 New member!','John Doe joined your project: Web Dev Portfolio',0,'2026-04-15 15:32:11'),(13,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-15 15:33:34'),(14,2,'join','👥 New member!','John Doe joined your project: sfg',1,'2026-04-15 15:33:45'),(15,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-15 15:36:21'),(16,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-15 15:36:50'),(17,1,'join','👥 New member!','John Doe joined your project: Web Dev Portfolio',0,'2026-04-15 15:37:18'),(18,2,'join','👥 New member!','John Doe joined your project: sfg',1,'2026-04-15 15:37:22'),(19,2,'join','👥 New member!','John Doe joined your project: sfg',0,'2026-04-15 15:37:34'),(20,1,'join','👥 New member!','John Doe joined your project: Data Science Project',0,'2026-04-15 15:37:41'),(21,2,'join','👥 New member!','John Doe joined your project: ai',0,'2026-04-15 15:37:45'),(22,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-15 15:38:40'),(23,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-21 14:48:16'),(24,1,'join','👥 New member!','John Doe joined your project: Web Dev Portfolio',0,'2026-04-21 14:48:28'),(25,2,'join','👥 New member!','John Doe joined your project: sfg',0,'2026-04-21 14:48:30'),(26,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-21 14:48:48'),(27,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-21 14:49:00'),(28,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-21 15:02:59'),(29,2,'join','👥 New member!','John Doe joined your project: zcsfd',0,'2026-04-21 15:03:03'),(30,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-21 15:03:05'),(31,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-21 15:07:04'),(32,2,'join','👥 New member!','John Doe joined your project: zcsfd',0,'2026-04-21 15:07:07'),(33,1,'join','👥 New member!','John Doe joined your project: Data Science Project',0,'2026-04-21 15:07:09'),(34,2,'join','👥 New member!','John Doe joined your project: ai',0,'2026-04-21 15:07:12'),(35,2,'join','👥 New member!','John Doe joined your project: science',0,'2026-04-21 15:07:15'),(36,2,'join','👥 New member!','John Doe joined your project: OOP',0,'2026-04-21 15:07:17'),(37,2,'join','👥 New member!','John Doe joined your project: science',0,'2026-04-21 15:14:45'),(38,2,'join','👥 New member!','John Doe joined your project: science',0,'2026-04-21 15:14:56'),(39,2,'join','👥 New member!','John Doe joined your project: science',0,'2026-04-21 15:15:08'),(40,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-21 15:54:58'),(41,2,'join','👥 New member!','John Doe joined your project: zcsfd',0,'2026-04-21 15:55:03'),(42,1,'join','👥 New member!','John Doe joined your project: AI Study Assistant',0,'2026-04-21 15:55:05'),(43,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 09:59:41'),(44,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 10:03:40'),(45,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 13:32:30'),(46,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 13:54:40'),(47,1,'message','New Message','John sent you a message',0,'2026-04-22 14:06:03'),(48,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 14:10:13'),(49,1,'message','New Message','John sent you a message',0,'2026-04-22 14:13:03'),(50,3,'message','New Message','John sent you a message',0,'2026-04-22 14:13:27'),(51,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 14:21:58'),(52,1,'message','New Message','John sent you a message',0,'2026-04-22 14:23:40'),(53,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 14:34:19'),(54,2,'join','👥 New member!','John Doe joined your project: ytjuti',0,'2026-04-22 14:49:44');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_members`
--

DROP TABLE IF EXISTS `project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('owner','member') DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_project_member` (`project_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_members`
--

LOCK TABLES `project_members` WRITE;
/*!40000 ALTER TABLE `project_members` DISABLE KEYS */;
INSERT INTO `project_members` VALUES (1,1,2,'owner','2026-03-14 12:07:13'),(2,2,2,'owner','2026-03-14 12:08:20'),(5,3,2,'owner','2026-03-14 12:22:43'),(7,4,2,'owner','2026-03-16 12:45:06'),(12,5,2,'owner','2026-03-25 12:38:59'),(13,6,2,'owner','2026-03-25 12:39:11'),(14,7,2,'owner','2026-03-25 12:39:20'),(17,8,2,'owner','2026-03-25 12:59:52'),(18,9,2,'owner','2026-03-25 13:35:14'),(29,10,2,'owner','2026-04-02 12:42:05'),(30,1,1,'owner','2026-04-02 12:47:50'),(31,2,1,'owner','2026-04-02 12:47:50'),(32,3,1,'owner','2026-04-02 12:47:50'),(34,6,3,'member','2026-04-02 13:08:13'),(37,12,2,'member','2026-04-15 15:29:31'),(47,13,2,'member','2026-04-15 15:37:41'),(49,11,2,'member','2026-04-15 15:38:40'),(50,14,2,'owner','2026-04-15 15:38:52'),(54,15,2,'owner','2026-04-21 14:48:43');
/*!40000 ALTER TABLE `project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `category` enum('Tech & IT','Science','Business','Design','Other') NOT NULL,
  `tags` varchar(300) DEFAULT NULL,
  `icon` varchar(10) DEFAULT 0xF09F92BB,
  `status` enum('Planning','In Progress','Review','Completed') DEFAULT 'Planning',
  `owner_id` int NOT NULL,
  `max_members` tinyint DEFAULT '10',
  `is_open` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_projects_owner` (`owner_id`),
  KEY `idx_projects_category` (`category`),
  KEY `idx_projects_status` (`status`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'','','Tech & IT','','💻','Planning',2,10,1,'2026-03-14 12:07:13','2026-03-14 12:07:13'),(2,'','','Tech & IT','','💻','Planning',2,10,1,'2026-03-14 12:08:20','2026-03-14 12:08:20'),(3,'ai study','all about wd','Tech & IT','python','💻','Planning',2,10,1,'2026-03-14 12:22:43','2026-03-14 12:22:43'),(4,'OOP','cloud hosting','Tech & IT','c python','💻','Planning',2,10,1,'2026-03-16 12:45:06','2026-03-16 12:45:06'),(5,'science','xyz','Science','','💻','Planning',2,10,1,'2026-03-25 12:38:59','2026-03-25 12:38:59'),(6,'science','xyz','Business','','💻','Planning',2,10,1,'2026-03-25 12:39:11','2026-03-25 12:39:11'),(7,'science','xyz','Design','','💻','Planning',2,10,1,'2026-03-25 12:39:20','2026-03-25 12:39:20'),(8,'ai','hgfj','Design','','💻','Planning',2,10,1,'2026-03-25 12:59:52','2026-03-25 12:59:52'),(9,'sfg','sfdg','Science','','💻','Planning',2,10,1,'2026-03-25 13:35:14','2026-03-25 13:35:14'),(10,'my proj','gfdgv','Tech & IT','ffgg','💻','Planning',2,10,1,'2026-04-02 12:42:05','2026-04-02 12:42:05'),(11,'AI Study Assistant','Building an AI-powered study buddy','Tech & IT','Python,TensorFlow,NLP','🤖','In Progress',1,10,1,'2026-04-02 12:47:42','2026-04-02 12:47:42'),(12,'Web Dev Portfolio','Building student portfolio website','Tech & IT','React,Node.js,MongoDB','🌐','Planning',1,10,1,'2026-04-02 12:47:42','2026-04-02 12:47:42'),(13,'Data Science Project','Analyzing student performance data','Science','Python,Data Analysis','📊','Review',1,10,1,'2026-04-02 12:47:42','2026-04-02 12:47:42'),(14,'zcsfd','dzxfsdf','Tech & IT','XZC','💻','Planning',2,10,1,'2026-04-15 15:38:52','2026-04-15 15:38:52'),(15,'ytjuti','jghjjk','Science','','💻','Planning',2,10,1,'2026-04-21 14:48:43','2026-04-21 14:48:43');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `type` enum('Notes','Video','Previous Paper','Assignment','Other') NOT NULL,
  `course_code` varchar(20) DEFAULT NULL,
  `file_url` varchar(500) DEFAULT NULL,
  `external_url` varchar(500) DEFAULT NULL,
  `description` text,
  `downloads` int DEFAULT '0',
  `uploader_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resources_uploader` (`uploader_id`),
  KEY `idx_resources_course` (`course_code`),
  CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,'csdfv','Notes','cv','/uploads/1773645883171-2.pdf',NULL,'',4,2,'2026-03-16 12:54:43'),(2,'os notes','Notes','IT178','/uploads/1773646080984-2.pdf',NULL,'',5,2,'2026-03-16 12:58:00'),(3,'DBMS','Notes','ENTC','/uploads/1773646903596-2.pdf',NULL,'',1,2,'2026-03-16 13:11:43'),(4,'FGHYR','Notes','','/uploads/1773647106289-2.pdf',NULL,'',5,2,'2026-03-16 13:15:06'),(5,'df','Notes','','/uploads/1773820823254-2.pdf',NULL,'',1,2,'2026-03-18 13:30:23'),(6,'os','Notes','IT301','/uploads/1773820871424-2.pdf',NULL,'',2,2,'2026-03-18 13:31:11'),(7,'ghy','Notes','','/uploads/1773821392699-2.pdf',NULL,'',3,2,'2026-03-18 13:39:52'),(8,'phy','Notes','','/uploads/1773821412940-2.pdf',NULL,'',1,2,'2026-03-18 13:40:12'),(9,'defasd','Notes','sda','/uploads/1776247494354-2.pdf',NULL,'',2,2,'2026-04-15 15:34:54'),(10,'os notes','Notes','','/uploads/1776763167538-2.pdf',NULL,'',1,2,'2026-04-21 14:49:27'),(11,'new','Notes','','/uploads/1776763204191-2.pdf',NULL,'',1,2,'2026-04-21 14:50:04'),(12,'atharva notes','Notes','SI156','/uploads/1776832552219-2.pdf',NULL,'',2,2,'2026-04-22 10:05:52'),(13,'huj','Notes','','/uploads/1776847183272-2.pdf',NULL,'',2,2,'2026-04-22 14:09:43'),(14,'fdf','Notes','','/uploads/1776848646693-2.pdf',NULL,'',1,2,'2026-04-22 14:34:06'),(15,'ko','Notes','','/uploads/1776849567066-2.pdf',NULL,'',1,2,'2026-04-22 14:49:27');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_group_members`
--

DROP TABLE IF EXISTS `study_group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `user_id` int NOT NULL,
  `role` enum('owner','member') DEFAULT 'member',
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_group_member` (`group_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `study_group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `study_groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `study_group_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_group_members`
--

LOCK TABLES `study_group_members` WRITE;
/*!40000 ALTER TABLE `study_group_members` DISABLE KEYS */;
INSERT INTO `study_group_members` VALUES (1,1,2,'owner','2026-03-16 12:50:50'),(3,2,2,'owner','2026-03-18 13:27:55'),(7,3,2,'owner','2026-03-25 12:39:54'),(11,4,2,'owner','2026-03-25 13:00:09'),(12,5,2,'owner','2026-03-25 13:35:25');
/*!40000 ALTER TABLE `study_group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `study_groups`
--

DROP TABLE IF EXISTS `study_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `study_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `course_code` varchar(20) DEFAULT NULL,
  `description` text,
  `tags` varchar(300) DEFAULT NULL,
  `icon` varchar(10) DEFAULT 0xF09F939A,
  `meeting_freq` enum('Weekly','Bi-weekly','As needed') DEFAULT 'Weekly',
  `next_session` datetime DEFAULT NULL,
  `session_location` varchar(200) DEFAULT NULL,
  `owner_id` int NOT NULL,
  `max_members` tinyint DEFAULT '15',
  `is_open` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_groups_owner` (`owner_id`),
  CONSTRAINT `study_groups_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `study_groups`
--

LOCK TABLES `study_groups` WRITE;
/*!40000 ALTER TABLE `study_groups` DISABLE KEYS */;
INSERT INTO `study_groups` VALUES (1,'fdgdfg','','fdgdfgfrg','','📚','Weekly',NULL,'',2,8,1,'2026-03-16 12:50:50','2026-03-16 12:50:50'),(2,'dfg','','fsdf','','📚','Bi-weekly',NULL,'',2,8,1,'2026-03-18 13:27:55','2026-03-18 13:27:55'),(3,'kjlui','','','','📚','Weekly',NULL,'',2,8,1,'2026-03-25 12:39:54','2026-03-25 12:39:54'),(4,'htrgh','','ghrt','','📚','Weekly',NULL,'',2,8,1,'2026-03-25 13:00:09','2026-03-25 13:00:09'),(5,'egrter','','ger','','📚','Weekly',NULL,'',2,8,1,'2026-03-25 13:35:25','2026-03-25 13:35:25');
/*!40000 ALTER TABLE `study_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_courses`
--

DROP TABLE IF EXISTS `user_courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `course_id` int NOT NULL,
  `grade` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_course` (`user_id`,`course_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `user_courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_courses`
--

LOCK TABLES `user_courses` WRITE;
/*!40000 ALTER TABLE `user_courses` DISABLE KEYS */;
INSERT INTO `user_courses` VALUES (1,1,1,'A'),(2,1,2,'B+'),(3,1,3,'A+'),(4,1,4,'B');
/*!40000 ALTER TABLE `user_courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `department` enum('Computer Science','Information Technology','Electronics Engineering','Mechanical Engineering','Civil Engineering','Business Administration') NOT NULL,
  `year` enum('1st Year','2nd Year','3rd Year','4th Year','Masters') NOT NULL,
  `bio` text,
  `skills` varchar(500) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `points` int DEFAULT '0',
  `level` tinyint DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'John','Doe','student@collab.edu','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Computer Science','3rd Year','Passionate about coding and collaboration!','Python, JavaScript, SQL, React',NULL,1250,4,1,'2026-03-14 11:38:23','2026-03-14 11:38:23'),(2,'John','Doe','john@test.com','$2a$10$aEl.FRQtFB7.JPeiNOE1Ree74of4a6erbecL/wmx8KegYomEIXVEy','Computer Science','3rd Year',NULL,NULL,'/uploads/avatars/avatar-2.jpg',2080,1,1,'2026-03-14 11:39:10','2026-04-22 14:49:50'),(3,'atharva','pardeshi','atharvapardeshi@gmail.com','$2a$10$xxbwj7vvmvVZkLXUOXOZ7O6qpy3f4DKMA14nEJocHr86kFjelP84K','Computer Science','2nd Year',NULL,NULL,NULL,10,1,1,'2026-04-02 13:03:34','2026-04-02 13:08:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 15:04:00
