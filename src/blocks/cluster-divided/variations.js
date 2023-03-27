import { __ } from '@wordpress/i18n';

export default [
	{
		name: 'cluster-divided-stripe',
		title: __( 'Cluster (Divider: stripe)', 'unitone' ),
		isDefault: true,
		attributes: { unitone: { dividerType: 'stripe' } },
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
		scope: [ 'inserter' ],
		innerBlocks: [
			[ 'unitone/cluster-divided-content' ],
			[ 'unitone/cluster-divided-content' ],
		],
	},
];
