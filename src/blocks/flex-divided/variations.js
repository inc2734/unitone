import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'flex-divided-stripe',
		title: __( 'Flex (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: { unitone: { dividerType: 'stripe' } },
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
		title: __( 'Flex (Divider: slash)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'slash' } },
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
		title: __( 'Flex (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'bordered' } },
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
