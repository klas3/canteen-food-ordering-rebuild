import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderHistoryRelation1590913462052 implements MigrationInterface {
    name = 'AddOrderHistoryRelation1590913462052'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `dish` DROP FOREIGN KEY `FK_e57785ad0e26c456b3381bf6d8b`');
      await queryRunner.query('ALTER TABLE `dish` CHANGE `categotyId` `categotyId` varchar(36) NULL');
      await queryRunner.query('ALTER TABLE `ordered_dish_history` DROP FOREIGN KEY `FK_2cc4854c6f39c239782a6b0b589`');
      await queryRunner.query('ALTER TABLE `dish` ADD CONSTRAINT `FK_e57785ad0e26c456b3381bf6d8b` FOREIGN KEY (`categotyId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
      await queryRunner.query('ALTER TABLE `ordered_dish_history` ADD CONSTRAINT `FK_2cc4854c6f39c239782a6b0b589` FOREIGN KEY (`orderHistoryId`) REFERENCES `order_history`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE `ordered_dish_history` DROP FOREIGN KEY `FK_2cc4854c6f39c239782a6b0b589`');
      await queryRunner.query('ALTER TABLE `dish` DROP FOREIGN KEY `FK_e57785ad0e26c456b3381bf6d8b`');
      await queryRunner.query('ALTER TABLE `ordered_dish_history` ADD CONSTRAINT `FK_2cc4854c6f39c239782a6b0b589` FOREIGN KEY (`orderHistoryId`) REFERENCES `order_history`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
      await queryRunner.query("ALTER TABLE `dish` CHANGE `categotyId` `categotyId` varchar(36) NULL DEFAULT 'NULL'");
      await queryRunner.query('ALTER TABLE `dish` ADD CONSTRAINT `FK_e57785ad0e26c456b3381bf6d8b` FOREIGN KEY (`categotyId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION');
    }
}
