// 引入mongoose模块
import mongoose from "mongoose";
// 创建postSchema对象
const postSchema = new mongoose.Schema(
  {
    // 用户ID
    userId: {
      type: String,
      required: true,
    },
    // 内容
    content: {
      type: String,
      required: true,
    },
    // 标题
    title: {
      type: String,
      required: true,
      unique: true,
    },
    // 图片
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    // 分类
    category: {
      type: String,
      default: "uncategorized",
    },
    // slug
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);
// 创建Post模型
const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
// 导出Post模型
export default Post;
