// 引入mongoose模块
import mongoose from "mongoose";

// 初始化标志
let initialized = false;

// 连接数据库的函数
export const connect = async () => {
  // 设置mongoose的严格查询模式
  mongoose.set("strictQuery", true);
  // 如果已经连接过数据库，则直接返回
  if (initialized) {
    console.log("Already connected to MongoDB");
    return;
  }
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "next-blog",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // 连接成功后，打印连接成功的消息
    console.log("Connected to MongoDB");
    // 设置初始化标志为true
    initialized = true;
  } catch (error) {
    // 连接失败后，打印连接失败的消息
    console.log("Error connecting to MongoDB:", error);
  }
};
