-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-08-2024 a las 21:21:50
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `f21_inventory`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capturas`
--

CREATE TABLE `capturas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `capturas`
--

INSERT INTO `capturas` (`id`, `id_usuario`, `id_producto`, `id_sucursal`, `fecha`) VALUES
(1, 2, 12, 1, '2024-07-28 00:00:00'),
(2, 2, 9, 1, '2024-07-28 00:00:00'),
(3, 2, 9, 1, '2024-07-28 00:00:00'),
(4, 2, 12, 1, '2024-07-28 00:00:00'),
(5, 2, 12, 1, '2024-07-28 00:00:00'),
(6, 2, 12, 1, '2024-07-28 00:00:00'),
(7, 2, 13, 1, '2024-07-30 00:00:00'),
(8, 2, 15, 1, '2024-08-15 00:00:00'),
(9, 2, 12, 1, '2024-08-16 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_orden`
--

CREATE TABLE `detalles_orden` (
  `id` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_orden`
--

INSERT INTO `detalles_orden` (`id`, `id_orden`, `id_producto`, `cantidad`) VALUES
(1, 1, 10, 5),
(2, 1, 9, 3),
(3, 2, 11, 12),
(4, 2, 12, 8),
(5, 3, 11, 12),
(6, 3, 12, 8),
(7, 3, 10, 34),
(8, 4, 11, 10),
(9, 4, 9, 5),
(10, 5, 10, 8),
(11, 5, 12, 6),
(12, 15, 9, 25),
(13, 15, 10, 25),
(17, 20, 12, 20),
(18, 20, 11, 16),
(19, 25, 10, 5),
(20, 25, 13, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes`
--

CREATE TABLE `ordenes` (
  `id` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `descripcion` varchar(300) DEFAULT NULL,
  `status` enum('pendiente','completada','incompleta') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes`
--

INSERT INTO `ordenes` (`id`, `id_sucursal`, `fecha`, `descripcion`, `status`) VALUES
(1, 1, '2024-07-04 00:00:00', 'Orden de prueba', 'completada'),
(2, 1, '2024-07-02 00:00:00', 'Orden de prueba 2', 'completada'),
(3, 1, '2024-07-14 00:00:00', 'Orden de prueba 3', 'incompleta'),
(4, 1, '2024-07-18 00:00:00', 'Orden de prueba 4', 'incompleta'),
(5, 1, '2024-07-20 00:00:00', 'Orden de prueba 5', 'completada'),
(15, 2, '2024-08-11 00:00:00', 'Revisar los siguientes productos de la línea verano-otoño 2024 masculina.', 'pendiente'),
(20, 2, '2024-08-11 00:00:00', 'Revisar los siguientes productos de la línea verano-otoño 2024 femenina.', 'pendiente'),
(25, 1, '2024-08-16 00:00:00', 'Hola', 'incompleta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `precio` float DEFAULT 0,
  `genero` enum('hombre','mujer') DEFAULT 'hombre',
  `tipo` enum('camisa','camiseta','pantalon','chamarra','jean','sweater','blusa','falda','vestido','mallas','pants','pijama','short','sudadera') DEFAULT 'camiseta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `precio`, `genero`, `tipo`) VALUES
(9, 'PANTALÓN CASUAL PARA CABALLERO FOREVER 21', 579, 'hombre', 'pantalon'),
(10, 'SWEATER LISO BÁSICO PARA CABALLERO FOREVER 21', 199, 'hombre', 'sweater'),
(11, 'PLAYERA ESTAMPADA CON BOTONES COLOR BLANCA FOREVER 21', 249, 'mujer', 'blusa'),
(12, 'VESTIDO BÁSICO PARA DAMA FOREVER 21', 449, 'mujer', 'vestido'),
(13, 'SWEATER CROPPED TEJIDO PARA DAMA FOREVER 21', 349, 'mujer', 'sweater'),
(15, 'Prueba ', 60, 'hombre', 'pijama');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_imagenes`
--

CREATE TABLE `productos_imagenes` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `qr` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos_imagenes`
--

INSERT INTO `productos_imagenes` (`id`, `id_producto`, `imagen`, `qr`) VALUES
(8, 9, 'images\\9-PANTALÓN CASUAL PARA CABALLERO FOREVER 21-product.png', 'images\\qrs\\9-PANTALÓN CASUAL PARA CABALLERO FOREVER 21-qr.png'),
(9, 10, 'images\\10-SWEATER LISO BÁSICO PARA CABALLERO FOREVER 21-product.png', 'images\\qrs\\10-SWEATER LISO BÁSICO PARA CABALLERO FOREVER 21-qr.png'),
(10, 11, 'images\\11-PLAYERA ESTAMPADA CON BOTONES COLOR BLANCO PARA DAMA FOREVER 21-product.png', 'images\\qrs\\11-PLAYERA ESTAMPADA CON BOTONES COLOR BLANCO PARA DAMA FOREVER 21-qr.png'),
(11, 12, 'images\\12-VESTIDO BÁSICO PARA DAMA FOREVER 21-product.png', 'images\\qrs\\12-VESTIDO BÁSICO PARA DAMA FOREVER 21-qr.png'),
(12, 13, 'images\\13-SWEATER-product.png', 'images\\qrs\\13-SWEATER-qr.png'),
(14, 15, 'images\\15-Prueba-product.png', 'images\\qrs\\15-Prueba-qr.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id`, `nombre`, `telefono`, `direccion`) VALUES
(1, 'Paseo la Fe NLE', '+52 55 6826 8995', 'Local 01, Av. Miguel Alemán 200, Parque la Talaverna, 66470 San Nicolás de los Garza, N.L.'),
(2, 'Punto Valle NLE', '+52 55 6826 8995', 'Rio Missouri 555, Del Valle, 66220 San Pedro Garza García, N.L.'),
(3, 'Fashion Drive NLE', '+52 55 6826 8995', 'Av. Lázaro Cárdenas #2500 col, Residencial San Agustín 1er Sector, 66220 San Pedro García García N.L.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales_productos`
--

CREATE TABLE `sucursales_productos` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales_productos`
--

INSERT INTO `sucursales_productos` (`id`, `id_producto`, `id_sucursal`, `cantidad`, `imagen`) VALUES
(1, 9, 1, 24, NULL),
(2, 10, 1, 16, NULL),
(3, 11, 1, 22, NULL),
(4, 12, 1, 25, NULL),
(26, 13, 1, 5, 'images\\13-1-store-product.png'),
(27, 9, 2, 0, 'images\\9-2-store-product.png'),
(28, 15, 1, 10, 'images\\15-1-store-product.png'),
(29, 12, 2, 0, 'images\\12-2-store-product.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido_paterno` varchar(40) NOT NULL,
  `apellido_materno` varchar(40) DEFAULT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','gerente','empleado') DEFAULT 'empleado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido_paterno`, `apellido_materno`, `email`, `password`, `rol`) VALUES
(1, 'Didier', 'Urbina', 'Gonzalez', 'urbina.didier.isw@unipolidgo.edu.mx', '$2a$10$KtnlPc/DGrmzy9paFNvYPOHhc9WhNpP7gTFMw2uaG6GVggwbG33l2', 'admin'),
(2, 'Jafet', 'Urbina', 'Gonzalez', 'sopr.urbinagonzalezdidier@gmail.com', '$2a$10$7ZEuQ8lJuNRhIphhRjKakeaaik1t.ChPgWaPRMkDF4YQOUo5V06Zy', 'empleado'),
(3, 'Alma', 'Gonzalez', 'Julián ', 'alma.yatziri@gmail.com', '$2a$10$NPuV1F5/Y7RQp.YllKmjguw3CPcezl9qIgQNVQ5o62rWlkgIEJhcG', 'gerente'),
(6, 'Yatziri ', 'González ', 'Julián ', 'yatziri@gmai.com', '$2a$10$3997/BcE96KzeEbjfWwUNe4QP/SALfzDr6DhkYP/l8ukTGEi4yBM2', 'gerente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_sucursales`
--

CREATE TABLE `usuarios_sucursales` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `puesto` enum('vendedor','cajero','almacenista') DEFAULT 'almacenista'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_sucursales`
--

INSERT INTO `usuarios_sucursales` (`id`, `id_usuario`, `id_sucursal`, `puesto`) VALUES
(2, 2, 1, 'almacenista'),
(3, 3, 1, NULL),
(6, 6, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `verificaciones`
--

CREATE TABLE `verificaciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `verificaciones`
--

INSERT INTO `verificaciones` (`id`, `id_usuario`, `id_orden`, `id_sucursal`, `fecha`) VALUES
(1, 2, 1, 1, '2024-07-26 00:00:00'),
(2, 2, 3, 1, '2024-07-26 00:00:00'),
(3, 2, 4, 1, '2024-07-26 00:00:00'),
(4, 2, 5, 1, '2024-08-16 00:00:00'),
(5, 2, 25, 1, '2024-08-16 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capturas`
--
ALTER TABLE `capturas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indices de la tabla `detalles_orden`
--
ALTER TABLE `detalles_orden`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos_imagenes`
--
ALTER TABLE `productos_imagenes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `productos_imagenes_ibfk_1` (`id_producto`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sucursales_productos`
--
ALTER TABLE `sucursales_productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `usuarios_sucursales`
--
ALTER TABLE `usuarios_sucursales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_sucursales_ibfk_1` (`id_usuario`),
  ADD KEY `usuarios_sucursales_ibfk_2` (`id_sucursal`);

--
-- Indices de la tabla `verificaciones`
--
ALTER TABLE `verificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capturas`
--
ALTER TABLE `capturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `detalles_orden`
--
ALTER TABLE `detalles_orden`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `ordenes`
--
ALTER TABLE `ordenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `productos_imagenes`
--
ALTER TABLE `productos_imagenes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sucursales_productos`
--
ALTER TABLE `sucursales_productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios_sucursales`
--
ALTER TABLE `usuarios_sucursales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `verificaciones`
--
ALTER TABLE `verificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `capturas`
--
ALTER TABLE `capturas`
  ADD CONSTRAINT `capturas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `capturas_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `capturas_ibfk_3` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `detalles_orden`
--
ALTER TABLE `detalles_orden`
  ADD CONSTRAINT `detalles_orden_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id`),
  ADD CONSTRAINT `detalles_orden_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `ordenes`
--
ALTER TABLE `ordenes`
  ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `productos_imagenes`
--
ALTER TABLE `productos_imagenes`
  ADD CONSTRAINT `productos_imagenes_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `sucursales_productos`
--
ALTER TABLE `sucursales_productos`
  ADD CONSTRAINT `sucursales_productos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `sucursales_productos_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`);

--
-- Filtros para la tabla `usuarios_sucursales`
--
ALTER TABLE `usuarios_sucursales`
  ADD CONSTRAINT `usuarios_sucursales_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuarios_sucursales_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `verificaciones`
--
ALTER TABLE `verificaciones`
  ADD CONSTRAINT `verificaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `verificaciones_ibfk_2` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id`),
  ADD CONSTRAINT `verificaciones_ibfk_3` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
