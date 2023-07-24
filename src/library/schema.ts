import Joi from "joi";
import { IBlog, IUser } from "./types";

const joiSchema = {
  creatUser: Joi.object<IUser>({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
    age: Joi.number().min(1),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(20).required(),
  }),
  creatBlog: Joi.object<IBlog>({
    title: Joi.string().required().trim(),
    content: Joi.string().required(),
  }),
  findBlogById: Joi.object({ id: Joi.string().trim().length(24).required() }),
  updateBlog: Joi.object({
    title: Joi.string().trim(),
    content: Joi.string().required(),
  }),
};

export default joiSchema;
