
DROP TABLE `kynlwebdb`.`userinfo`;

CREATE TABLE `kynlwebdb`.`userinfo` (
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(50) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `permission` INT NOT NULL,
  `token` VARCHAR(50),
  `lastlogin` DATETIME,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE);

INSERT INTO `kynlwebdb`.`userinfo` (`username`, `password`, `name`, `email`, `phone`, `permission`) VALUES ('vietkynl', '123456', 'Viet Kynl', 'vietkynl123@gmail.com', '0123456789', '1');
INSERT INTO `kynlwebdb`.`userinfo` (`username`, `password`, `name`, `email`, `phone`, `permission`) VALUES ('admin', '123456', 'Admin', 'admin@gmail.com', '0123456', '1');
INSERT INTO `kynlwebdb`.`userinfo` (`username`, `password`, `name`, `email`, `phone`, `permission`) VALUES ('testuser', '123456', 'Nguyen Van An', 'nguyevanan001@gmail.com', '0123456789', '2');

DROP TABLE `kynlwebdb`.`loginhistory`;

CREATE TABLE `kynlwebdb`.`loginhistory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `type` TINYINT NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `ip` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`));
