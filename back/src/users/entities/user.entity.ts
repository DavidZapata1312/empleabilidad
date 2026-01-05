import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Application } from "../../applications/entities/application.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column("text")
  password: string;

  @Column({ length: 50 })
  role: string;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];
}
