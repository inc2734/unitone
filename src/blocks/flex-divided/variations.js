import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'flex-divided-stripe',
		title: __( 'Flex (Divider: Stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				dividerType: 'stripe',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/flex-divided-content' ],
			[ 'unitone/flex-divided-content' ],
		],
	},
	{
		name: 'flex-divided-slash',
		title: __( 'Flex (Divider: Slash)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'slash',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/flex-divided-content' ],
			[ 'unitone/flex-divided-content' ],
		],
	},
	{
		name: 'flex-divided-bordered',
		title: __( 'Flex (Divider: Bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'bordered',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/flex-divided-content' ],
			[ 'unitone/flex-divided-content' ],
		],
	},
];
