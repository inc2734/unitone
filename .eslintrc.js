const defaultConfig = require("@wordpress/scripts/config/.eslintrc.js");

module.exports = {
	...defaultConfig,
	globals: {
		...defaultConfig.globals,
		unitone: true,
	},
	rules: {
		...defaultConfig.rules,
		'@wordpress/no-unsafe-wp-apis': 'off',
	},
};
