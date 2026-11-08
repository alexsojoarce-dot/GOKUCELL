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

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `garantias`, `telefonos`, `productos`, `usuarios`;
SET FOREIGN_KEY_CHECKS = 1;

-- Usuarios del panel administrativo
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipos recibidos para reparación
CREATE TABLE `telefonos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `fecha_entrega` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_consulta` (`codigo_consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Una garantía por teléfono entregado (se crea automáticamente al entregar)
CREATE TABLE `garantias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefono_id` int(11) DEFAULT NULL,
  `cliente` varchar(100) NOT NULL,
  `contacto` varchar(30) DEFAULT NULL,
  `equipo` varchar(150) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT 'Servicio técnico',
  `fecha_inicio` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `duracion_meses` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `automatica` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `telefono_id` (`telefono_id`),
  CONSTRAINT `garantias_ibfk_1` FOREIGN KEY (`telefono_id`) REFERENCES `telefonos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventario y catálogo público
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) DEFAULT NULL,
  `nombre` varchar(150) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `marca` varchar(100) DEFAULT NULL,
  `existencias` int(11) DEFAULT 0,
  `minimo` int(11) DEFAULT 3,
  `costo` decimal(10,2) DEFAULT 0.00,
  `precio` decimal(10,2) DEFAULT 0.00,
  `foto` varchar(255) DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Administrador inicial (usuario: admin)
INSERT INTO `usuarios` (`usuario`, `nombre`, `contrasena`) VALUES
('admin', 'Administrador', '$2y$10$9GQ7y4ASBd6e5lIMNQ6lvePDAK0ZossHzPi206TmcAex7D1Mz7Zsu');

-- Productos 1HORA iniciales
INSERT INTO `productos` (`codigo`, `nombre`, `categoria`, `marca`, `existencias`, `minimo`, `costo`, `precio`, `foto`, `destacado`) VALUES
(NULL, 'Power bank multicable', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-multicable.webp', 1),
(NULL, 'Cable trenzado USB-C a Lightning', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-usb-c-lightning-trenzado-blanco.webp', 1),
(NULL, 'Bocina Bluetooth compacta', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-compacta-roja.webp', 1),
(NULL, 'Power bank con cables integrados', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-cables-integrados.webp', 1),
(NULL, 'Audífonos inalámbricos TWS blancos', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-tws-blancos.webp', 1),
(NULL, 'Audífonos inalámbricos tipo diadema', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-diadema-inalambricos.webp', 1),
(NULL, 'Audífonos alámbricos negros', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-alambricos-negros.webp', 1),
(NULL, 'Bocina Bluetooth con iluminación', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-luz-rgb.webp', 1),
(NULL, 'Bocina Bluetooth portátil', 'Bocinas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/bocina-bluetooth-portatil.webp', 1),
(NULL, 'Cable trenzado USB-C a USB-C', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-usb-c-usb-c-trenzado-negro.webp', 1),
(NULL, 'Cargador inalámbrico magnético', 'Cargadores inalámbricos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cargador-inalambrico-magnetico.webp', 1),
(NULL, 'Audífonos inalámbricos TWS negros', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-tws-negros.webp', 1),
(NULL, 'Power bank magnético', 'Power banks', '1HORA', NULL, 3, NULL, NULL, 'img/productos/power-bank-magnetico.webp', 1),
('CAB248', 'Cable trenzado USB-A a Micro-USB de 1 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab248-usb-a-micro-usb.webp', 1),
('CAB252', 'Cable USB-C a USB-C de 1 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab252-usb-c-usb-c.webp', 1),
('CAB264', 'Cable trenzado USB-A a USB-C de 2 m', 'Cables', '1HORA', NULL, 3, NULL, NULL, 'img/productos/cable-cab264-usb-a-usb-c.webp', 1),
('PR132', 'Pilas AA 1HORA', 'Pilas', '1HORA', NULL, 3, NULL, NULL, 'img/productos/pilas-aa-1hora-pr132.webp', 1),
(NULL, 'Audífonos alámbricos blancos USB-C', 'Audífonos', '1HORA', NULL, 3, NULL, NULL, 'img/productos/audifonos-alambricos-blancos-usb-c.webp', 1);
