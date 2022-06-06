import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

registerBlockType( 'unitone/container', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
} );
