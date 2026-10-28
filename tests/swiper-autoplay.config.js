const config = require( '../jest.config.cjs' );

module.exports = {
	...config,
	rootDir: '..',
	testMatch: [ '<rootDir>/tests/swiper-autoplay*.test.js' ],
	transform: {
		'\\.m?[jt]sx?$': [
			'babel-jest',
			{ presets: [ '@wordpress/babel-preset-default' ] },
		],
	},
	transformIgnorePatterns: [ '/node_modules/(?!swiper/)' ],
};
