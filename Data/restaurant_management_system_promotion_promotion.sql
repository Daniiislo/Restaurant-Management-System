-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant_management_system
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `promotion_promotion`
--

LOCK TABLES `promotion_promotion` WRITE;
/*!40000 ALTER TABLE `promotion_promotion` DISABLE KEYS */;
INSERT INTO `promotion_promotion` VALUES ('DIAMOND','Ưu đãi thành viên kim cương','2025-01-01','2026-01-01',2000000,'Giảm 20% trên tổng hóa đơn cho thành viên với hóa đơn từ 2.000.000 đồng trở lên. Ưu đãi kéo dài từ 01/01/2025 đến 01/01/2026.','promotion_img/diamond.jpg',20,'KMTV'),('GOLD','Ưu đãi thành viên vàng','2025-01-01','2026-01-01',1000000,'Giảm 10% trên tổng hóa đơn cho thành viên với hóa đơn từ 1.000.000 đồng trở lên. Ưu đãi kéo dài từ 01/01/2025 đến 01/01/2026.','promotion_img/gold.jpg',10,'KMTV'),('GROUP','Ưu đãi nhóm','2025-01-01','2026-01-01',0,'Giảm 15% cho nhóm từ 20 người trở lên, tặng kèm món khai vị','promotion_img/group.jpg',15,'KMT'),('NOEL2025','Ưu đãi giáng sinh','2024-12-20','2024-12-31',500000,'Tận hưởng bữa tối Giáng sinh lãng mạn với thực đơn đặc biệt và không gian trang trí lung linh. Đặt bàn ngay để nhận ưu đãi giảm giá 10% và cơ hội trúng thưởng nhiều phần quà hấp dẫn.\r\nÁp dụng cho hoá đơn trên 500.000 VNĐ','promotion_img/noel2025.jpg',10,'KMT'),('OPEN','Khuyến mãi khai trương','2025-01-01','2025-01-31',0,'Tưng bừng khai trương - Tặng một phần tráng miệng hoặc đồ uống miễn phí và giảm ngay 20% trên tổng hóa đơn cho tất cả khách hàng trong ngày đầu tiên.\r\nHãy đến và chia sẻ niềm vui cùng chúng tôi!','promotion_img/Opening.jpg',20,'KMT'),('SILVER','Ưu đãi thành viên bạc','2025-01-01','2026-01-01',500000,'Giảm 5% trên tổng hóa đơn cho thành viên với hóa đơn từ 500.000 đồng trở lên. Ưu đãi kéo dài từ 01/01/2025 đến 01/01/2026.','promotion_img/silver_sale.jpg',5,'KMTV'),('SINHNNHAT','Ưu đãi sinh nhật','2024-01-01','2026-01-01',300000,'Giảm 10% tổng hóa đơn cho khách hàng trong ngày sinh nhật, áp dụng cho hoá đơn từ 300.000 VND','promotion_img/birthday.jpg',10,'KMT'),('SUMMER2025','Ưu đãi hè','2025-06-01','2025-08-31',1000000,'Giảm 15% cho set menu mùa hè đặc biệt, tặng kèm đồ uống mát lạnh.\r\nÁp dụng đối với hoá đơn trên 1 triệu.','promotion_img/summer.jpg',15,'KMT'),('TET2025','Ưu đãi Tết Nguyên Đán 2025','2025-01-28','2025-01-31',1000000,'Giảm 5% cho hóa đơn từ 1 triệu, tặng kèm set lì xì may mắn','promotion_img/tet2025.jpg',5,'KMT'),('VALENTINE','Ưu đãi Lễ Tình Nhân','2025-02-13','2025-02-14',500000,'Giảm 10% và tặng kèm 2 ly cocktail đặc biệt cho các cặp đôi\r\nÁp dụng đối với hoá đơn trên 500.000 VNĐ','promotion_img/valentine.jpg',10,'KMT');
/*!40000 ALTER TABLE `promotion_promotion` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-09  0:49:34
