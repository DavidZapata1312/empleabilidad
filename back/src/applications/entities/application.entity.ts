import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";

@Entity("applications")
@Unique(["user", "vacancy"])
export class Application {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.applications, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.applications, {
    onDelete: "CASCADE",
  })
  vacancy: Vacancy;

  @CreateDateColumn()
  appliedAt: Date;
}
