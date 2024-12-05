import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductVisibilityEnumUpdated1731997340566
  implements MigrationInterface
{
  name = 'ProductVisibilityEnumUpdated1731997340566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TYPE "public"."product_visibility_enum" RENAME TO "product_visibility_enum_old"`,
    // );
    await queryRunner.query(
      `CREATE TYPE "public"."product_visibility_enum" AS ENUM('VISIBLE', 'HIDDEN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "visibility" TYPE "public"."product_visibility_enum" USING "visibility"::"text"::"public"."product_visibility_enum"`,
    );
    // await queryRunner.query(`DROP TYPE "public"."product_visibility_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `CREATE TYPE "public"."product_visibility_enum_old" AS ENUM('Hidden', 'Visible')`,
    // );
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "visibility" TYPE "public"."product_visibility_enum_old" USING "visibility"::"text"::"public"."product_visibility_enum_old"`,
    );
    // await queryRunner.query(`DROP TYPE "public"."product_visibility_enum"`);
    // await queryRunner.query(
    //   `ALTER TYPE "public"."product_visibility_enum_old" RENAME TO "product_visibility_enum"`,
    // );
  }
}
