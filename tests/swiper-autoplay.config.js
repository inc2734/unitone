const config = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...config,
	rootDir: '..',
	testMatch: [ '<rootDir>/tests/swiper-autoplay.test.js' ],
	transform: {
		'\\.m?[jt]sx?$': require.resolve(
			'@wordpress/scripts/config/babel-transform'
		),
	},
	transformIgnorePatterns: [ '/node_modules/(?!swiper/)' ],
};
