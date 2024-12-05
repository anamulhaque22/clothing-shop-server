import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1731387557803 implements MigrationInterface {
  name = 'FirstMigration1731387557803';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "streetAddress" character varying NOT NULL, "aptSuiteUnit" character varying, "city" character varying NOT NULL, "phone" character varying NOT NULL, "addressType" "public"."addresses_addresstype_enum" NOT NULL DEFAULT 'HOME', "isDefaultShipping" boolean NOT NULL DEFAULT false, "isDefaultBilling" boolean NOT NULL DEFAULT false, "isOrderAddress" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
    );
    // await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2509e5e31bc44cbead275af8a8" ON "addresses" ("userId", "isDefaultShipping") WHERE isDefaultShipping = true`);
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_820a4c09ddad44884a97378d336" FOREIGN KEY ("billingAddressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d" FOREIGN KEY ("shippingAddressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_cc4e4adab232e8c05026b2f345d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_820a4c09ddad44884a97378d336"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2509e5e31bc44cbead275af8a8"`,
    );
    await queryRunner.query(`DROP TABLE "addresses"`);
  }
}
