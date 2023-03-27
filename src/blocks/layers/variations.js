import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'background-image',
		title: __( 'Background image', 'unitone' ),
		scope: [ 'inserter' ],
		innerBlocks: [
			[
				'unitone/layer',
				{
					gridRow: '',
				},
				[
					[
						'core/image',
						{
							id: 1,
							url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
						},
					],
				],
			],
			[
				'unitone/layer',
				{
					alignSelf: 'end',
					gridRow: '',
				},
				[
					[
						'unitone/decorator',
						{ textColor: 'white', unitone: { padding: 1 } },
					],
				],
			],
		],
		example: {
			attributes: {
				cover: true,
			},
			innerBlocks: [
				{
					name: 'unitone/layer',
					attributes: {
						gridRow: '',
					},
					innerBlocks: [
						{
							name: 'core/image',
							attributes: {
								id: 1,
								url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
							},
						},
					],
				},
				{
					name: 'unitone/layer',
					attributes: {
						alignSelf: 'end',
						gridRow: '',
					},
					innerBlocks: [
						{
							name: 'unitone/decorator',
							attributes: {
								textColor: 'white',
								unitone: { padding: 1 },
							},
							innerBlocks: [
								{
									name: 'core/paragraph',
									attributes: {
										content:
											'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
									},
								},
							],
						},
					],
				},
			],
		},
	},
	{
		name: 'background-framed-image',
		title: __( 'Background framed image', 'unitone' ),
		scope: [ 'inserter' ],
		innerBlocks: [
			[
				'unitone/layer',
				{
					gridRow: '',
				},
				[
					[
						'unitone/frame',
						{},
						[
							[
								'core/image',
								{
									id: 1,
									url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
								},
							],
						],
					],
				],
			],
			[
				'unitone/layer',
				{
					alignSelf: 'end',
					gridRow: '',
				},
				[
					[
						'unitone/decorator',
						{ textColor: 'white', unitone: { padding: 1 } },
					],
				],
			],
		],
		example: {
			innerBlocks: [
				{
					name: 'unitone/layer',
					attributes: {
						gridRow: '',
					},
					innerBlocks: [
						{
							name: 'unitone/frame',
							innerBlocks: [
								{
									name: 'core/image',
									attributes: {
										id: 1,
										url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
									},
								},
							],
						},
					],
				},
				{
					name: 'unitone/layer',
					attributes: {
						alignSelf: 'end',
						gridRow: '',
					},
					innerBlocks: [
						{
							name: 'unitone/decorator',
							attributes: {
								textColor: 'white',
								unitone: { padding: 1 },
							},
							innerBlocks: [
								{
									name: 'core/paragraph',
									attributes: {
										content:
											'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
									},
								},
							],
						},
					],
				},
			],
		},
	},
];
