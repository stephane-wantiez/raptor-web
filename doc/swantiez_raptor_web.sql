-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Dim 27 Avril 2014 à 16:52
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `raptor-web`
--
CREATE DATABASE IF NOT EXISTS `swantiez_raptor_web` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `swantiez_raptor_web`;

-- --------------------------------------------------------

--
-- Structure de la table `config`
--

DROP TABLE IF EXISTS `config`;
CREATE TABLE IF NOT EXISTS `config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `identifier` varchar(32) NOT NULL,
  `type` int(10) unsigned NOT NULL,
  `value` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

--
-- Contenu de la table `config`
--

INSERT INTO `config` (`id`, `name`, `identifier`, `type`, `value`) VALUES
(1, 'Player''s bullets speed', 'BULLET_SPEED', 1, 800),
(2, 'Delay between player''s bullets', 'BULLET_SHOOT_WAIT_TIME_MSEC', 1, 20),
(3, 'Max player speed on X', 'SPEED_X', 1, 3000),
(4, 'Max player speed on Y', 'SPEED_Y', 1, 2000),
(5, 'Max nb of shields for player', 'MAX_NB_SHIELDS', 1, 10),
(6, 'Max nb of bombs for player', 'MAX_NB_BOMBS', 1, 3),
(7, 'Collision damage on enemies', 'COLLISION_DAMAGE_ENEMY', 1, 100);

-- --------------------------------------------------------

--
-- Structure de la table `config_type`
--

DROP TABLE IF EXISTS `config_type`;
CREATE TABLE IF NOT EXISTS `config_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `identifier` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `identifier` (`identifier`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Contenu de la table `config_type`
--

INSERT INTO `config_type` (`id`, `name`, `identifier`) VALUES
(1, 'Player settings', 'PLAYER');

-- --------------------------------------------------------

--
-- Structure de la table `enemy`
--

DROP TABLE IF EXISTS `enemy`;
CREATE TABLE IF NOT EXISTS `enemy` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(10) unsigned NOT NULL,
  `level` int(10) unsigned NOT NULL,
  `pos_x` int(11) NOT NULL,
  `pos_y` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=41 ;

--
-- Contenu de la table `enemy`
--

INSERT INTO `enemy` (`id`, `type`, `level`, `pos_x`, `pos_y`) VALUES
(1, 19, 10, 400, 100),
(2, 20, 10, 500, 200),
(3, 21, 10, 200, 400),
(4, 21, 10, 400, 400),
(5, 21, 10, 600, 400),
(6, 22, 10, 200, 700),
(7, 20, 10, 250, 700),
(8, 21, 10, 300, 700),
(9, 22, 10, 100, 1000),
(10, 21, 10, 500, 1400),
(11, 22, 10, 100, 1550),
(12, 20, 10, 600, 1700),
(13, 21, 10, 200, 2000),
(14, 22, 10, 600, 2000),
(15, 20, 10, 450, 2150),
(16, 20, 10, 300, 2200),
(17, 21, 10, 100, 2400),
(18, 21, 10, 600, 2400),
(19, 22, 10, 400, 2700),
(20, 22, 10, 500, 2700),
(21, 22, 10, 600, 2700),
(22, 20, 10, 400, 3000),
(23, 21, 10, 350, 3050),
(24, 20, 10, 100, 3200),
(25, 22, 10, 600, 3400),
(26, 21, 10, 400, 3500),
(27, 20, 10, 100, 3500),
(28, 20, 10, 200, 3700),
(29, 21, 10, 400, 3700),
(30, 22, 10, 600, 3700),
(31, 20, 10, 100, 3900),
(32, 20, 10, 600, 3900),
(33, 20, 10, 400, 4000),
(34, 21, 10, 100, 4200),
(35, 20, 10, 500, 4300),
(36, 22, 10, 700, 4500),
(37, 20, 10, 200, 4700),
(38, 20, 10, 600, 4800),
(39, 21, 10, 400, 5000),
(40, 22, 10, 300, 5200);

-- --------------------------------------------------------

--
-- Structure de la table `enemy_type`
--

DROP TABLE IF EXISTS `enemy_type`;
CREATE TABLE IF NOT EXISTS `enemy_type` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `type` varchar(64) NOT NULL,
  `boss` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `type` (`type`),
  KEY `boss` (`boss`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=23 ;

--
-- Contenu de la table `enemy_type`
--

INSERT INTO `enemy_type` (`id`, `name`, `type`, `boss`) VALUES
(19, 'FlyingBoss1', 'FlyingBoss1', 1),
(20, 'FlyingEnemy1', 'FlyingEnemy1', 0),
(21, 'FlyingEnemy2', 'FlyingEnemy2', 0),
(22, 'FlyingEnemy3', 'FlyingEnemy3', 0);

-- --------------------------------------------------------

--
-- Structure de la table `level`
--

DROP TABLE IF EXISTS `level`;
CREATE TABLE IF NOT EXISTS `level` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `number` smallint(5) unsigned NOT NULL,
  `background` varchar(64) NOT NULL,
  `music_boss` varchar(64) NOT NULL,
  `music_defeat` varchar(64) NOT NULL,
  `music_fight` varchar(64) NOT NULL,
  `music_victory` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Contenu de la table `level`
--

INSERT INTO `level` (`id`, `name`, `number`, `background`, `music_boss`, `music_defeat`, `music_fight`, `music_victory`) VALUES
(10, 'LevelTest01', 1, 'background-ocean', 'music-boss1', '', 'music-battle1', 'music-victory');

-- --------------------------------------------------------

--
-- Structure de la table `score`
--

DROP TABLE IF EXISTS `score`;
CREATE TABLE IF NOT EXISTS `score` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `game_dt` int(10) unsigned NOT NULL,
  `value` int(10) unsigned NOT NULL,
  `game_done` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `game_done` (`game_done`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fb_id` int(10) unsigned NOT NULL,
  `username` varchar(32) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fb_id` (`fb_id`,`username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `config`
--
ALTER TABLE `config`
  ADD CONSTRAINT `config_ibfk_1` FOREIGN KEY (`type`) REFERENCES `config_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `enemy`
--
ALTER TABLE `enemy`
  ADD CONSTRAINT `enemy_ibfk_1` FOREIGN KEY (`type`) REFERENCES `enemy_type` (`id`),
  ADD CONSTRAINT `enemy_ibfk_2` FOREIGN KEY (`level`) REFERENCES `level` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `score`
--
ALTER TABLE `score`
  ADD CONSTRAINT `score_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;