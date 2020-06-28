import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOrderHistoryPrimaryColumn1590912132707 implements MigrationInterface {
    name = 'UpdateOrderHistoryPrimaryColumn1590912132707'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `dish` DROP FOREIGN KEY `FK_e57785ad0e26c456b3381bf6d8b`');
      await queryRunner.query('ALTER TABLE `dish` CHANGE `categotyId` `categotyId` varchar(36) NULL');
      await queryRunner.query('ALTER TABLE `dish` ADD CONSTRAINT `FK_e57785ad0e26c456b3381bf6d8b` FOREIGN KEY (`categotyId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `dish` DROP FOREIGN KEY `FK_e57785ad0e26c456b3381bf6d8b`');
      await queryRunner.query("ALTER TABLE `dish` CHANGE `categotyId` `categotyId` varchar(36) NULL DEFAULT 'NULL'");
      await queryRunner.query('ALTER TABLE `dish` ADD CONSTRAINT `FK_e57785ad0e26c456b3381bf6d8b` FOREIGN KEY (`categotyId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }
}
