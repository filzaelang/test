import * as express from "express";
import AuthController from "../controllers/AuthController";
import ArticleController from "../controllers/ArticleController";
import AuthMidlewares from "../middlewares/AuthMidlewares";

const router = express.Router();

//Auth
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

//Article
router.post("/article/create", AuthMidlewares.Auth, ArticleController.create)
router.patch("/article/update/:id", AuthMidlewares.Auth, ArticleController.update)
router.delete("/article/delete/:id", AuthMidlewares.Auth, ArticleController.delete)
router.get("/article", ArticleController.getAll)
router.post("/article/search", ArticleController.search)
router.post("/article/filter", ArticleController.filter)

export default router;