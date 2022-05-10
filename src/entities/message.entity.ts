import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Relation
  } from "typeorm"
import { Length } from "class-validator"
import { User } from "./user.entity"


@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, { nullable: false})
    @JoinColumn()
    fromUser: Relation<User>

    @ManyToOne(() => User, { nullable: false})
    @JoinColumn()
    toUser: Relation<User>

    @Column()
    @Length(1, 500)
    messageBody: string

    @Column('boolean', { default: false })
    isRead: boolean

    @Column()
    @CreateDateColumn()
    createdAt: Date

    @Column()
    @UpdateDateColumn()
    updatedAt: Date
}
