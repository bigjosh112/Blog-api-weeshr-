import { RequestHandler } from "express";
import AppError from "../library/service";
import { IBlog, responseStatusCodes } from "../library/types";
import Blog from "../models/blogModel";
import validObjectId from "../middleware/validId";
import { IMatch } from "../library/types";

class Controller {
  public createBlog: RequestHandler = async (req, res, next) => {
    try {
      const newBlog = await Blog.create({ ...req.body, author: req.user?._id });
      res.status(201).json({
        STATUS: "SUCCESS",
        MESSAGE: "Blog Created successfully",
        BLOG: newBlog,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBlogs: RequestHandler = async (req, res, next) => {
    const match = {} as IMatch;
    const sort: any = {};

    //if (req.query.completed) match.completed = req.query.completed === "true";
    if (req.query.sortBy) {
      const splitted = (req.query.sortBy as string).split(":");
      sort[splitted[0]] = splitted[1] === "desc" ? -1 : 1;
    }
    try {
      await req.user?.populate({
        path: "blogs",
        match,
        options: {
          limit: parseInt(req.query.limit as string),
          skip: parseInt(req.query.skip as string),
          sort,
        },
      });
      const blogs = req.user?.blogs as IBlog[];
      if (blogs.length === 0)
        throw new AppError({
          message: "No Blog found",
          statusCode: responseStatusCodes.NOT_FOUND,
        });
      res.status(200).json({
        STATUS: "SUCCESS",
        MASSAGE: "Blog retrieved",
        BlogS: blogs,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBlogById: RequestHandler = async (req, res, next) => {
    try {
      const _id = req.params.id;
      if (!validObjectId(_id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const blog = await Blog.findOne({ _id, author: req.user?._id });
      if (!blog)
        throw new AppError({
          message: "Blog does not exist",
          statusCode: responseStatusCodes.NOT_FOUND,
        });

      res.status(200).json({
        STATUS: "SUCCESS",
        MESSAGE: "Retrieved Blog successfully",
        Blog: blog,
      });
    } catch (error) {
      next(error);
    }
  };
  public updateBlog: RequestHandler = async (req, res, next) => {
    try {
      const updates = Object.keys(req.body);
      if (updates.length === 0)
        throw new AppError({
          message: "Invalid Update",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const allowedUpdated = ["title", "content"];
      const isValidOperation = updates.every((update) =>
        allowedUpdated.includes(update)
      );
      if (!isValidOperation)
        throw new AppError({
          message: "Invalid Updates",
          statusCode: responseStatusCodes.UNPROCESSABLE,
        });
      const _id = req.params.id;
      if (!validObjectId(_id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const blog: any = await Blog.findById({ _id, author: req.user?._id });
      if (!blog)
        throw new AppError({
          message: "Invalid Update",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });

      updates.forEach((update) => (blog[update] = req.body[update]));
      await blog.save();
      res.status(200).send(blog);
    } catch (error) {
      next(error);
    }
  };
  public deleteBlog: RequestHandler = async (req, res, next) => {
    try {
      const _id = req.params.id;
      if (!validObjectId(_id))
        throw new AppError({
          message: "Invalid Id",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      const blog = await Blog.findOneAndDelete({ _id, author: req.user?._id });
      if (!blog)
        throw new AppError({
          message: "Invalid Request",
          statusCode: responseStatusCodes.BAD_REQUEST,
        });
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  };
}

export default Controller;
