import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1715182154595 implements MigrationInterface {
    name = 'MyMigration1715182154595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "fullname" character varying NOT NULL, "age" integer NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "article" ("id" SERIAL NOT NULL, "Title" character varying NOT NULL, "Content" character varying NOT NULL, "Category" character varying NOT NULL, CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "article"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
