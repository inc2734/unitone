import { sprintf, __, _x } from '@wordpress/i18n';

import icon from './icon';
import iconBackgroundImage from './icon/background-image';
import iconBackgroundFramedImage from './icon/background-framed-image';
import iconHeroTopLeftTitle from './icon/hero-top-left-title';
import iconHeroTopRightTitle from './icon/hero-top-right-title';
import iconHeroBottomLeftTitle from './icon/hero-bottom-left-title';
import iconHeroBottomRightTitle from './icon/hero-bottom-right-title';
import iconHeroBottomLeftTitleInside from './icon/hero-bottom-left-title-inside';
import iconHeroBottomRightTitleInside from './icon/hero-bottom-right-title-inside';
import iconHeroBottomLeftTitleInset from './icon/hero-bottom-left-title-inset';
import iconHeroBottomRightTitleInset from './icon/hero-bottom-right-title-inset';
import iconSectionBackgroundImageCenteredTitle from './icon/section-background-image-centered-title';
import iconSectionBackgroundImageCenteredTitleSubtitle from './icon/section-background-image-centered-title-subtitle';
import iconSectionBackgroundImageLeftTitle from './icon/section-background-image-left-title';
import iconSectionBackgroundImageLeftTitleSubtitle from './icon/section-background-image-left-title-subtitle';

export default [
	{
		name: 'background-image',
		title: __( 'Background image', 'unitone' ),
		icon: {
			src: iconBackgroundImage,
		},
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
		icon: {
			src: iconBackgroundFramedImage,
		},
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
		icon: {
			src: icon,
		},
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
		icon: {
			src: iconHeroTopLeftTitle,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroTopRightTitle,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomLeftTitle,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomRightTitle,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomLeftTitleInside,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomRightTitleInside,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomLeftTitleInset,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconHeroBottomRightTitleInset,
		},
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
						maxWidth: 'var(--wp--style--global--content-size)',
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
		icon: {
			src: iconSectionBackgroundImageCenteredTitle,
		},
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
		icon: {
			src: iconSectionBackgroundImageCenteredTitleSubtitle,
		},
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
		icon: {
			src: iconSectionBackgroundImageLeftTitle,
		},
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
		icon: {
			src: iconSectionBackgroundImageLeftTitleSubtitle,
		},
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
