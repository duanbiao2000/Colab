import CallToAction from '@/app/components/CallToAction';
import RecentPosts from '@/app/components/RecentPosts';
import { Button } from 'flowbite-react';
import Link from 'next/link';
export default async function PostPage({ params }) {
  let post = null;
  try {
    const result = await fetch(process.env.URL + '/api/post/get', {
      method: 'POST',
      // 将slug参数转换为JSON字符串
      body: JSON.stringify({ slug: params.slug }),
      cache: 'no-store',
    });
    const data = await result.json();
    post = data.posts[0];
  } catch (error) {
    post = { title: 'Failed to load post' };
  }
  if (!post || !post.title === 'Failed to load post') {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          Post not found
        </h2>
      </main>
    );
  }
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        // 如果post存在，则显示post的title
        {post && post.title}
      </h1>
      <Link
        // 跳转到搜索页面，并传递category参数
        href={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        // 按钮颜色为灰色，形状为圆形，大小为最小
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        // 如果post存在，则将post的createdAt属性转换为本地日期格式并显示
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      // 使用 dangerouslySetInnerHTML 属性将 post?.content 的内容渲染到页面上
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        // 调用 CallToAction 组件
        <CallToAction />
      </div>
      {/* 最近发布的文章，限制显示3篇 */}
      <RecentPosts limit={3} />
    </main>
  );
}
