const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

if ( defaultConfig?.plugins ) {
	const plugins = [ ...defaultConfig.plugins ];

	plugins.splice(1, 1); //delete plugins.CleanWebpackPlugin

	module.exports = {
		...defaultConfig,
		devtool: false,
		mode: 'production',
		plugins,
	};
} else {
	module.exports = defaultConfig;
}
