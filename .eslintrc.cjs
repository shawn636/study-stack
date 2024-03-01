module.exports = {
    env: {
        browser: true,
        es2017: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:svelte/recommended',
        'prettier',
        'plugin:perfectionist/recommended-natural'
    ],
    overrides: [
        {
            files: ['*.svelte'],
            parser: 'svelte-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser'
            }
        },
        {
            extends: ['plugin:@typescript-eslint/recommended'],
            files: ['**/*.ts', '**/*.tsx'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                ecmaVersion: 2018,
                sourceType: 'module'
            },
            rules: {
                '@typescript-eslint/ban-ts-comment': 'warn',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/camelcase': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-use-before-define': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                '@typescript-eslint/no-warning-comments': 'off',
                'no-dupe-class-members': 'off',
                'node/no-empty-function': 'off',
                'node/no-missing-import': 'off',
                'node/no-missing-require': 'off',
                'node/no-unsupported-features/es-syntax': 'off',
                'node/shebang': 'off',
                'require-atomic-updates': 'off'
            }
        }
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        extraFileExtensions: ['.svelte'],
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'perfectionist', 'prettier', 'node', 'filename-rules'],
    root: true,
    rules: {
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
                varsIgnorePattern: '^_'
            }
        ],
        'block-scoped-var': 'error',
        'eol-last': 'error',
        eqeqeq: 'error',
        'filename-rules/match': [
            2,
            {
                '.js': /^\+?[a-z]*(-[a-z]*)*(.(config|server|test|worker|d))?.js$/,
                '.svelte': /^\+?[a-z]*(-[a-z]*)*(.(config|server|test|worker|d))?.svelte$/,
                '.ts': /^\+?[a-z]*(-[a-z]*)*(.(config|server|test|worker|d))?.ts$/
            }
        ],
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
        quotes: ['warn', 'single', { avoidEscape: true }]
    }
};
