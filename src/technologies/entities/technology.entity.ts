import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Vacancy } from "../../vacancies/entities/vacancy.entity";

@Entity("technologies")
export class Technology {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @ManyToMany(() => Vacancy, (vacancy) => vacancy.technologies)
  vacancies: Vacancy[];
}
