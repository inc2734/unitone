import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'abstract-background-image',
		title: __( 'Abstract background image', 'unitone' ),
		isDefault: true,
		scope: [ 'inserter' ],
		innerBlocks: [
			[
				'core/image',
				{
					id: 1,
					url: `${ window.unitoneSettings.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					style: {
						shadow: 'var:preset|shadow|unitone-dark',
					},
					lock: { move: true, remove: true },
				},
			],
		],
		example: {
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ window.unitoneSettings.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
						style: {
							shadow: 'var:preset|shadow|unitone-dark',
						},
					},
				},
			],
		},
	},
	{
		name: 'abstract-background-video',
		title: __( 'Abstract background video', 'unitone' ),
		scope: [ 'inserter' ],
		innerBlocks: [
			[
				'core/video',
				{
					id: 1,
					src: `${ window.unitoneSettings.url }/dist/img/sample.mp4`,
					style: {
						shadow: 'var:preset|shadow|unitone-dark',
					},
					lock: { move: true, remove: true },
				},
			],
		],
		example: {
			innerBlocks: [
				{
					name: 'core/video',
					attributes: {
						id: 1,
						src: `${ window.unitoneSettings.url }/dist/img/sample.mp4`,
						style: {
							shadow: 'var:preset|shadow|unitone-dark',
						},
					},
				},
			],
		},
	},
	{
		name: 'abstract-background-decorator',
		title: __( 'Abstract background', 'unitone' ),
		scope: [ 'inserter' ],
		innerBlocks: [
			[
				'unitone/decorator',
				{
					backgroundColor: 'white',
					textColor: 'unitone-text-black',
					style: {
						shadow: 'var:preset|shadow|unitone-dark',
					},
					unitone: {
						padding: '1s',
					},
					lock: { move: true, remove: true },
				},
			],
		],
		example: {
			innerBlocks: [
				{
					name: 'unitone/decorator',
					attributes: {
						style: {
							shadow: 'var:preset|shadow|unitone-dark',
						},
						unitone: {
							padding: '1s',
						},
					},
					innerBlocks: [
						{
							name: 'core/paragraph',
							attributes: {
								content:
									'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cill',
							},
						},
					],
				},
			],
		},
	},
];
