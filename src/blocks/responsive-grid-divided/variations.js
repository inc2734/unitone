import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'responsive-grid-divided-stripe',
		title: __( 'Responsive grid (Divider: Stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				dividerType: 'stripe',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				autoRepeat: 'auto-fit',
			},
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
		name: 'responsive-grid-divided-stripe-vertical',
		title: __( 'Responsive grid (Divider: Stripe (Vertical))', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				dividerType: 'stripe-vertical',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				autoRepeat: 'auto-fit',
			},
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
		name: 'responsive-grid-divided-divide-vertical',
		title: __( 'Responsive grid (Divider: Divide (Vertical))', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				dividerType: 'divide-vertical',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				autoRepeat: 'auto-fit',
			},
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
		title: __( 'Responsive grid (Divider: Underline)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'underline',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				autoRepeat: 'auto-fit',
			},
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
		title: __( 'Responsive grid (Divider: Bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'bordered',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				autoRepeat: 'auto-fit',
			},
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
