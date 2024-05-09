import * as Joi from "joi";

export const articleSchema = Joi.object({
    title: Joi.string().max(250).required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
})