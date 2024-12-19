import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginTS from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'
import eslintPluginSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnused from 'eslint-plugin-unused-imports'
import eslintPluginImport from 'eslint-plugin-import'

export default [
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      parser: parser,
      globals: {
        console: 'readonly',
        process: 'readonly'
      },
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': eslintPluginTS,
      prettier: eslintPluginPrettier,
      'simple-import-sort': eslintPluginSort,
      'unused-imports': eslintPluginUnused,
      import: eslintPluginImport
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'none',
          endOfLine: 'auto'
        }
      ],
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      // 'simple-import-sort/imports': 'error',
      // 'simple-import-sort/exports': 'error',
      'object-shorthand': ['error', 'always'],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'always',
          ts: 'always'
        }
      ]
    }
  }
]
