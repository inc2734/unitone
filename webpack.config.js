const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

if ( defaultConfig?.plugins ) {
	if ('clean' in defaultConfig?.output) {
		delete defaultConfig.output.clean; //delete output.clean
	}

	const plugins = [ ...defaultConfig?.plugins ];
	plugins.splice(2, 1); //delete plugins.CopyWebpackPlugin

	module.exports = {
		...defaultConfig,
		plugins,
	};
} else {
	module.exports = defaultConfig;
}
