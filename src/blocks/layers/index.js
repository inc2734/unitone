import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import variations from './variations';

registerBlockType( 'unitone/layers', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	variations,
} );
