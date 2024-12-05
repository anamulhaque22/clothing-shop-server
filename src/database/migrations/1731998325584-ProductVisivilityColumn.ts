import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductVisivilityColumn1731998325584
  implements MigrationInterface
{
  name = 'ProductVisivilityColumn1731998325584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "visibility" "public"."product_visibility_enum" NOT NULL DEFAULT 'VISIBLE'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "visibility"`);
  }
}
