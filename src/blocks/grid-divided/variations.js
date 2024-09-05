import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'grid-divided-stripe',
		title: __( 'Grid (Divider: stripe)', 'unitone' ),
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
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
	{
		name: 'grid-divided-underline',
		title: __( 'Grid (Divider: underline)', 'unitone' ),
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
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
	{
		name: 'grid-divided-bordered',
		title: __( 'Grid (Divider: bordered)', 'unitone' ),
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
			[ 'unitone/grid-divided-content' ],
			[ 'unitone/grid-divided-content' ],
		],
	},
];
