import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'cluster-divided-stripe',
		title: __( 'Cluster (Divider: Stripe)', 'unitone' ),
		isDefault: true,
		attributes: {
			unitone: {
				dividerType: 'stripe',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				alignItems: 'stretch',
				justifyContent: 'start',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/cluster-divided-content' ],
			[ 'unitone/cluster-divided-content' ],
		],
	},
	{
		name: 'cluster-divided-slash',
		title: __( 'Cluster (Divider: Slash)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'slash',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				alignItems: 'stretch',
				justifyContent: 'start',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/cluster-divided-content' ],
			[ 'unitone/cluster-divided-content' ],
		],
	},
	{
		name: 'cluster-divided-bordered',
		title: __( 'Cluster (Divider: Bordered)', 'unitone' ),
		isDefault: false,
		attributes: {
			unitone: {
				dividerType: 'bordered',
				divider: { style: 'solid', width: '1px' },
				dividerColor: 'unitone-light-gray',
				alignItems: 'stretch',
				justifyContent: 'start',
			},
		},
		isActive: ( blockAttributes, variationAttributes ) =>
			!! blockAttributes?.unitone?.dividerType &&
			!! variationAttributes?.unitone?.dividerType &&
			blockAttributes.unitone.dividerType ===
				variationAttributes.unitone.dividerType,
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/cluster-divided-content' ],
			[ 'unitone/cluster-divided-content' ],
		],
	},
];
