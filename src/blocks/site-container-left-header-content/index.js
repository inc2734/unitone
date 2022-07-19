import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/site-container-left-header-content', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
