import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string

    @Column()
    category: string

    @Column()
    created_at: Date

    @ManyToOne(() => User, (user) => user.articles, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    @JoinColumn()
    created_by: User
}