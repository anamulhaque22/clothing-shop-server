import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWishListEntity1732960349187 implements MigrationInterface {
    name = 'AddedWishListEntity1732960349187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wish_list" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, "productId" integer, CONSTRAINT "PK_f8e27bbb59891db7cd9f920c272" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "visibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_96ce0d79f2168b7363c3fd9adbd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wish_list" ADD CONSTRAINT "FK_7645dfa8474d2ffe8755a44045b" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_7645dfa8474d2ffe8755a44045b"`);
        await queryRunner.query(`ALTER TABLE "wish_list" DROP CONSTRAINT "FK_96ce0d79f2168b7363c3fd9adbd"`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "visibility" SET DEFAULT 'VISIBLE'`);
        await queryRunner.query(`DROP TABLE "wish_list"`);
    }

}
