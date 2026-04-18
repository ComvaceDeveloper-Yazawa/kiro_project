import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // TypeScript all ルールを有効化
      ...tseslint.configs["eslint-recommended"].rules,
      ...tseslint.configs["recommended"].rules,
      ...tseslint.configs["recommended-type-checked"].rules,
      ...tseslint.configs["strict"].rules,
      ...tseslint.configs["strict-type-checked"].rules,
      ...tseslint.configs["stylistic-type-checked"].rules,

      // shared は pure な型・スキーマのみなので console 禁止
      "no-console": "error",

      // any 禁止（shared では型安全が最重要）
      "@typescript-eslint/no-explicit-any": "error",

      // Prettier との競合ルールを無効化
      ...prettier.rules,
    },
  },
  {
    // テストファイルは型チェック付きルールを緩める
    files: ["src/**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"],
  },
];
