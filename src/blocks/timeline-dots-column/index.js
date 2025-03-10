import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import variations from './variations';

registerBlockType( 'unitone/timeline-dots-column', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations,
} );
