module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:tailwindcss/recommended", "prettier"],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
  settings: {
    tailwindcss: {
    },
  },
};
