CREATE DATABASE IF NOT EXISTS `kynlwebdb`;

DROP TABLE IF EXISTS `kynlwebdb`.`userinfo`;

CREATE TABLE `kynlwebdb`.`userinfo` (
  `firstname` VARCHAR(50) NOT NULL,
  `lastname` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `birthday` DATE NOT NULL,
  `permission` INT NOT NULL,
  `token` VARCHAR(50),
  `lastlogin` DATETIME,
  PRIMARY KEY (`email`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);

INSERT INTO `kynlwebdb`.`userinfo` (`firstname`, `lastname`, `email`, `password`, `phone`, `birthday`, `permission`) VALUES ('Viet', 'Kynl', 'vietkynl@gmail.com', '123456', '0869333444', '1999-01-01', '1');
INSERT INTO `kynlwebdb`.`userinfo` (`firstname`, `lastname`, `email`, `password`, `phone`, `birthday`, `permission`) VALUES ('Admin', 'System', 'admin@gmail.com', '123456', '0869123123', '1999-01-01', '1');

DROP TABLE IF EXISTS `kynlwebdb`.`loginhistory`;

CREATE TABLE `kynlwebdb`.`loginhistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `type` TINYINT NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `ip` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id`));

DROP TABLE IF EXISTS `kynlwebdb`.`event`;

CREATE TABLE `kynlwebdb`.`event` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `type` TINYINT NOT NULL,
  `data` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`));

DROP TABLE IF EXISTS `kynlwebdb`.`setting`;

CREATE TABLE `kynlwebdb`.`setting` (
  `autoconnect` TINYINT,
  `serialport` VARCHAR(10));

INSERT INTO `kynlwebdb`.`setting` (`autoconnect`) VALUES ('0');
