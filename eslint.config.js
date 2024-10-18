// eslint.config.cjs

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import pluginJs from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import vitest from 'eslint-plugin-vitest';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.strict,
    ...eslintPluginSvelte.configs['flat/recommended'],
    vitest.configs.recommended,
    {
        ...playwright.configs['flat/playwright'],
        files: ['e2e/**/*.test.ts']
    },
    eslintPluginPrettierRecommended, // must be last to override conflicting rules.
    {
        plugins: {
            '@stylistic/ts': stylisticTs
        },
        rules: {
            '@stylistic/ts/semi': ['error', 'always']
        }
    },
    {
        rules: {
            quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            'no-nested-ternary': 'error',
            'linebreak-style': ['error', 'unix'],
            'no-cond-assign': ['error', 'always'],
            'no-console': 'off',
            '@typescript-eslint/sort-type-constituents': 'error',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    format: ['PascalCase'],
                    selector: 'class'
                },
                {
                    format: ['PascalCase'],
                    selector: 'interface'
                },
                {
                    format: ['PascalCase'],
                    selector: 'typeAlias'
                },
                {
                    format: ['PascalCase'],
                    selector: 'enum'
                },
                {
                    format: ['camelCase', 'UPPER_CASE'],
                    leadingUnderscore: 'allow',
                    selector: 'variable'
                },
                {
                    format: ['camelCase'],
                    selector: 'function'
                },
                {
                    format: ['camelCase'],
                    selector: 'method'
                },
                {
                    format: ['UPPER_CASE'],
                    selector: 'enumMember'
                }
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrors: 'none'
                }
            ],
            'block-scoped-var': 'error',
            'eol-last': 'error',
            eqeqeq: 'error',
            'no-restricted-properties': [
                'error',
                {
                    object: 'describe',
                    property: 'only'
                },
                {
                    object: 'it',
                    property: 'only'
                }
            ],
            'no-trailing-spaces': 'error',
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prettier/prettier': 'error',
            'sort-imports': [
                'error',
                {
                    ignoreCase: true,
                    ignoreDeclarationSort: false,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
                    allowSeparatedGroups: true
                }
            ]
        }
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsParser
            }
        },
        rules: {
            'svelte/no-target-blank': 'error',
            'svelte/no-at-debug-tags': 'error',
            'svelte/no-reactive-functions': 'error',
            'svelte/no-reactive-literals': 'error'
        }
    },
    {
        ignores: [
            '**/.DS_Store',
            '**/node_modules',
            'build',
            '.svelte-kit',
            '.vercel',
            '.coverage',
            'package',
            '**/.env',
            '**/.env.*',
            '!**/.env.example',
            'src/lib/models/types/database.types.ts',
            'src/lib/components/ui/**/*',
            '**/*.nnb',
            'src/routes/+layout.svelte',
            '**/pnpm-lock.yaml',
            '**/package-lock.json',
            '**/yarn.lock',
            '**/postcss.config.cjs'
        ]
    }
];
