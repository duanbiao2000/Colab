import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 指定需要使用 Tailwind CSS 的文件路径
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // 使用 flowbite 提供的内容
    flowbite.content(),
  ],
  theme: {
    extend: {
      // 扩展 Tailwind CSS 的颜色
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  // 使用 flowbite 提供的插件
  plugins: [flowbite.plugin()],
};
