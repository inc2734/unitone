import { sprintf, __ } from '@wordpress/i18n';

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
];
