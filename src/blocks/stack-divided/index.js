import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/stack-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations: [
		{
			name: 'stack-divided-stripe',
			title: __( 'Stack (Divider: stripe)', 'unitone' ),
			isDefault: true,
			attributes: { divider: 'stripe' },
			scope: [ 'inserter' ],
			innerBlocks: [
				[ 'unitone/stack-divided-content' ],
				[ 'unitone/stack-divided-content' ],
			],
		},
		{
			name: 'stack-divided-underline',
			title: __( 'Stack (Divider: underline)', 'unitone' ),
			isDefault: false,
			attributes: { divider: 'underline' },
			scope: [ 'inserter' ],
			innerBlocks: [
				[ 'unitone/stack-divided-content' ],
				[ 'unitone/stack-divided-content' ],
			],
		},
		{
			name: 'stack-divided-bordered',
			title: __( 'Stack (Divider: bordered)', 'unitone' ),
			isDefault: false,
			attributes: { divider: 'bordered' },
			scope: [ 'inserter' ],
			innerBlocks: [
				[ 'unitone/stack-divided-content' ],
				[ 'unitone/stack-divided-content' ],
			],
		},
	],
} );
