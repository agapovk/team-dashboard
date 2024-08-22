/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  endOfLine: 'lf',
  semi: false,
  tabWidth: 2,
  trailingComma: 'es5',
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^[.]',
    '^(@repo/ui/lib)(/.*)$',
    '^(@repo/ui)',
    '',
    '<TYPES>',
  ],
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],
}

export default config
