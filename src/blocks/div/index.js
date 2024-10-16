import { registerBlockType } from '@wordpress/blocks';
import { group } from '@wordpress/icons';

import edit from './edit';
import save from './save';

registerBlockType( 'unitone/div', {
	icon: {
		src: group,
	},
	edit,
	save,
} );
