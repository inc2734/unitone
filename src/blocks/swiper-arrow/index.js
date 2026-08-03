import { registerBlockType } from '@wordpress/blocks';

import { next } from './icons';
import edit from './edit';
import save from './save';
import variations from './variations';

registerBlockType( 'unitone/swiper-arrow', {
	icon: {
		src: next,
	},
	edit,
	save,
	variations,
} );
