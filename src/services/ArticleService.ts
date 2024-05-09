import { AppDataSource } from "../data-source";
import { Repository, Like, FindManyOptions } from "typeorm";
import { Article } from "../entity/Article";

export default new class ArticleServices {
    private readonly ArticleRepository: Repository<Article> = AppDataSource.getRepository(Article);

    async create(data: Article): Promise<object | string> {
        try {
            const response = this.ArticleRepository.save({
                ...data,
                created_at: new Date()
            })

            return {
                message: "success creating a new article",
                data: response,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async update(id: number, data: Article, loginSession: any): Promise<object | string> {
        try {
            const oneArticle = await this.ArticleRepository.findOne({
                where: {
                    id: id
                },
                relations: ["created_by"],
                select: {
                    created_by: {
                        id: true,
                        fullname: true,
                        email: true
                    }
                }
            })

            if (oneArticle.created_by.id !== loginSession.obj.id) {
                throw new Error("Can't update someone else article")
            }

            const response = await this.ArticleRepository.update(id, data)
            return {
                message: "success updating an article",
                data: response,
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async delete(id: number, loginSession: any): Promise<object | string> {
        try {
            const oneArticle = await this.ArticleRepository.findOne({
                where: {
                    id: id
                },
                relations: ["created_by"],
                select: {
                    created_by: {
                        id: true,
                        fullname: true,
                        email: true
                    }
                }
            })

            if (oneArticle.created_by.id !== loginSession.obj.id) {
                throw new Error("Can't delete someone else article")
            }

            const response = this.ArticleRepository.delete(id)
            return {
                message: "success deleting an article",
                data: response
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAll(): Promise<object | string> {
        try {
            const response = await this.ArticleRepository.find({
                relations: ["created_by"],
                select: {
                    created_by: {
                        fullname: true,
                        email: true
                    }
                },
                order: {
                    created_at: "DESC"
                }
            })

            return response.map((data) => ({
                id: data.id,
                title: data.title,
                content: data.content,
                category: data.category,
                created_at: data.created_at,
                created_by: data.created_by
            }))
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async search(data: String, page: number, limit: number): Promise<object | string> {
        try {
            const response = await this.ArticleRepository.find({
                where: [
                    {
                        content: Like(`%${data}%`),
                    },
                    {
                        title: Like(`%${data}%`),
                    }
                ],
                relations: ["created_by"],
                select: {
                    created_by: {
                        fullname: true,
                        email: true
                    }
                },
                order: {
                    created_at: "DESC"
                },
                skip: (page - 1) * limit,
                take: limit,
            } as FindManyOptions<Article>);

            return response.map((data) => ({
                id: data.id,
                title: data.title,
                content: data.content,
                category: data.category,
                created_at: data.created_at,
                created_by: data.created_by
            }))
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async filter(category: String): Promise<object | string> {
        try {
            const article = await this.ArticleRepository.find({
                relations: ["created_by"],
                select: {
                    created_by: {
                        fullname: true,
                        email: true
                    }
                },
                order: {
                    created_at: "DESC"
                }
            })

            const response = article.filter(content => content.category === category)

            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
}