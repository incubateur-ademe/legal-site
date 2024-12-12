// @ts-check

// import eslint from "@eslint/js";
// import tseslint from "typescript-eslint";
// import cwv from "eslint-config-next";

const nextFiles = [
  "page",
  "head",
  "error",
  "template",
  "layout",
  "route",
  "loading",
  "opengraph-image",
  "twitter-image",
  "not-found",
  "default",
  "icon",
  "apple-icon",
  "sitemap",
  "robots",
].join("|");

// TODO: switch to flat config
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    // default rules for import
    "plugin:import/recommended",
    // include prettier config which avoid conflict
    "prettier",
    // disable conflicting rules with plugin (not config!)
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier", "unused-imports", "simple-import-sort", "lodash"],
  ignorePatterns: ["!**/.*.js?(x)", "node_modules"],
  settings: {
    "import/resolver": {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": ["error", ["src/app", "src/pages"]],
    "react-hooks/rules-of-hooks": "error", // Vérifie les règles des Hooks
    "react-hooks/exhaustive-deps": "warn", // Vérifie les tableaux de dépendances
    "react/no-unescaped-entities": [
      "error",
      {
        forbid: [">", "}"],
      },
    ],
    // Enable only for CSP inline-style
    // "react/forbid-component-props": [
    //   "error",
    //   {
    //     forbid: [
    //       {
    //         propName: "style",
    //         message: "Utiliser className à la place de style (react-dsfr ou global.css).",
    //       },
    //     ],
    //   },
    // ],
    // "react/forbid-dom-props": [
    //   "error",
    //   {
    //     forbid: [
    //       {
    //         propName: "style",
    //         message: "Utiliser className à la place de style (react-dsfr ou global.css).",
    //       },
    //     ],
    //   },
    // ],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: 'Import "React" par défaut déjà géré par Next.',
          },
        ],
      },
    ],
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/order": "off",
    "import/no-default-export": "error",
    "import/no-extraneous-dependencies": "off",
    "import/no-internal-modules": "off",
    "import/newline-after-import": "error",
    "import/export": "off",
    "import/no-useless-path-segments": "warn",
    "import/no-absolute-path": "warn",
    "import/no-named-as-default": "off",
    "import/consistent-type-specifier-style": ["error", "prefer-inline"],
    "import/no-duplicates": [
      "error",
      {
        "prefer-inline": true,
      },
    ],
    "sort-import": "off",
    "lodash/import-scope": ["error", "member"],
    "prettier/prettier": [
      "error",
      {
        tabWidth: 2,
        trailingComma: "all",
        printWidth: 120,
        singleQuote: false,
        parser: "typescript",
        arrowParens: "avoid",
      },
    ],
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint", "typescript-sort-keys"],
      rules: {
        "import/named": "off",
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": [
          "error",
          {
            default: "array-simple",
          },
        ],
        "no-restricted-imports": "off",
        "@typescript-eslint/no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "react",
                importNames: ["default"],
                message: 'Import "React" par défaut déjà géré par Next.',
                allowTypeImports: true,
              },
            ],
          },
        ],
        "@typescript-eslint/ban-ts-comment": "error",
        "@typescript-eslint/no-unused-vars": "off",
        "typescript-sort-keys/interface": "error",
        "typescript-sort-keys/string-enum": "error",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/explicit-member-accessibility": [
          "error",
          {
            accessibility: "explicit",
            overrides: {
              accessors: "no-public",
              constructors: "no-public",
            },
          },
        ],
        "@typescript-eslint/member-delimiter-style": [
          "off",
          {
            multiline: {
              delimiter: "none",
              requireLast: true,
            },
            singleline: {
              delimiter: "semi",
              requireLast: false,
            },
          },
        ],
        "@typescript-eslint/consistent-type-imports": [
          "error",
          {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
            disallowTypeAnnotations: false,
          },
        ],
        "@typescript-eslint/sort-type-constituents": "warn",
      },
    },
    {
      files: ["src/pages/**/*.ts?(x)", `src/app/**/+(${nextFiles}).ts?(x)`, "next.config.mjs"],
      rules: {
        "import/no-default-export": "off",
      },
    },
    {
      files: ["scripts/**/*.ts"],
      parserOptions: {
        project: "./scripts/tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
