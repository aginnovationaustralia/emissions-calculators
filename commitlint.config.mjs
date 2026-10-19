export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
      ],
    ],
    'header-max-length': [2, 'always', 100],
    // Disabled: Dependabot's commit body embeds changelog/release-note
    // excerpts verbatim, with no way to configure Dependabot to wrap them,
    // so this rule fails every dependabot PR regardless of the limit chosen.
    'body-max-line-length': [0, 'always', 200],
  },
};
