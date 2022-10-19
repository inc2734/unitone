import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/cluster-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	variations: [
		{
			name: 'cluster-divided-stripe',
			title: __( 'Cluster (Divider: stripe)', 'unitone' ),
			isDefault: true,
			attributes: { unitone: { deviderType: 'stripe' } },
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
			attributes: { unitone: { deviderType: 'slash' } },
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
			attributes: { unitone: { deviderType: 'bordered' } },
			scope: [ 'inserter' ],
			innerBlocks: [
				[ 'unitone/cluster-divided-content' ],
				[ 'unitone/cluster-divided-content' ],
			],
		},
	],
} );
