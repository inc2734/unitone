import { sprintf, __ } from '@wordpress/i18n';

import icon from './icon';
import iconCentedTitle from './icon/centered-title';
import iconCentedTitleSubtitle from './icon/centered-title-subtitle';
import iconLeftTitle from './icon/left-title';
import iconLeftTitleSubtitle from './icon/left-title-subtitle';

export default [
	{
		name: 'default',
		isDefault: true,
		title: __( 'Default', 'unitone' ),
		scope: [ 'block' ],
		icon: {
			src: icon,
		},
		attributes: {
			align: 'full',
		},
	},
	{
		name: 'centered-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Centered title', 'unitone' )
		),
		scope: [ 'block', 'inserter' ],
		category: 'unitone/section',
		icon: {
			src: iconCentedTitle,
		},
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
		example: {
			viewportWidth: 1280,
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
	},
	{
		name: 'centered-title-subtitle',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Centered title / Subtitle', 'unitone' )
		),
		scope: [ 'block', 'inserter' ],
		category: 'unitone/section',
		icon: {
			src: iconCentedTitleSubtitle,
		},
		attributes: {
			align: 'full',
		},
		innerBlocks: [
			{
				name: 'unitone/stack',
				attributes: {
					tagName: 'hgroup',
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
									content: 'Lorem ipsum dolor sit amet',
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
									content: 'Lorem ipsum dolor sit amet',
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
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
			},
			innerBlocks: [
				{
					name: 'unitone/stack',
					attributes: {
						tagName: 'hgroup',
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
										content: 'Lorem ipsum dolor sit amet',
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
										content: 'Lorem ipsum dolor sit amet',
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
	},
	{
		name: 'left-title',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Left title', 'unitone' )
		),
		scope: [ 'block', 'inserter' ],
		category: 'unitone/section',
		icon: {
			src: iconLeftTitle,
		},
		attributes: {
			align: 'full',
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
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
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
	},
	{
		name: 'left-title-subtitle',
		title: sprintf(
			// translators: %1$s: position
			__( 'Section (%1$s)', 'unitone' ),
			__( 'Left title / Subtitle', 'unitone' )
		),
		scope: [ 'block', 'inserter' ],
		category: 'unitone/section',
		icon: {
			src: iconLeftTitleSubtitle,
		},
		attributes: {
			align: 'full',
		},
		innerBlocks: [
			{
				name: 'unitone/stack',
				attributes: {
					tagName: 'hgroup',
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
		example: {
			viewportWidth: 1280,
			attributes: {
				align: 'full',
			},
			innerBlocks: [
				{
					name: 'unitone/stack',
					attributes: {
						tagName: 'hgroup',
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
	},
];
