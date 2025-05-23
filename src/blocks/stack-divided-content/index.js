import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/stack-divided-content', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
} );
