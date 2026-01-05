import { DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Vacancy } from "../vacancies/entities/vacancy.entity";
import { Application } from "../applications/entities/application.entity";
import { Technology } from "../technologies/entities/technology.entity";
import "dotenv/config";
import { join } from "path";

const migrationsGlob = [
  join(__dirname, "migrations", "*.ts"),
  join(__dirname, "migrations", "*.js"),
];

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS ?? process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME,
  entities: [User, Vacancy, Application, Technology],
  migrations: migrationsGlob,
  synchronize: false,
});

export default AppDataSource;
