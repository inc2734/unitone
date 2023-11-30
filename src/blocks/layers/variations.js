import { sprintf, __, _x } from '@wordpress/i18n';

import IconUnitone from './icon/default';
import IconHeroTopLeftTitle from './icon/hero-top-left-title';
import IconHeroTopRightTitle from './icon/hero-top-right-title';
import IconHeroBottomLeftTitle from './icon/hero-bottom-left-title';
import IconHeroBottomRightTitle from './icon/hero-bottom-right-title';
import IconHeroBottomLeftTitleInside from './icon/hero-bottom-left-title-inside';
import IconHeroBottomRightTitleInside from './icon/hero-bottom-right-title-inside';
import IconHeroBottomLeftTitleInset from './icon/hero-bottom-left-title-inset';
import IconHeroBottomRightTitleInset from './icon/hero-bottom-right-title-inset';
import IconSectionBackgroundImageCenteredTitle from './icon/section-background-image-centered-title';
import IconSectionBackgroundImageCenteredTitleSubtitle from './icon/section-background-image-centered-title-subtitle';
import IconSectionBackgroundImageLeftTitle from './icon/section-background-image-left-title';
import IconSectionBackgroundImageLeftTitleSubtitle from './icon/section-background-image-left-title-subtitle';

export default [
	{
		name: 'background-image',
		title: __( 'Background image', 'unitone' ),
		scope: [ 'inserter' ],
		attribuets: {
			cover: true,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
				},
			},
			{
				name: 'unitone/decorator',
				attributes: {
					textColor: 'white',
					unitone: { padding: 1, alignSelf: 'end' },
				},
			},
		],
		example: {
			attributes: {
				cover: true,
			},
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
				{
					name: 'unitone/decorator',
					attributes: {
						textColor: 'white',
						unitone: { padding: 1, alignSelf: 'end' },
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
	},
	{
		name: 'background-framed-image',
		title: __( 'Background framed image', 'unitone' ),
		scope: [ 'inserter' ],
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
			{
				name: 'unitone/decorator',
				attributes: {
					textColor: 'white',
					unitone: { padding: 1, alignSelf: 'end' },
				},
			},
		],
		example: {
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
				{
					name: 'unitone/decorator',
					attributes: {
						textColor: 'white',
						unitone: { padding: 1, alignSelf: 'end' },
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
	},
	{
		name: 'default',
		isDefault: true,
		title: __( 'Default', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconUnitone />,
		attributes: {
			dummy: true,
		},
	},
	{
		name: 'hero-top-left-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Top / Left', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroTopLeftTitle />,
		attributes: {
			align: 'wide',
			textColor: 'unitone-text',
		},
		innerBlocks: [
			{
				name: 'unitone/frame',
				attributes: {
					ratio: '16/9',
					switchRatio: true,
					unitone: {
						alignSelf: 'end',
						gridColumn: '2/-1',
						gridRow: '2/-1',
					},
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
				name: 'unitone/stack',
				attributes: {
					unitone: {
						maxWidth: 'var(--unitone--measure)',
					},
				},
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
	{
		name: 'hero-top-right-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Top / Right', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroTopRightTitle />,
		attributes: {
			align: 'wide',
			textColor: 'unitone-text',
		},
		innerBlocks: [
			{
				name: 'unitone/frame',
				attributes: {
					ratio: '16/9',
					switchRatio: true,
					unitone: {
						alignSelf: 'end',
						gridColumn: '1/-2',
						gridRow: '2/-1',
					},
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
				name: 'unitone/stack',
				attributes: {
					unitone: {
						justifySelf: 'end',
						maxWidth: 'var(--unitone--measure)',
					},
				},
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
	{
		name: 'hero-bottom-left-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomLeftTitle />,
		attributes: {
			align: 'wide',
			textColor: 'unitone-text',
		},
		innerBlocks: [
			{
				name: 'unitone/frame',
				attributes: {
					ratio: '16/9',
					switchRatio: true,
					unitone: {
						gridColumn: '2/-1',
						gridRow: '1/-2',
					},
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
				name: 'unitone/stack',
				attributes: {
					unitone: {
						alignSelf: 'end',
						maxWidth: 'var(--unitone--measure)',
					},
				},
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
	{
		name: 'hero-bottom-right-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomRightTitle />,
		attributes: {
			align: 'wide',
			textColor: 'unitone-text',
		},
		innerBlocks: [
			{
				name: 'unitone/frame',
				attributes: {
					ratio: '16/9',
					switchRatio: true,
					unitone: {
						gridColumn: '1/-2',
						gridRow: '-2/1',
					},
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
				name: 'unitone/stack',
				attributes: {
					unitone: {
						alignSelf: 'end',
						justifySelf: 'end',
						maxWidth: 'var(--unitone--measure)',
					},
				},
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
	{
		name: 'hero-bottom-left-title-inside',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomLeftTitleInside />,
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone-text',
			unitone: {
				minHeight: '85vh',
			},
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
					unitone: { gridRow: '1/-2' },
				},
			},
			{
				name: 'unitone/container',
				attributes: {
					unitone: {
						alignSelf: 'end',
						justifySelf: 'start',
						maxWidth: 'var(--unitone--measure)',
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
	{
		name: 'hero-bottom-right-title-inside',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomRightTitleInside />,
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone-text',
			unitone: {
				minHeight: '85vh',
			},
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
					unitone: { gridRow: '1/-2' },
				},
			},
			{
				name: 'unitone/container',
				attributes: {
					unitone: {
						alignSelf: 'end',
						justifySelf: 'end',
						maxWidth: 'var(--unitone--measure)',
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
	{
		name: 'hero-bottom-left-title-inset',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Left', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomLeftTitleInset />,
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone-text',
			unitone: {
				minHeight:
					'calc(100vh - var(--wp-admin--admin-bar--height, 0px))',
			},
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
				},
			},
			{
				name: 'unitone/decorator',
				attributes: {
					unitone: {
						padding: 1,
						alignSelf: 'end',
						maxWidth: 'var(--unitone--measure)',
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
	{
		name: 'hero-bottom-right-title-inset',
		title: sprintf(
			// translators: %1$s: position
			__( 'Hero (%1$s)', 'unitone' ),
			__( 'Bottom / Right', 'unitone' )
		),
		scope: [ 'block' ],
		icon: <IconHeroBottomRightTitleInset />,
		attributes: {
			align: 'full',
			cover: true,
			textColor: 'unitone-text',
			unitone: {
				minHeight:
					'calc(100vh - var(--wp-admin--admin-bar--height, 0px))',
			},
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/swing-ocean-sea2875.jpg`,
				},
			},
			{
				name: 'unitone/decorator',
				attributes: {
					unitone: {
						padding: 1,
						alignSelf: 'end',
						justifySelf: 'end',
						maxWidth: 'var(--unitone--measure)',
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
	{
		name: 'section-background-image-centered-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Background image / Centered title', 'unitone' )
		),
		keywords: [ _x( 'section', 'block keywords', 'unitone' ) ],
		scope: [ 'inserter' ],
		category: 'unitone/section',
		icon: <IconSectionBackgroundImageCenteredTitle />,
		attributes: {
			align: 'full',
			cover: true,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
				},
			},
			{
				name: 'unitone/section',
				attributes: {
					align: 'full',
				},
				innerBlocks: [
					{
						name: 'unitone/center',
						attributes: {
							unitone: {
								maxWidth: '100%',
							},
						},
						innerBlocks: [
							{
								name: 'core/heading',
								attributes: {
									content: 'Lorem ipsum dolor sit amet',
									fontSize: 'unitone-3xl',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
					{
						name: 'unitone/text',
						attributes: {
							unitone: {
								maxWidth: '100%',
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
		],
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
				cover: true,
			},
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
				{
					name: 'unitone/section',
					attributes: {
						align: 'full',
					},
					innerBlocks: [
						{
							name: 'unitone/center',
							attributes: {
								unitone: {
									maxWidth: '100%',
								},
							},
							innerBlocks: [
								{
									name: 'core/heading',
									attributes: {
										content: 'Lorem ipsum dolor sit amet',
										fontSize: 'unitone-3xl',
										unitone: {
											fluidTypography: true,
										},
									},
								},
							],
						},
						{
							name: 'unitone/text',
							attributes: {
								unitone: {
									maxWidth: '100%',
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
			],
		},
	},
	{
		name: 'section-background-image-centered-title-subtitle',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Background image / Centered title / Subtitle', 'unitone' )
		),
		keywords: [ _x( 'section', 'block keywords', 'unitone' ) ],
		scope: [ 'inserter' ],
		category: 'unitone/section',
		icon: <IconSectionBackgroundImageCenteredTitleSubtitle />,
		attributes: {
			align: 'full',
			cover: true,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
				},
			},
			{
				name: 'unitone/section',
				innerBlocks: [
					{
						name: 'unitone/stack',
						attributes: {
							unitone: {
								gap: '-2',
							},
						},
						innerBlocks: [
							{
								name: 'unitone/center',
								attributes: {
									unitone: {
										maxWidth: '100%',
									},
								},
								innerBlocks: [
									{
										name: 'core/paragraph',
										attributes: {
											content:
												'Lorem ipsum dolor sit amet',
											fontSize: 'unitone-s',
										},
									},
								],
							},
							{
								name: 'unitone/center',
								attributes: {
									unitone: {
										maxWidth: '100%',
									},
								},
								innerBlocks: [
									{
										name: 'core/heading',
										attributes: {
											content:
												'Lorem ipsum dolor sit amet',
											fontSize: 'unitone-3xl',
											unitone: {
												fluidTypography: true,
											},
										},
									},
								],
							},
						],
					},
					{
						name: 'unitone/text',
						attributes: {
							unitone: {
								maxWidth: '100%',
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
		],
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
				cover: true,
			},
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
				{
					name: 'unitone/section',
					innerBlocks: [
						{
							name: 'unitone/stack',
							attributes: {
								unitone: {
									gap: '-2',
								},
							},
							innerBlocks: [
								{
									name: 'unitone/center',
									attributes: {
										unitone: {
											maxWidth: '100%',
										},
									},
									innerBlocks: [
										{
											name: 'core/paragraph',
											attributes: {
												content:
													'Lorem ipsum dolor sit amet',
												fontSize: 'unitone-s',
											},
										},
									],
								},
								{
									name: 'unitone/center',
									attributes: {
										unitone: {
											maxWidth: '100%',
										},
									},
									innerBlocks: [
										{
											name: 'core/heading',
											attributes: {
												content:
													'Lorem ipsum dolor sit amet',
												fontSize: 'unitone-3xl',
												unitone: {
													fluidTypography: true,
												},
											},
										},
									],
								},
							],
						},
						{
							name: 'unitone/text',
							attributes: {
								unitone: {
									maxWidth: '100%',
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
			],
		},
	},
	{
		name: 'section-background-image-left-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Background image / Left title', 'unitone' )
		),
		keywords: [ _x( 'section', 'block keywords', 'unitone' ) ],
		scope: [ 'inserter' ],
		category: 'unitone/section',
		icon: <IconSectionBackgroundImageLeftTitle />,
		attributes: {
			align: 'full',
			cover: true,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
				},
			},
			{
				name: 'unitone/section',
				innerBlocks: [
					{
						name: 'core/heading',
						attributes: {
							content: 'Lorem ipsum dolor sit amet',
							fontSize: 'unitone-3xl',
							unitone: {
								fluidTypography: true,
							},
						},
					},
					{
						name: 'unitone/text',
						attributes: {
							unitone: {
								maxWidth: '100%',
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
		],
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
				cover: true,
			},
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
				{
					name: 'unitone/section',
					innerBlocks: [
						{
							name: 'core/heading',
							attributes: {
								content: 'Lorem ipsum dolor sit amet',
								fontSize: 'unitone-3xl',
								unitone: {
									fluidTypography: true,
								},
							},
						},
						{
							name: 'unitone/text',
							attributes: {
								unitone: {
									maxWidth: '100%',
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
			],
		},
	},
	{
		name: 'section-background-image-left-title-subtitle',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Background image / Left title / Subtitle', 'unitone' )
		),
		keywords: [ _x( 'section', 'block keywords', 'unitone' ) ],
		scope: [ 'inserter' ],
		category: 'unitone/section',
		icon: <IconSectionBackgroundImageLeftTitleSubtitle />,
		attributes: {
			align: 'full',
			cover: true,
		},
		innerBlocks: [
			{
				name: 'core/image',
				attributes: {
					id: 1,
					url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
				},
			},
			{
				name: 'unitone/section',
				innerBlocks: [
					{
						name: 'unitone/stack',
						attributes: {
							unitone: {
								gap: '-2',
							},
						},
						innerBlocks: [
							{
								name: 'core/paragraph',
								attributes: {
									content: 'Lorem ipsum dolor sit amet',
									fontSize: 'unitone-s',
								},
							},
							{
								name: 'core/heading',
								attributes: {
									content: 'Lorem ipsum dolor sit amet',
									fontSize: 'unitone-3xl',
									unitone: {
										fluidTypography: true,
									},
								},
							},
						],
					},
					{
						name: 'unitone/text',
						attributes: {
							unitone: {
								maxWidth: '100%',
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
		],
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
				cover: true,
			},
			innerBlocks: [
				{
					name: 'core/image',
					attributes: {
						id: 1,
						url: `${ unitone.url }/dist/img/stocksnap_lgg8nat9jy.jpg`,
					},
				},
				{
					name: 'unitone/section',
					innerBlocks: [
						{
							name: 'unitone/stack',
							attributes: {
								unitone: {
									gap: '-2',
								},
							},
							innerBlocks: [
								{
									name: 'core/paragraph',
									attributes: {
										content: 'Lorem ipsum dolor sit amet',
										fontSize: 'unitone-s',
									},
								},
								{
									name: 'core/heading',
									attributes: {
										content: 'Lorem ipsum dolor sit amet',
										fontSize: 'unitone-3xl',
										unitone: {
											fluidTypography: true,
										},
									},
								},
							],
						},
						{
							name: 'unitone/text',
							attributes: {
								unitone: {
									maxWidth: '100%',
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
			],
		},
	},
];
