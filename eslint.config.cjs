const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{
		ignores: [ 'dist/**' ],
	},
	...defaultConfig,
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
