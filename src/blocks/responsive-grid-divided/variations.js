import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'responsive-grid-divided-stripe',
		title: __( 'Responsive grid (Divider: stripe)', 'unitone' ),
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
		name: 'responsive-grid-divided-underline',
		title: __( 'Responsive grid (Divider: underline)', 'unitone' ),
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
		title: __( 'Responsive grid (Divider: bordered)', 'unitone' ),
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
