import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/grid-divided-content', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
