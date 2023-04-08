import { __ } from '@wordpress/i18n';

import IconUnitone from './icon/default';
import IconCentedTitle from './icon/centered-title';
import IconCentedTitleSubtitle from './icon/centered-title-subtitle';
import IconLeftTitle from './icon/left-title';
import IconLeftTitleSubtitle from './icon/left-title-subtitle';

export default [
	{
		name: 'default',
		isDefault: true,
		title: __( 'Default', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconUnitone />,
		attributes: {
			align: 'full',
		},
	},
	{
		name: 'centered-title',
		title: __( 'Centered title', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconCentedTitle />,
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
	{
		name: 'centered-title-subtitle',
		title: __( 'Centered title / Subtitle', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconCentedTitleSubtitle />,
		attributes: {
			align: 'full',
		},
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
	{
		name: 'left-title',
		title: __( 'Left title', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconLeftTitle />,
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
	{
		name: 'left-title-subtitle',
		title: __( 'Left title / Subtitle', 'unitone' ),
		scope: [ 'block' ],
		icon: <IconLeftTitleSubtitle />,
		attributes: {
			align: 'full',
		},
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
];
