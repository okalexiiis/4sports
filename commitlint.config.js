/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'chore', 'refactor', 'docs', 'test', 'style', 'ci']],

    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],

    'subject-full-stop': [2, 'never', '.'],

    'header-max-length': [2, 'always', 100],

    'body-max-line-length': [2, 'always', 100],

    'body-leading-blank': [1, 'always'],

    'subject-case': [2, 'always', 'lower-case'],
  },
}
