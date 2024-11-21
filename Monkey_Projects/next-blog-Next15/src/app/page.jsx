import Link from 'next/link';

// 导入CallToAction组件，用于展示页面上的号召性用语部分
import CallToAction from './components/CallToAction';

// 导入RecentPosts组件，用于展示最近的帖子或文章列表
import RecentPosts from './components/RecentPosts';

// 导出一个默认的异步函数Home
export default async function Home() {
  // 声明一个变量posts，初始值为null
  let posts = null;
  // 使用try...catch语句捕获错误
  try {
    // 使用fetch函数发送POST请求，获取最新的9篇文章
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      body: JSON.stringify({ limit: 9, order: 'desc' }),
      cache: 'no-store',
    });
    // 将返回的结果转换为JSON格式
    const data = await result.json();
    // 将JSON数据中的posts赋值给posts变量
    posts = data.posts;
  } catch (error) {
    // 如果发生错误，打印错误信息
    console.log('Error getting post:', error);
  }
  // 返回一个包含文章列表的组件
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-sm sm:text-base'>
          Discover a variety of articles and tutorials on topics such as web
          development, software engineering, and programming languages, all
          brought to you through a blog built with Next.js and{' '}
          <a
            href='https://go.clerk.com/fgJHKlt'
            className='text-teal-500 hover:underline'
            target='_blank'
          >
            Clerk
          </a>
          .
        </p>
        <Link
          href='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='p-3 flex flex-col gap-8 py-7'>
        <RecentPosts limit={9} />
        <Link
          href={'/search?category=null'}
          className='text-lg text-teal-500 hover:underline text-center'
        >
          View all posts
        </Link>
      </div>
    </div>
  );
}
