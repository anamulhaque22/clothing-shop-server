import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedColorCodeCloumnToOrterItemEntity1731753175492
  implements MigrationInterface
{
  name = 'AddedColorCodeCloumnToOrterItemEntity1731753175492';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD "colorCode" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP COLUMN "colorCode"`,
    );
  }
}
