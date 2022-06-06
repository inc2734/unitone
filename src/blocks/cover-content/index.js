import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/cover-content', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations: [
		{
			name: 'cover-content-top',
			title: __( 'Cover content (Top)', 'unitone' ),
			isDefault: false,
			scope: [ 'inserter' ],
			attributes: { position: 'top' },
		},
		{
			name: 'cover-content-center',
			title: __( 'Cover content (Center)', 'unitone' ),
			isDefault: true,
			scope: [ 'inserter' ],
			attributes: { position: 'center' },
		},
		{
			name: 'cover-content-bottom',
			title: __( 'Cover content (Bottom)', 'unitone' ),
			isDefault: false,
			scope: [ 'inserter' ],
			attributes: { position: 'bottom' },
		},
	],
} );
