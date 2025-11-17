const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

if ( defaultConfig?.plugins ) {
	const plugins = [ ...defaultConfig?.plugins ];
	plugins.splice(2, 1); //delete plugins.CopyWebpackPlugin

	module.exports = {
		...defaultConfig,
		output: {
			...defaultConfig?.output,
			clean: false,
		},
		plugins,
	};
} else {
	module.exports = defaultConfig;
}
