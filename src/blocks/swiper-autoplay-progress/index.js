import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';

registerBlockType( 'unitone/swiper-autoplay-progress', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
