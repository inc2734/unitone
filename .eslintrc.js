const defaultConfig = require("@wordpress/scripts/config/.eslintrc.js");

module.exports = {
	...defaultConfig,
	globals: {
		...defaultConfig.globals,
		unitone: true,
		Swiper: true,
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.mjs'],
			},
		},
	},
	rules: {
		...defaultConfig.rules,
		'import/no-extraneous-dependencies': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'eqeqeq': ['error', 'allow-null'],
	},
};
