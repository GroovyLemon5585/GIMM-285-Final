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
-- Table structure for table `car_selection`
--

CREATE TABLE `car_selection` (
  `id` int NOT NULL,
  `model_id` varchar(255) NOT NULL,
  `year_released` int NOT NULL,
  `lowest_price` int NOT NULL,
  `highest_price` int NOT NULL,
  `car_attributes_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `car_selection`
--

INSERT INTO `car_selection` (`id`, `model_id`, `year_released`, `lowest_price`, `highest_price`, `car_attributes_id`) VALUES
(1, 'DB5 Coupe', 1963, 500000, 1955000, 1),
(2, 'Mustang', 1964, 32000, 350000, 2),
(3, 'F-150', 1975, 36000, 77100, 3),
(4, 'Explorer', 1990, 36000, 49200, 4),
(5, 'Escape', 2000, 22800, 29000, 5),
(6, 'Fusion', 2006, 22300, 24000, 6),
(7, 'Charger', 1966, 35000, 150000, 7),
(8, 'Challenger', 1970, 30000, 200000, 8),
(9, 'Durango', 1998, 44490, 95900, 9),
(10, 'Hornet', 2023, 31000, 53000, 10),
(11, 'Charger Daytona', 2024, 50000, 73100, 11),
(12, 'DB12', 2023, 245000, 250000, 12),
(13, 'Vantage', 2005, 194500, 20000, 13),
(14, 'DBX', 2020, 240000, 276000, 14),
(15, 'Vanquish', 2001, 430000, 500000, 15),
(16, 'Emira', 2022, 94000, 99900, 16),
(17, 'Evija', 2020, 2100000, 2300000, 17),
(18, 'Eletre', 2023, 110000, 145000, 18),
(19, 'Evora', 2009, 41000, 96000, 19),
(20, 'Elise', 1996, 43600, 50000, 20),
(21, 'Jesko', 2019, 2500000, 3000000, 21),
(22, 'Samurai', 1985, 6500, 10000, 22),
(23, 'Sidekick', 1989, 10000, 16000, 23),
(24, 'X-90', 1995, 13000, 17000, 24),
(25, 'Esteem', 1995, 10300, 17000, 25),
(26, 'Vitara', 1988, 13000, 22000, 26),
(27, 'Grand Vitara', 1998, 17000, 30000, 27),
(28, 'Xl-7', 1998, 20000, 30000, 28),
(29, 'Aerio', 2001, 13000, 18000, 29),
(30, 'Verona', 2004, 18000, 22000, 30),
(31, 'Forenza', 2004, 14000, 19000, 31),
(32, 'Reno', 2005, 14000, 18000, 32),
(33, 'Sx4', 2006, 14000, 22000, 33),
(34, 'Kizashi', 2009, 19000, 29000, 34),
(35, 'Equator', 2009, 17000, 31000, 35),
(36, 'Swift', 1983, 9000, 24000, 36),
(37, 'Jimny', 1970, 12000, 28000, 37),
(38, 'Alto', 1979, 6000, 14000, 38),
(39, 'Celerio', 2014, 9000, 15000, 39),
(40, 'Baleno', 1995, 13000, 22000, 40),
(41, 'Ignis', 2000, 12000, 21000, 41),
(42, '360', 1958, 1300, 3000, 42),
(43, 'R-2', 1969, 2000, 4000, 43),
(44, 'Rex', 1972, 3000, 8000, 44),
(45, 'Leone', 1971, 4500, 16000, 45),
(46, 'BRAT', 1978, 6000, 13000, 46),
(47, 'Justy', 1984, 5500, 11000, 47),
(48, 'Alcyone', 1985, 10000, 22000, 48),
(49, 'Loyale', 1989, 9000, 15000, 49),
(50, 'Legacy', 1989, 13000, 38000, 50),
(51, 'SVX', 1991, 25000, 37000, 51),
(52, 'Impreza', 1992, 13000, 44000, 52),
(53, 'Vivio', 1992, 6000, 11000, 53),
(54, 'Outback', 1994, 19000, 43000, 54),
(55, 'Forester', 1997, 18000, 41000, 55),
(56, 'Sambar', 1961, 5000, 18000, 56),
(57, 'Pleo', 1998, 7000, 14000, 57),
(58, 'Baja', 2002, 23000, 29000, 58),
(59, 'R2', 2003, 8000, 15000, 59),
(60, 'R1', 2004, 9000, 16000, 60),
(61, 'Tribeca', 2005, 29000, 38000, 61),
(62, 'Stella', 2006, 9000, 16000, 62),
(63, 'Exiga', 2008, 24000, 38000, 63),
(64, 'WRX', 2014, 26000, 45000, 64),
(65, 'Levorg', 2014, 25000, 47000, 65),
(66, 'BRZ', 2012, 25000, 34000, 67),
(67, 'Crosstrek', 2012, 22000, 38000, 68),
(68, 'Ascent', 2018, 32000, 49000, 69),
(69, 'Solterra', 2022, 45000, 53000, 70),
(70, 'Trezia', 2010, 16000, 24000, 71),
(71, 'Traviq', 2001, 22000, 30000, 72),
(72, 'Domingo', 1983, 8000, 15000, 73),
(73, 'Dex', 2008, 14000, 22000, 74),
(74, 'Chiffon', 2016, 12000, 20000, 75),
(75, 'Lucra', 2010, 11000, 18000, 76),
(76, 'Pleo Plus', 2012, 10000, 17000, 77),
(77, 'Dias Wagon', 1999, 12000, 22000, 78),
(78, 'Layback', 2023, 32000, 48000, 79),
(79, 'Impreza WRX STI', 1994, 24000, 60000, 80),
(80, 'Legacy B4', 1998, 22000, 52000, 81),
(81, 'Alcyone SVX', 1991, 24000, 37000, 66),
(82, 'Corolla', 1966, 1700, 38000, 82),
(83, 'Camry', 1982, 13000, 43000, 83),
(84, 'Supra', 1978, 13000, 65000, 84),
(85, 'Celica', 1970, 4000, 35000, 85),
(86, 'MR2', 1984, 14000, 32000, 86),
(87, 'Prius', 1997, 20000, 40000, 87),
(88, 'Avalon', 1994, 22000, 45000, 88),
(89, 'Yaris', 1999, 9000, 22000, 89),
(90, 'Echo', 1999, 10000, 13000, 90),
(91, 'Matrix', 2002, 15000, 24000, 91),
(92, 'RAV4', 1994, 16000, 43000, 92),
(93, 'Highlander', 2000, 24000, 53000, 93),
(94, '4Runner', 1984, 14000, 50000, 94),
(95, 'Sequoia', 2000, 31000, 80000, 95),
(96, 'Tacoma', 1995, 11000, 55000, 96),
(97, 'Tundra', 1999, 16000, 80000, 97),
(98, 'Sienna', 1997, 22000, 55000, 98),
(99, 'FJ Cruiser', 2006, 22000, 44000, 99),
(100, 'Land Cruiser', 1951, 4000, 400000, 100),
(101, 'Legacy', 2013, 4000, 40000, 101),
(102, 'G35', 2007, 5000, 20000, 102),
(103, 'Mustang', 2024, 1, 3, 103);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car_selection`
--
ALTER TABLE `car_selection`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_car_selection_car_attributes_id` (`car_attributes_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `car_selection`
--
ALTER TABLE `car_selection`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `car_selection`
--
ALTER TABLE `car_selection`
  ADD CONSTRAINT `fk_car_selection_car_attributes_id` FOREIGN KEY (`car_attributes_id`) REFERENCES `car_attributes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
