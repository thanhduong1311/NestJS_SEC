import { MigrationInterface, QueryRunner } from "typeorm";

export class EditTable1721994770429 implements MigrationInterface {
    name = 'EditTable1721994770429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`questionType\` (\`id\` int NOT NULL AUTO_INCREMENT, \`typeName\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answerBank\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`isCorrect\` tinyint NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`questionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`questionBank\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` mediumtext NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`questionTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`skill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`skillName\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`part\` (\`id\` int NOT NULL AUTO_INCREMENT, \`partName\` varchar(255) NOT NULL, \`data\` varchar(255) NOT NULL, \`index\` int NOT NULL, \`description\` longtext NULL, \`file\` mediumtext NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`skillId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`testQuestion\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`testId\` int NULL, \`questionId\` int NULL, \`typeId\` int NULL, \`partId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT 'Admin', \`email\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` mediumtext NULL, \`status\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL DEFAULT 'ENG', \`theme\` varchar(255) NOT NULL DEFAULT 'LIGHT', \`refreshToken\` mediumtext NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), UNIQUE INDEX \`IDX_5e568e001f9d1b91f67815c580\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`date\` varchar(255) NOT NULL, \`isAttended\` tinyint NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`classesId\` int NULL, \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`studentInClass\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`studentId\` int NULL, \`classesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`answerRecord\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startTime\` varchar(255) NOT NULL, \`endTime\` varchar(255) NOT NULL, \`record\` longtext NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classSchedule\` (\`id\` int NOT NULL AUTO_INCREMENT, \`sectionDate\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`courseId\` int NULL, \`classesId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` int NOT NULL AUTO_INCREMENT, \`courseName\` varchar(255) NOT NULL, \`description\` text NULL, \`numberOfLesson\` int NOT NULL, \`startDate\` varchar(255) NOT NULL, \`endDate\` varchar(255) NOT NULL, \`createBy\` varchar(255) NOT NULL, \`updateBy\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`courseResult\` (\`id\` int NOT NULL AUTO_INCREMENT, \`result\` tinyint NOT NULL, \`mark\` int NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`courseId\` int NULL, \`studentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`student\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`address\` text NULL, \`avatar\` mediumtext NULL, \`dob\` varchar(255) NULL, \`status\` varchar(255) NOT NULL, \`language\` varchar(255) NOT NULL DEFAULT 'ENG', \`theme\` varchar(255) NOT NULL DEFAULT 'LIGHT', \`refreshToken\` mediumtext NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_a56c051c91dbe1068ad683f536\` (\`email\`), UNIQUE INDEX \`IDX_bdd296b786640a32e5b7b0966b\` (\`phone\`), UNIQUE INDEX \`IDX_cdf9742519b09580df0bc13cb1\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`roleName\` mediumtext NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teacher\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`address\` text NULL, \`avatar\` mediumtext NULL, \`dob\` varchar(255) NULL, \`language\` varchar(255) NOT NULL DEFAULT 'ENG', \`theme\` varchar(255) NOT NULL DEFAULT 'LIGHT', \`refreshToken\` mediumtext NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`roleId\` int NULL, UNIQUE INDEX \`IDX_00634394dce7677d531749ed8e\` (\`email\`), UNIQUE INDEX \`IDX_c9f1edd58b17e8890bdb3aebe8\` (\`phone\`), UNIQUE INDEX \`IDX_76fd0cda3fc6719d3109237c72\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`className\` varchar(255) NOT NULL, \`enrollerCount\` int NOT NULL, \`createBy\` varchar(255) NOT NULL, \`updateBy\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`teacherId\` int NULL, \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`testSchedule\` (\`id\` int NOT NULL AUTO_INCREMENT, \`startDate\` varchar(255) NOT NULL, \`endDate\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`classId\` int NULL, \`testId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`test\` (\`id\` int NOT NULL AUTO_INCREMENT, \`testName\` varchar(255) NOT NULL, \`createBy\` varchar(255) NOT NULL, \`updateBy\` varchar(255) NOT NULL, \`totalTime\` int NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, \`typeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`typeOfTest\` (\`id\` int NOT NULL AUTO_INCREMENT, \`typeName\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`updateAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`deleteAt\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`emailToken\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` mediumtext NOT NULL, \`createAt\` varchar(255) NOT NULL DEFAULT '2024-07-26 18:52', \`expiresAt\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_2e0d6de707a858bfd7610492df\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`answerBank\` ADD CONSTRAINT \`FK_e90b582bfb57086073b84a257f0\` FOREIGN KEY (\`questionId\`) REFERENCES \`questionBank\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`questionBank\` ADD CONSTRAINT \`FK_fb16876d1d8ac6b42d4036d5eeb\` FOREIGN KEY (\`questionTypeId\`) REFERENCES \`questionType\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`part\` ADD CONSTRAINT \`FK_67664246390699f5ac1f244d85a\` FOREIGN KEY (\`skillId\`) REFERENCES \`skill\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` ADD CONSTRAINT \`FK_cfb70bafbd1164d557504d258fc\` FOREIGN KEY (\`testId\`) REFERENCES \`test\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` ADD CONSTRAINT \`FK_c4f5f475b793fa049c6977b2cb8\` FOREIGN KEY (\`questionId\`) REFERENCES \`questionBank\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` ADD CONSTRAINT \`FK_61e91a2e769aa753034984e1c65\` FOREIGN KEY (\`typeId\`) REFERENCES \`questionType\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` ADD CONSTRAINT \`FK_21ae51991ebae1ab8c175067642\` FOREIGN KEY (\`partId\`) REFERENCES \`part\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_446fb0cc55eed0065ececcc889b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_8d0d4fbe9b41fd0ddb20fb495e3\` FOREIGN KEY (\`classesId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`attendance\` ADD CONSTRAINT \`FK_120e1c6edcec4f8221f467c8039\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`studentInClass\` ADD CONSTRAINT \`FK_f4a4af0e32455c657b52b66b8e9\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`studentInClass\` ADD CONSTRAINT \`FK_bc8ccf1ddfd7974caa230dc258c\` FOREIGN KEY (\`classesId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`answerRecord\` ADD CONSTRAINT \`FK_26a4ed8d9ffe19cf559ef12c90a\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classSchedule\` ADD CONSTRAINT \`FK_4a3b3524b5d77b0268bbf579be6\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classSchedule\` ADD CONSTRAINT \`FK_516c7c302cfbb9aa7e26ca3b7a5\` FOREIGN KEY (\`classesId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courseResult\` ADD CONSTRAINT \`FK_00dcca2eb318d6adeeb5f4f8715\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`courseResult\` ADD CONSTRAINT \`FK_429912d3bd5b33d6944187a000c\` FOREIGN KEY (\`studentId\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`student\` ADD CONSTRAINT \`FK_42fa4c1daf11ce528801878e72b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teacher\` ADD CONSTRAINT \`FK_3f03b411b573dacbc2f03a74e85\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_4b7ac7a7eb91f3e04229c7c0b6f\` FOREIGN KEY (\`teacherId\`) REFERENCES \`teacher\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_91fb6af6df84c442e4a15b17609\` FOREIGN KEY (\`courseId\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testSchedule\` ADD CONSTRAINT \`FK_1616220707f4deb7bfed26f9a3f\` FOREIGN KEY (\`classId\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`testSchedule\` ADD CONSTRAINT \`FK_4041c6d74e79a161a2700ea81f0\` FOREIGN KEY (\`testId\`) REFERENCES \`test\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`test\` ADD CONSTRAINT \`FK_2460c830c61ca98efab596e101d\` FOREIGN KEY (\`typeId\`) REFERENCES \`typeOfTest\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`test\` DROP FOREIGN KEY \`FK_2460c830c61ca98efab596e101d\``);
        await queryRunner.query(`ALTER TABLE \`testSchedule\` DROP FOREIGN KEY \`FK_4041c6d74e79a161a2700ea81f0\``);
        await queryRunner.query(`ALTER TABLE \`testSchedule\` DROP FOREIGN KEY \`FK_1616220707f4deb7bfed26f9a3f\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_91fb6af6df84c442e4a15b17609\``);
        await queryRunner.query(`ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_4b7ac7a7eb91f3e04229c7c0b6f\``);
        await queryRunner.query(`ALTER TABLE \`teacher\` DROP FOREIGN KEY \`FK_3f03b411b573dacbc2f03a74e85\``);
        await queryRunner.query(`ALTER TABLE \`student\` DROP FOREIGN KEY \`FK_42fa4c1daf11ce528801878e72b\``);
        await queryRunner.query(`ALTER TABLE \`courseResult\` DROP FOREIGN KEY \`FK_429912d3bd5b33d6944187a000c\``);
        await queryRunner.query(`ALTER TABLE \`courseResult\` DROP FOREIGN KEY \`FK_00dcca2eb318d6adeeb5f4f8715\``);
        await queryRunner.query(`ALTER TABLE \`classSchedule\` DROP FOREIGN KEY \`FK_516c7c302cfbb9aa7e26ca3b7a5\``);
        await queryRunner.query(`ALTER TABLE \`classSchedule\` DROP FOREIGN KEY \`FK_4a3b3524b5d77b0268bbf579be6\``);
        await queryRunner.query(`ALTER TABLE \`answerRecord\` DROP FOREIGN KEY \`FK_26a4ed8d9ffe19cf559ef12c90a\``);
        await queryRunner.query(`ALTER TABLE \`studentInClass\` DROP FOREIGN KEY \`FK_bc8ccf1ddfd7974caa230dc258c\``);
        await queryRunner.query(`ALTER TABLE \`studentInClass\` DROP FOREIGN KEY \`FK_f4a4af0e32455c657b52b66b8e9\``);
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_120e1c6edcec4f8221f467c8039\``);
        await queryRunner.query(`ALTER TABLE \`attendance\` DROP FOREIGN KEY \`FK_8d0d4fbe9b41fd0ddb20fb495e3\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_446fb0cc55eed0065ececcc889b\``);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` DROP FOREIGN KEY \`FK_21ae51991ebae1ab8c175067642\``);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` DROP FOREIGN KEY \`FK_61e91a2e769aa753034984e1c65\``);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` DROP FOREIGN KEY \`FK_c4f5f475b793fa049c6977b2cb8\``);
        await queryRunner.query(`ALTER TABLE \`testQuestion\` DROP FOREIGN KEY \`FK_cfb70bafbd1164d557504d258fc\``);
        await queryRunner.query(`ALTER TABLE \`part\` DROP FOREIGN KEY \`FK_67664246390699f5ac1f244d85a\``);
        await queryRunner.query(`ALTER TABLE \`questionBank\` DROP FOREIGN KEY \`FK_fb16876d1d8ac6b42d4036d5eeb\``);
        await queryRunner.query(`ALTER TABLE \`answerBank\` DROP FOREIGN KEY \`FK_e90b582bfb57086073b84a257f0\``);
        await queryRunner.query(`DROP INDEX \`IDX_2e0d6de707a858bfd7610492df\` ON \`emailToken\``);
        await queryRunner.query(`DROP TABLE \`emailToken\``);
        await queryRunner.query(`DROP TABLE \`typeOfTest\``);
        await queryRunner.query(`DROP TABLE \`test\``);
        await queryRunner.query(`DROP TABLE \`testSchedule\``);
        await queryRunner.query(`DROP TABLE \`classes\``);
        await queryRunner.query(`DROP INDEX \`IDX_76fd0cda3fc6719d3109237c72\` ON \`teacher\``);
        await queryRunner.query(`DROP INDEX \`IDX_c9f1edd58b17e8890bdb3aebe8\` ON \`teacher\``);
        await queryRunner.query(`DROP INDEX \`IDX_00634394dce7677d531749ed8e\` ON \`teacher\``);
        await queryRunner.query(`DROP TABLE \`teacher\``);
        await queryRunner.query(`DROP TABLE \`role\``);
        await queryRunner.query(`DROP INDEX \`IDX_cdf9742519b09580df0bc13cb1\` ON \`student\``);
        await queryRunner.query(`DROP INDEX \`IDX_bdd296b786640a32e5b7b0966b\` ON \`student\``);
        await queryRunner.query(`DROP INDEX \`IDX_a56c051c91dbe1068ad683f536\` ON \`student\``);
        await queryRunner.query(`DROP TABLE \`student\``);
        await queryRunner.query(`DROP TABLE \`courseResult\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`classSchedule\``);
        await queryRunner.query(`DROP TABLE \`answerRecord\``);
        await queryRunner.query(`DROP TABLE \`studentInClass\``);
        await queryRunner.query(`DROP TABLE \`attendance\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e568e001f9d1b91f67815c580\` ON \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP TABLE \`testQuestion\``);
        await queryRunner.query(`DROP TABLE \`part\``);
        await queryRunner.query(`DROP TABLE \`skill\``);
        await queryRunner.query(`DROP TABLE \`questionBank\``);
        await queryRunner.query(`DROP TABLE \`answerBank\``);
        await queryRunner.query(`DROP TABLE \`questionType\``);
    }

}
