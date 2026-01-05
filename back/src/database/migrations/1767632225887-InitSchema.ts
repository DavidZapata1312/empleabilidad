import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1767632225887 implements MigrationInterface {
    name = 'InitSchema1767632225887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "technologies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, CONSTRAINT "UQ_46800813f460eb131823371caee" UNIQUE ("name"), CONSTRAINT "PK_9a97465b79568f00becacdd4e4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."vacancies_modality_enum" AS ENUM('ONSITE', 'REMOTE', 'HYBRID')`);
        await queryRunner.query(`CREATE TABLE "vacancies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(150) NOT NULL, "description" text NOT NULL, "seniority" character varying(50), "softSkills" text, "location" character varying(100), "modality" "public"."vacancies_modality_enum" NOT NULL, "salaryRange" character varying(100), "company" character varying(150), "maxApplicants" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3b45154a366568190cc15be2906" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appliedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "vacancyId" uuid, CONSTRAINT "UQ_c53ada8f86847db0cb2c0e76703" UNIQUE ("userId", "vacancyId"), CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" text NOT NULL, "role" character varying(50) NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vacancy_technologies" ("vacancy_id" uuid NOT NULL, "technology_id" uuid NOT NULL, CONSTRAINT "PK_8c4e29669ec0c501f687e6070a1" PRIMARY KEY ("vacancy_id", "technology_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13d4b002b6b5678089055eb1ef" ON "vacancy_technologies" ("vacancy_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_61c2392c216e0c360a72ba3262" ON "vacancy_technologies" ("technology_id") `);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_90ad8bec24861de0180f638b9cc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_5707a4abd8063c6494064d22d05" FOREIGN KEY ("vacancyId") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vacancy_technologies" ADD CONSTRAINT "FK_13d4b002b6b5678089055eb1ef9" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "vacancy_technologies" ADD CONSTRAINT "FK_61c2392c216e0c360a72ba3262e" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vacancy_technologies" DROP CONSTRAINT "FK_61c2392c216e0c360a72ba3262e"`);
        await queryRunner.query(`ALTER TABLE "vacancy_technologies" DROP CONSTRAINT "FK_13d4b002b6b5678089055eb1ef9"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_5707a4abd8063c6494064d22d05"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_90ad8bec24861de0180f638b9cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61c2392c216e0c360a72ba3262"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13d4b002b6b5678089055eb1ef"`);
        await queryRunner.query(`DROP TABLE "vacancy_technologies"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "vacancies"`);
        await queryRunner.query(`DROP TYPE "public"."vacancies_modality_enum"`);
        await queryRunner.query(`DROP TABLE "technologies"`);
    }

}
