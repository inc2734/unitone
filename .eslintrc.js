const defaultConfig = require("@wordpress/scripts/config/.eslintrc.js");

module.exports = {
	...defaultConfig,
	globals: {
		...defaultConfig.globals,
		unitone: true,
		Swiper: true,
		IntersectionObserver: true,
		ResizeObserver: true,
		DOMParser: true,
		TextEncoder: true,
		Image: true,
		alert: true,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.mjs'],
			},
			 exports: {},
		},
	},
	rules: {
		...defaultConfig.rules,
		'import/no-extraneous-dependencies': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'import/no-unresolved': [ 'error', { ignore: [ '^@wordpress/' ] } ],
		'eqeqeq': ['error', 'allow-null'],
	},
};
