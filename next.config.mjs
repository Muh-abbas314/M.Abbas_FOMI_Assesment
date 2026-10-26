/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // Tailwind runs on global stylesheets only. `*.module.css` files keep Next's
      // built-in CSS Modules handling; routing them through `as: '*.css'` would turn
      // them into global CSS and their class names would come back empty.
      '*.css': {
        condition: { not: { path: /\.module\.css$/ } },
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
