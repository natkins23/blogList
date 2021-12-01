module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb', 'prettier'],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'prettier/prettier': 'error',
        'no-console': 'off',
        'no-use-before-define': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
    },
    plugins: ['prettier'],
}
