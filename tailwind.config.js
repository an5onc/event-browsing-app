/**
 * Tailwind CSS configuration file.  The `content` array tells Tailwind
 * where to look for class names so that it can remove unused styles in
 * production builds.  Extend the `theme` property to customize your
 * design system (e.g. add colors, fonts, spacing, etc.).  Plugins can
 * be registered in the `plugins` array as your project grows.
 */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};