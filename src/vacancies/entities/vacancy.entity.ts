import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from "typeorm";
import { Modality } from "../../common/enums/modality.enum";
import { Technology } from "../../technologies/entities/technology.entity";
import { Application } from "../../applications/entities/application.entity";

@Entity("vacancies")
export class Vacancy {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column("text")
  description: string;

  @Column({ length: 50, nullable: true })
  seniority: string;

  @Column("text", { nullable: true })
  softSkills: string;

  @Column({ length: 100, nullable: true })
  location: string;

  @Column({
    type: "enum",
    enum: Modality,
  })
  modality: Modality;

  @Column({ length: 100, nullable: true })
  salaryRange: string;

  @Column({ length: 150, nullable: true })
  company: string;

  @Column({ type: "int", nullable: true })
  maxApplicants: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Technology, (technology) => technology.vacancies)
  @JoinTable({
    name: "vacancy_technologies",
    joinColumn: { name: "vacancy_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "technology_id", referencedColumnName: "id" },
  })
  technologies: Technology[];

  @OneToMany(() => Application, (application) => application.vacancy)
  applications: Application[];
}
