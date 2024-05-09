import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Article } from "./Article"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    email: string

    @Column()
    fullname: string

    @Column({ nullable: true })
    age: number

    @Column()
    password: string

    @OneToMany(() => Article, (article) => article.created_by, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    })
    articles: Article[]

}
