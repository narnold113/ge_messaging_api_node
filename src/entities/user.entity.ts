import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
  } from "typeorm"
  import { Length } from "class-validator"
  import bcrypt from "bcryptjs"
import { Message } from "./message.entity"

@Entity()
@Unique(["username"])
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Length(1, 100)
    firstName: string

    @Column()
    @Length(1, 100)
    lastName: string

    @Column()
    @Length(4, 20)
    username: string

    @Column()
    @Length(4, 100)
    password: string

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Message, (message) => message.fromUser)
    sentMessages: Message[]

    @OneToMany(() => Message, (message) => message.toUser)
    receivedMessages: Message[]

    checkPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }
}
