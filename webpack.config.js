const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

if ( defaultConfig?.plugins ) {
	const plugins =
	defaultConfig?.plugins?.filter(
		( plugin ) => plugin.constructor?.name !== 'CopyPlugin'
	) ?? [];

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
