const defaultConfig = require("@wordpress/scripts/config/.eslintrc.js");

module.exports = {
	...defaultConfig,
	globals: {
		...defaultConfig.globals,
		unitone: true,
		Swiper: true,
	},
	rules: {
		...defaultConfig.rules,
		'@wordpress/no-unsafe-wp-apis': 'off',
		'eqeqeq': ['error', 'allow-null'],
	},
};
