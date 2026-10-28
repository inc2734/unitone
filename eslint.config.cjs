const wpPlugin = require( '@wordpress/eslint-plugin' );
const jestPlugin = require( 'eslint-plugin-jest' );

module.exports = [
	{
		ignores: [
			'**/dist/**',
			'**/build/**',
			'**/node_modules/**',
			'**/vendor/**',
		],
	},
	...wpPlugin.configs.recommended,
	{
		languageOptions: {
			parserOptions: {
				requireConfigFile: false,
				babelOptions: {
					presets: [
						require.resolve( '@wordpress/babel-preset-default' ),
					],
				},
			},
		},
	},
	{
		...jestPlugin.configs[ 'flat/recommended' ],
		files: [ 'tests/**/*.test.js' ],
	},
	{
		files: [ '**/*.{js,jsx,mjs,cjs}' ],
		languageOptions: {
			globals: {
				unitone: 'writable',
				Swiper: 'writable',
				IntersectionObserver: 'writable',
				ResizeObserver: 'writable',
				DOMParser: 'writable',
				TextEncoder: 'writable',
				Image: 'writable',
				alert: 'writable',
			},
		},
		settings: {},
		rules: {
			'import/no-extraneous-dependencies': 'off',
			'@wordpress/no-unsafe-wp-apis': 'off',
			'import/no-unresolved': 'off',
			'import/default': 'off',
			'import/named': 'off',
			eqeqeq: [ 'error', 'allow-null' ],
		},
	},
];
