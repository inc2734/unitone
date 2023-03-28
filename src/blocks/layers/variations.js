import { sprintf, __ } from '@wordpress/i18n';

import IconUnitone from './icon/default';
import IconHeroTopLeftTitle from './icon/hero-top-left-title';
import IconHeroTopRightTitle from './icon/hero-top-right-title';
import IconHeroBottomLeftTitle from './icon/hero-bottom-left-title';
import IconHeroBottomRightTitle from './icon/hero-bottom-right-title';
import IconHeroBottomLeftTitleInside from './icon/hero-bottom-left-title-inside';
import IconHeroBottomRightTitleInside from './icon/hero-bottom-right-title-inside';
import IconHeroBottomLeftTitleInset from './icon/hero-bottom-left-title-inset';
import IconHeroBottomRightTitleInset from './icon/hero-bottom-right-title-inset';

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
	{
		name: 'default',
		isDefault: true,
		title: __( 'Default', 'unitone' ),
		scope: [ 'block' ],
		innerBlocks: [
			{
				name: 'unitone/layer',
			},
			{
				name: 'unitone/layer',
			},
		],
		icon: <IconUnitone />,
	},
	{
		name: 'hero-top-left-title',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Top / Left', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'wide',
			textColor: 'unitone/text',
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridColumn: '2/-1',
					gridRow: '2/-1',
				},
				innerBlocks: [
					{
						name: 'unitone/frame',
						attributes: {
							ratio: '16/9',
							switchRatio: true,
						},
						innerBlocks: [
							{
								name: 'core/image',
								attributes: {
									id: 1,
									url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
								},
							},
						],
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					gridRow: '',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/stack',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									fontSize: 'unitone-3xl',
									content:
										'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
				],
			},
		],
		icon: <IconHeroTopLeftTitle />,
	},
	{
		name: 'hero-top-right-title',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Top / Right', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'wide',
			textColor: 'unitone/text',
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridColumn: '1/-2',
					gridRow: '2/-1',
				},
				innerBlocks: [
					{
						name: 'unitone/frame',
						attributes: {
							ratio: '16/9',
							switchRatio: true,
						},
						innerBlocks: [
							{
								name: 'core/image',
								attributes: {
									id: 1,
									url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
								},
							},
						],
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					gridRow: '',
					justifySelf: 'end',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/stack',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									fontSize: 'unitone-3xl',
									content:
										'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
				],
			},
		],
		icon: <IconHeroTopRightTitle />,
	},
	{
		name: 'hero-bottom-left-title',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'wide',
			textColor: 'unitone/text',
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					gridColumn: '2/-1',
					gridRow: '1/-2',
				},
				innerBlocks: [
					{
						name: 'unitone/frame',
						attributes: {
							ratio: '16/9',
							switchRatio: true,
						},
						innerBlocks: [
							{
								name: 'core/image',
								attributes: {
									id: 1,
									url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
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
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/stack',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									fontSize: 'unitone-3xl',
									content:
										'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomLeftTitle />,
	},
	{
		name: 'hero-bottom-right-title',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'wide',
			textColor: 'unitone/text',
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					gridColumn: '1/-2',
					gridRow: '-2/1',
				},
				innerBlocks: [
					{
						name: 'unitone/frame',
						attributes: {
							ratio: '16/9',
							switchRatio: true,
						},
						innerBlocks: [
							{
								name: 'core/image',
								attributes: {
									id: 1,
									url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
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
					justifySelf: 'end',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/stack',
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									fontSize: 'unitone-3xl',
									content:
										'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomRightTitle />,
	},
	{
		name: 'hero-bottom-left-title-inside',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone/text',
			unitone: {
				minHeight: '85vh',
			},
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					gridRow: '1/-2',
				},
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							id: 1,
							url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
						},
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridRow: '',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/container',
						innerBlocks: [
							{
								name: 'unitone/stack',
								innerBlocks: [
									{
										name: 'core/heading',
										attributes: {
											fontSize: 'unitone-3xl',
											content:
												'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
											unitone: {
												fluidTypography: true,
											},
										},
									},
								],
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomLeftTitleInside />,
	},
	{
		name: 'hero-bottom-right-title-inside',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone/text',
			unitone: {
				minHeight: '85vh',
			},
		},
		innerBlocks: [
			{
				name: 'unitone/layer',
				attributes: {
					gridRow: '1/-2',
				},
				innerBlocks: [
					{
						name: 'core/image',
						attributes: {
							id: 1,
							url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
						},
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridRow: '',
					justifySelf: 'end',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/container',
						innerBlocks: [
							{
								name: 'unitone/stack',
								innerBlocks: [
									{
										name: 'core/heading',
										attributes: {
											fontSize: 'unitone-3xl',
											content:
												'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
											unitone: {
												fluidTypography: true,
											},
										},
									},
								],
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomRightTitleInside />,
	},
	{
		name: 'hero-bottom-left-title-inset',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone/text',
			unitone: {
				minHeight:
					'calc(100vh - var(--wp-admin--admin-bar--height, 0px))',
			},
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
							url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
						},
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridRow: '',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/decorator',
						attributes: {
							unitone: {
								padding: 1,
							},
						},
						innerBlocks: [
							{
								name: 'unitone/container',
								attributes: {
									unitone: {
										gutters: 0,
									},
								},
								innerBlocks: [
									{
										name: 'unitone/stack',
										innerBlocks: [
											{
												name: 'core/heading',
												attributes: {
													fontSize: 'unitone-3xl',
													content:
														'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
													unitone: {
														fluidTypography: true,
													},
												},
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomLeftTitleInset />,
	},
	{
		name: 'hero-bottom-right-title-inset',
		title: sprintf(
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone/text',
			unitone: {
				minHeight:
					'calc(100vh - var(--wp-admin--admin-bar--height, 0px))',
			},
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
							url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
						},
					},
				],
			},
			{
				name: 'unitone/layer',
				attributes: {
					alignSelf: 'end',
					gridRow: '',
					justifySelf: 'end',
					unitone: {
						maxWidth: 'var(\u002d\u002dunitone\u002d\u002dmeasure)',
					},
				},
				innerBlocks: [
					{
						name: 'unitone/decorator',
						attributes: {
							unitone: {
								padding: 1,
							},
						},
						innerBlocks: [
							{
								name: 'unitone/container',
								attributes: {
									unitone: {
										gutters: 0,
									},
								},
								innerBlocks: [
									{
										name: 'unitone/stack',
										innerBlocks: [
											{
												name: 'core/heading',
												attributes: {
													fontSize: 'unitone-3xl',
													content:
														'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt',
													unitone: {
														fluidTypography: true,
													},
												},
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
		icon: <IconHeroBottomRightTitleInset />,
	},
];
