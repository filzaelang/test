import { Request, Response } from "express";
import ArticleService from "../services/ArticleService";
import { articleSchema } from "../utils/validator/ArticleValidator";

export default new class ArticleController {
    async create(req: Request, res: Response) {
        try {
            const loginSession = res.locals.loginSession
            const data = {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
            };

            const { error, value } = articleSchema.validate(data);
            if (error) return res.status(400).json(error);
            value.created_by = loginSession.obj.id;

            const response = await ArticleService.create(value);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error creating an article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid ID provided",
                    error: "Invalid input for type number",
                });
            }

            const data = req.body;
            const loginSession = res.locals.loginSession;
            const response = await ArticleService.update(id, data, loginSession);
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error updating an article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({
                    message: "Invalid ID provided",
                    error: "Invalid input for type number",
                });
            }

            const loginSession = res.locals.loginSession;
            const response = await ArticleService.delete(id, loginSession)
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error deleting an article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const response = await ArticleService.getAll()
            return res.status(200).json(response)
        } catch (error) {
            console.error("Error getting all article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async search(req: Request, res: Response) {
        try {
            const data = req.body.keyword
            const page = req.body.page ? Number(req.body.page) : 1;
            const limit = req.body.limit ? Number(req.body.limit) : 2;

            const response = await ArticleService.search(data, page, limit)
            return res.status(200).json(response)
        } catch (error) {
            console.error("Error searching article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async filter(req: Request, res: Response) {
        try {
            const data = req.body.category
            const response = await ArticleService.filter(data)
            return res.status(200).json(response)
        } catch (error) {
            console.error("Error filtering article", error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
}