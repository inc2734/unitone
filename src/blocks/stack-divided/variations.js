import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'stack-divided-stripe',
		title: __( 'Stack (Divider: Stripe)', 'unitone' ),
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
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
	{
		name: 'stack-divided-underline',
		title: __( 'Stack (Divider: Underline)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'underline',
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
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
	{
		name: 'stack-divided-bordered',
		title: __( 'Stack (Divider: Bordered)', 'unitone' ),
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
			[ 'unitone/stack-divided-content' ],
			[ 'unitone/stack-divided-content' ],
		],
	},
];
