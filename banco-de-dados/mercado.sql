-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 12/12/2024 às 01:18
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `mercado`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `mercado`
--

CREATE TABLE `mercado` (
  `id` int(11) NOT NULL,
  `produto` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `estoque` int(11) NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `mercado`
--

INSERT INTO `mercado` (`id`, `produto`, `descricao`, `estoque`, `preco`, `imagem`) VALUES
(36, '1', 'Picanha', 500, 69.90, '/uploads/1733781282438-1731649092345-file.png'),
(37, '2', 'Maça do Amor', 463, 3.99, '/uploads/1733781383677-1730329503814-png-transparent-red-apple-fruit-apple-red-delicious-eating-fuji-large-green-leaves-red-apple-natural-foods-watercolor-leaves-food.png');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `mercado`
--
ALTER TABLE `mercado`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `mercado`
--
ALTER TABLE `mercado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
