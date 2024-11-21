import Link from 'next/link';
export default function PostCard({ post }) {
  return (
    // 定义一个div，类名为group，relative表示相对定位，w-full表示宽度为100%，border表示边框，border-teal-500表示边框颜色为teal-500，hover:border-2表示鼠标悬停时边框宽度为2，h-[400px]表示高度为400px，overflow-hidden表示超出部分隐藏，rounded-lg表示圆角为lg，sm:w-[430px]表示在小屏幕上宽度为430px，transition-all表示所有属性都有过渡效果
    <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      <Link href={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          // 设置图片的类名，高度为260px，宽度为全屏，图片覆盖，鼠标悬停时高度变为200px，过渡时间为300ms，层级为20
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>
        <span className='italic text-sm'>{post.category}</span>
        <Link
          href={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}