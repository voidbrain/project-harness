// Harness ESLint config for plain JavaScript and TypeScript (flat config). Formatting is Prettier's job; these rules
// look for mistakes. Merge into an existing config rather than replacing it; keep project rules that do not
// contradict AGENTS.md. For TypeScript add `typescript-eslint` and spread `tseslint.configs.recommended` after `js`.
import js from '@eslint/js';

const node = ['console', 'process', 'URL', 'URLSearchParams', 'fetch', 'Buffer', 'AbortController', 'AbortSignal']
  .concat(['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'setImmediate', 'structuredClone'])
  .concat(['TextEncoder', 'TextDecoder', 'performance', 'queueMicrotask']);

export default [
  // harness: add the project's generated, vendored and copied folders here.
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', 'vendor/**'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: Object.fromEntries(node.map((name) => [name, 'readonly'])),
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      // Input validation matches control characters on purpose.
      'no-control-regex': 'off',
      // Fixed error texts are deliberate where a cause could carry private or untrusted text.
      'preserve-caught-error': 'off',
    },
  },
];
