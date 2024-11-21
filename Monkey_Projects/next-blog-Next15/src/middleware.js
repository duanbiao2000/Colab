// 导入Clerk的中间件和路由匹配器
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 创建一个匹配器，用于识别受保护的路由
// 这里匹配的是以'/dashboard'开头的路由
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

// 使用Clerk的中间件来保护路由
// 如果用户未登录且尝试访问受保护的路由，则重定向到登录页面
export default clerkMiddleware(async (auth, req) => {
  // 获取当前用户ID
  const { userId } = await auth();
  // 如果用户未登录且尝试访问受保护的路由，则重定向到登录页面
  if (!userId && isProtectedRoute(req)) {
    return auth().redirectToSignIn();
  }
});

// 配置中间件的匹配规则
export const config = {
  matcher: [
    // 跳过Next.js内部文件和所有静态文件，除非它们出现在查询参数中
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 总是运行API路由
    '/(api|trpc)(.*)',
  ],
};