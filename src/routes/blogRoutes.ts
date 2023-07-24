import { Router, Application } from "express";
import Controller from "../controllers/blogController";
import joiSchema from "../library/schema";
import validator from "../middleware/validator";
import auth from "../middleware/auth";

export class BlogRoutes {
  public router: Router;

  private BlogController: Controller = new Controller();

  constructor() {
    this.router = Router();
    this.registerRoutes();
  }

  protected registerRoutes(): void {
    this.router.use(auth);
    this.router.post(
      "/",
      validator(joiSchema.creatBlog, "body"),
      this.BlogController.createBlog
    );
    this.router.get("/", this.BlogController.getBlogs);
    this.router.get("/:id", this.BlogController.getBlogById);
    this.router.patch(
      "/update/:id",
      validator(joiSchema.updateBlog, "body"),
      this.BlogController.updateBlog
    );
    this.router.delete(
      "/delete/:id",
      validator(joiSchema.findBlogById, "params"),
      this.BlogController.deleteBlog
    );
  }
}

// Register BlogRouster in App
const Blogrouter = (server: Application): void => {
  server.use("/Blog", new BlogRoutes().router);
};

export default Blogrouter;
