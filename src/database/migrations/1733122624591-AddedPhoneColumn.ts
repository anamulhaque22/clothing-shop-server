import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPhoneColumn1733122624591 implements MigrationInterface {
    name = 'AddedPhoneColumn1733122624591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "UQ_18512131a1ed8e3bc5fbe26ff31" UNIQUE ("userId", "productId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "UQ_18512131a1ed8e3bc5fbe26ff31"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phone"`);
    }

}
