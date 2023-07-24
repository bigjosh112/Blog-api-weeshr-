import { Schema, model } from "mongoose";
import { IBlog } from "../library/types";

const BlogIBlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true, strictQuery: true, strict: true }
);

const BlogIBlog = model<IBlog>("Blog", BlogIBlogSchema);

export default BlogIBlog;
