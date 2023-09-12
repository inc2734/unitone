const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const plugins = [ ...defaultConfig.plugins ];
plugins.splice(1, 1); //delete plugins.CleanWebpackPlugin

module.exports = {
	...defaultConfig,
	plugins,
};
