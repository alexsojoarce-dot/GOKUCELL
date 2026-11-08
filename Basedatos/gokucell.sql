-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 07, 2026 at 07:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gokucell`
--
CREATE DATABASE IF NOT EXISTS `gokucell` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gokucell`;

-- --------------------------------------------------------

--
-- Table structure for table `garantias`
--

CREATE TABLE `garantias` (
  `id` int(11) NOT NULL,
  `telefono_id` int(11) DEFAULT NULL,
  `cliente` varchar(100) NOT NULL,
  `contacto` varchar(30) DEFAULT NULL,
  `equipo` varchar(150) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT 'Servicio técnico',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `duracion_meses` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `automatica` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `garantias`
--

INSERT INTO `garantias` (`id`, `telefono_id`, `cliente`, `contacto`, `equipo`, `tipo`, `fecha_inicio`, `fecha_vencimiento`, `duracion_meses`, `observaciones`, `automatica`) VALUES
(1, 1, 'Alexander', '63430635', 'Samsung Galaxy S24 Ultra', 'Servicio técnico', '2026-11-07', '2026-12-07', 1, 'Garantía inicial de 1 mes. Podés modificar su período y observaciones desde el módulo Garantías.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `existencias` int(11) DEFAULT 0,
  `minimo` int(11) DEFAULT 3,
  `costo` decimal(10,2) DEFAULT 0.00,
  `precio` decimal(10,2) DEFAULT 0.00,
  `foto` varchar(255) DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productos`
--

INSERT INTO `productos` (`id`, `codigo`, `nombre`, `categoria`, `marca`, `existencias`, `minimo`, `costo`, `precio`, `foto`, `destacado`) VALUES
(19, NULL, 'Power bank multicable', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-multicable.webp', 1),
(20, NULL, 'Cable trenzado USB-C a Lightning', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-usb-c-lightning-trenzado-blanco.webp', 1),
(21, NULL, 'Bocina Bluetooth compacta', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-compacta-roja.webp', 1),
(22, NULL, 'Power bank con cables integrados', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-cables-integrados.webp', 1),
(23, NULL, 'Audífonos inalámbricos TWS blancos', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-tws-blancos.webp', 1),
(24, NULL, 'Audífonos inalámbricos tipo diadema', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-diadema-inalambricos.webp', 1),
(25, NULL, 'Audífonos alámbricos negros', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-alambricos-negros.webp', 1),
(26, NULL, 'Bocina Bluetooth con iluminación', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-luz-rgb.webp', 1),
(27, NULL, 'Bocina Bluetooth portátil', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-portatil.webp', 1),
(28, NULL, 'Cable trenzado USB-C a USB-C', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-usb-c-usb-c-trenzado-negro.webp', 1),
(29, NULL, 'Cargador inalámbrico magnético', 'Cargadores inalámbricos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cargador-inalambrico-magnetico.webp', 1),
(30, NULL, 'Audífonos inalámbricos TWS negros', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-tws-negros.webp', 1),
(31, NULL, 'Power bank magnético', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-magnetico.webp', 1),
(32, 'CAB248', 'Cable trenzado USB-A a Micro-USB de 1 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab248-usb-a-micro-usb.webp', 1),
(33, 'CAB252', 'Cable USB-C a USB-C de 1 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab252-usb-c-usb-c.webp', 1),
(34, 'CAB264', 'Cable trenzado USB-A a USB-C de 2 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab264-usb-a-usb-c.webp', 1),
(35, 'PR132', 'Pilas AA 1HORA', 'Pilas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/pilas-aa-1hora-pr132.webp', 1),
(36, NULL, 'Audífonos alámbricos blancos USB-C', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-alambricos-blancos-usb-c.webp', 1);

-- --------------------------------------------------------

--
-- Table structure for table `telefonos`
--

CREATE TABLE `telefonos` (
  `id` int(11) NOT NULL,
  `codigo_consulta` varchar(20) NOT NULL,
  `cliente` varchar(100) NOT NULL,
  `contacto` varchar(30) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `fecha_recepcion` date NOT NULL,
  `estado` varchar(30) DEFAULT 'Recibido',
  `problema` text DEFAULT NULL,
  `diagnostico` text DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `telefonos`
--

INSERT INTO `telefonos` (`id`, `codigo_consulta`, `cliente`, `contacto`, `marca`, `modelo`, `fecha_recepcion`, `estado`, `problema`, `diagnostico`, `foto`, `fecha_entrega`) VALUES
(1, 'GOK-S7M57R', 'Alexander', '63430635', 'Samsung', 'Galaxy S24 Ultra', '2026-11-07', 'Entregado', 'pantalla quebrada', NULL, 'img/subidas/tel_c013beeae1435293.jpg', '2026-11-07'),
(2, 'GOK-ZBU942', 'kei', '62988591', 'Apple', '15', '2026-11-07', 'Recibido', 'pantalla quebrada', NULL, 'img/subidas/tel_5f469835b6478b27.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `nombre`, `contrasena`) VALUES
(3, 'admin', 'Administrador', '$2y$10$9GQ7y4ASBd6e5lIMNQ6lvePDAK0ZossHzPi206TmcAex7D1Mz7Zsu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `garantias`
--
ALTER TABLE `garantias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `telefono_id` (`telefono_id`);

--
-- Indexes for table `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indexes for table `telefonos`
--
ALTER TABLE `telefonos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_consulta` (`codigo_consulta`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `garantias`
--
ALTER TABLE `garantias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `telefonos`
--
ALTER TABLE `telefonos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `garantias`
--
ALTER TABLE `garantias`
  ADD CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`telefono_id`) REFERENCES `telefonos` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
