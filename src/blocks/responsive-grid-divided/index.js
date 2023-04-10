import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import variations from './variations';

registerBlockType( 'unitone/responsive-grid-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	variations,
} );
