import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'grid-divided-stripe',
		title: __( 'Grid (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: { dividerType: 'stripe' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
	{
		name: 'grid-divided-underline',
		title: __( 'Grid (Divider: underline)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: { dividerType: 'underline' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
	{
		name: 'grid-divided-bordered',
		title: __( 'Grid (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: { dividerType: 'bordered' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
];
