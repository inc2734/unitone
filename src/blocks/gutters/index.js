import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/gutters', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
