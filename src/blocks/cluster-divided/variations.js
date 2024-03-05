import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'cluster-divided-stripe',
		title: __( 'Cluster (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: { unitone: { dividerType: 'stripe' } },
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
		title: __( 'Cluster (Divider: slash)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'slash' } },
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
		title: __( 'Cluster (Divider: bordered)', 'unitone' ),
		isDefault: false,
		attributes: { unitone: { dividerType: 'bordered' } },
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
