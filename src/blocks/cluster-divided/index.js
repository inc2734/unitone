import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/cluster-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations: [
		{
			name: 'cluster-divided-stripe',
			title: __( 'Cluster (Divider: stripe)', 'unitone' ),
			isDefault: true,
			attributes: { divider: 'stripe' },
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
			attributes: { divider: 'slash' },
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
			attributes: { divider: 'bordered' },
			scope: [ 'inserter' ],
			innerBlocks: [
				[ 'unitone/cluster-divided-content' ],
				[ 'unitone/cluster-divided-content' ],
			],
		},
	],
} );
