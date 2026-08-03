import { registerBlockType } from '@wordpress/blocks';

import { start } from './icons';
import edit from './edit';
import save from './save';
import variations from './variations';

registerBlockType( 'unitone/swiper-autoplay-control', {
	icon: {
		src: start,
	},
	edit,
	save,
	variations,
} );
