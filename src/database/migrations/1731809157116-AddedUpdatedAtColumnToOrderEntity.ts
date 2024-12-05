import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedUpdatedAtColumnToOrderEntity1731809157116 implements MigrationInterface {
    name = 'AddedUpdatedAtColumnToOrderEntity1731809157116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "colorCode" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "colorCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "updatedAt"`);
    }

}
