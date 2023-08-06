import { Role } from "../enums/role.enum";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.ADMIN })
  role: string;

  @Column({ name: "phone_number", nullable: true, unique: true })
  phoneNumber: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  address3: string;

  @Column({ nullable: true })
  postcode: string;

  @Column({ nullable: true })
  town: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
