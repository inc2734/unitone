import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'responsive-grid-divided-stripe',
		title: __( 'Responsive grid (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: { autoRepeat: 'auto-fit', dividerType: 'stripe' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
	{
		name: 'responsive-grid-divided-underline',
		title: __( 'Responsive grid (Divider: underline)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: { autoRepeat: 'auto-fit', dividerType: 'underline' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
	{
		name: 'responsive-grid-divided-bordered',
		title: __( 'Responsive grid (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: { autoRepeat: 'auto-fit', dividerType: 'bordered' },
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/responsive-grid-divided-content' ],
			[ 'unitone/responsive-grid-divided-content' ],
		],
	},
];
