-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com
-- Generation Time: Oct 01, 2026 at 06:23 PM
-- Server version: 8.0.42
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `HUNTERANDERSON753`
--

-- --------------------------------------------------------

--
-- Table structure for table `car_attributes`
--

CREATE TABLE `car_attributes` (
  `id` int NOT NULL,
  `car_brand` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `model_name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `horsepower` int NOT NULL,
  `lowest_gas_mileage` int NOT NULL,
  `highest_gas_mileage` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `car_attributes`
--

INSERT INTO `car_attributes` (`id`, `car_brand`, `model_name`, `horsepower`, `lowest_gas_mileage`, `highest_gas_mileage`) VALUES
(1, 'Aston Martin', 'DB5 Coupe', 286, 15, 22),
(2, 'Ford', 'Mustang', 310, 22, 32),
(3, 'Ford', 'F-150', 325, 19, 26),
(4, 'Ford', 'Explorer', 300, 20, 30),
(5, 'Ford', 'Escape', 180, 42, 101),
(6, 'Ford', 'Fusion', 175, 34, 108),
(7, 'Dodge', 'Charger', 292, 19, 30),
(8, 'Dodge', 'Challenger', 303, 19, 30),
(9, 'Dodge', 'Durango', 290, 19, 26),
(10, 'Dodge', 'Hornet', 268, 21, 77),
(11, 'Dodge', 'Charger Daytona', 496, 0, 0),
(12, 'Aston Martin', 'DB12', 671, 14, 22),
(13, 'Aston Martin', 'Vantage', 656, 15, 24),
(14, 'Aston Martin', 'DBX', 717, 14, 20),
(15, 'Aston Martin', 'Vanquish', 835, 13, 26),
(16, 'Lotus', 'Emira', 360, 16, 26),
(17, 'Lotus', 'Evija', 2000, 0, 0),
(18, 'Lotus', 'Eletre', 600, 0, 0),
(19, 'Lotus', 'Evora', 400, 17, 24),
(20, 'Lotus', 'Elise', 134, 20, 37),
(21, 'Koenigsegg', 'Jesko', 1280, 10, 15),
(22, 'Suzuki', 'Samurai', 63, 23, 28),
(23, 'Suzuki', 'Sidekick', 80, 21, 26),
(24, 'Suzuki', 'X-90', 95, 22, 26),
(25, 'Suzuki', 'Esteem', 95, 24, 34),
(26, 'Suzuki', 'Vitara', 97, 19, 26),
(27, 'Suzuki', 'Grand Vitara', 127, 17, 26),
(28, 'Suzuki', 'Xl-7', 170, 16, 24),
(29, 'Suzuki', 'Aerio', 145, 22, 31),
(30, 'Suzuki', 'Verona', 155, 22, 28),
(31, 'Suzuki', 'Forenza', 119, 20, 28),
(32, 'Suzuki', 'Reno', 126, 20, 28),
(33, 'Suzuki', 'Sx4', 143, 23, 33),
(34, 'Suzuki', 'Kizashi', 185, 20, 31),
(35, 'Suzuki', 'Equator', 152, 17, 23),
(36, 'Suzuki', 'Swift', 67, 30, 50),
(37, 'Suzuki', 'Jimny', 64, 28, 39),
(38, 'Suzuki', 'Alto', 39, 37, 56),
(39, 'Suzuki', 'Celerio', 67, 35, 47),
(40, 'Suzuki', 'Baleno', 75, 30, 48),
(41, 'Suzuki', 'Ignis', 82, 32, 50),
(42, 'Subaru', '360', 16, 40, 66),
(43, 'Subaru', 'R-2', 30, 38, 55),
(44, 'Subaru', 'Rex', 31, 35, 58),
(45, 'Subaru', 'Leone', 67, 24, 38),
(46, 'Subaru', 'BRAT', 67, 23, 30),
(47, 'Subaru', 'Justy', 48, 31, 45),
(48, 'Subaru', 'Alcyone', 97, 22, 30),
(49, 'Subaru', 'Loyale', 90, 23, 30),
(50, 'Subaru', 'Legacy', 130, 20, 36),
(51, 'Subaru', 'SVX', 230, 16, 25),
(52, 'Subaru', 'Impreza', 95, 19, 36),
(53, 'Subaru', 'Vivio', 44, 42, 60),
(54, 'Subaru', 'Outback', 165, 20, 33),
(55, 'Subaru', 'Forester', 165, 20, 34),
(56, 'Subaru', 'Sambar', 38, 30, 45),
(57, 'Subaru', 'Pleo', 46, 38, 58),
(58, 'Subaru', 'Baja', 165, 19, 28),
(59, 'Subaru', 'R2', 46, 40, 55),
(60, 'Subaru', 'R1', 46, 40, 54),
(61, 'Subaru', 'Tribeca', 245, 16, 21),
(62, 'Subaru', 'Stella', 54, 40, 58),
(63, 'Subaru', 'Exiga', 148, 23, 34),
(64, 'Subaru', 'WRX', 227, 19, 28),
(65, 'Subaru', 'Levorg', 168, 24, 37),
(66, 'Subaru', 'Alcyone SVX', 230, 16, 25),
(67, 'Subaru', 'BRZ', 200, 21, 30),
(68, 'Subaru', 'Crosstrek', 148, 27, 34),
(69, 'Subaru', 'Ascent', 260, 20, 27),
(70, 'Subaru', 'Solterra', 215, 94, 104),
(71, 'Subaru', 'Trezia', 108, 32, 42),
(72, 'Subaru', 'Traviq', 125, 24, 34),
(73, 'Subaru', 'Domingo', 54, 24, 32),
(74, 'Subaru', 'Dex', 92, 30, 40),
(75, 'Subaru', 'Chiffon', 52, 42, 58),
(76, 'Subaru', 'Lucra', 52, 40, 55),
(77, 'Subaru', 'Pleo Plus', 52, 45, 60),
(78, 'Subaru', 'Dias Wagon', 46, 30, 42),
(79, 'Subaru', 'Layback', 174, 24, 32),
(80, 'Subaru', 'Impreza WRX STI', 227, 17, 25),
(81, 'Subaru', 'Legacy B4', 138, 20, 34),
(82, 'Toyota', 'Corolla', 60, 25, 53),
(83, 'Toyota', 'Camry', 92, 20, 53),
(84, 'Toyota', 'Supra', 110, 17, 32),
(85, 'Toyota', 'Celica', 95, 21, 33),
(86, 'Toyota', 'MR2', 112, 24, 32),
(87, 'Toyota', 'Prius', 70, 48, 58),
(88, 'Toyota', 'Avalon', 192, 22, 44),
(89, 'Toyota', 'Yaris', 106, 30, 40),
(90, 'Toyota', 'Echo', 108, 35, 42),
(91, 'Toyota', 'Matrix', 130, 25, 32),
(92, 'Toyota', 'RAV4', 120, 22, 41),
(93, 'Toyota', 'Highlander', 220, 20, 36),
(94, 'Toyota', '4Runner', 150, 16, 22),
(95, 'Toyota', 'Sequoia', 240, 13, 24),
(96, 'Toyota', 'Tacoma', 142, 18, 24),
(97, 'Toyota', 'Tundra', 190, 13, 24),
(98, 'Toyota', 'Sienna', 187, 18, 36),
(99, 'Toyota', 'FJ Cruiser', 239, 16, 20),
(100, 'aaaaaaaaaaaaa', 'Land Cruiser', 125, 13, 20),
(101, 'Subaru', 'Legacy', 120, 20, 30),
(102, 'Infiniti', 'G35', 280, 20, 30),
(103, 'Ford', 'Mustang', 420, 20, 30);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_attributes`
--
ALTER TABLE `car_attributes`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_attributes`
--
ALTER TABLE `car_attributes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
