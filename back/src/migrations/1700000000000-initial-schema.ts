import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1700000000000 implements MigrationInterface {
  name = "InitialSchema1700000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tipo enum para modalidad
    await queryRunner.query(`CREATE TYPE "modality_enum" AS ENUM('ONSITE','REMOTE','HYBRID')`);

    // Tabla users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL,
        "email" character varying(150) NOT NULL,
        "password" text NOT NULL,
        "role" character varying(50) NOT NULL,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`);

    // Tabla technologies
    await queryRunner.query(`
      CREATE TABLE "technologies" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL,
        CONSTRAINT "PK_technologies_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_technologies_name" ON "technologies" ("name")`);

    // Tabla vacancies
    await queryRunner.query(`
      CREATE TABLE "vacancies" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying(150) NOT NULL,
        "description" text NOT NULL,
        "seniority" character varying(50),
        "softSkills" text,
        "location" character varying(100),
        "modality" "modality_enum" NOT NULL,
        "salaryRange" character varying(100),
        "company" character varying(150),
        "maxApplicants" integer,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_vacancies_id" PRIMARY KEY ("id")
      )
    `);

    // Tabla pivote vacancy_technologies
    await queryRunner.query(`
      CREATE TABLE "vacancy_technologies" (
        "vacancy_id" uuid NOT NULL,
        "technology_id" uuid NOT NULL,
        CONSTRAINT "PK_vacancy_technologies" PRIMARY KEY ("vacancy_id", "technology_id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "vacancy_technologies"
      ADD CONSTRAINT "FK_vacancy_technologies_vacancy" FOREIGN KEY ("vacancy_id") REFERENCES "vacancies"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "vacancy_technologies"
      ADD CONSTRAINT "FK_vacancy_technologies_technology" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE
    `);

    // Tabla applications
    await queryRunner.query(`
      CREATE TABLE "applications" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid,
        "vacancyId" uuid,
        "appliedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        CONSTRAINT "PK_applications_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "applications"
      ADD CONSTRAINT "FK_applications_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "applications"
      ADD CONSTRAINT "FK_applications_vacancy" FOREIGN KEY ("vacancyId") REFERENCES "vacancies"("id") ON DELETE CASCADE
    `);

    // Constraint unique user+vacancy on applications
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_applications_user_vacancy" ON "applications" ("userId", "vacancyId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_applications_user_vacancy"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_vacancy"`);
    await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT IF EXISTS "FK_applications_user"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "applications"`);

    await queryRunner.query(`ALTER TABLE "vacancy_technologies" DROP CONSTRAINT IF EXISTS "FK_vacancy_technologies_technology"`);
    await queryRunner.query(`ALTER TABLE "vacancy_technologies" DROP CONSTRAINT IF EXISTS "FK_vacancy_technologies_vacancy"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vacancy_technologies"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "vacancies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "technologies"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_technologies_name"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "modality_enum"`);
  }
}

