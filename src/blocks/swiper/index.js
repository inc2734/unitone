import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import './index.scss';

import icon from './icon';
import edit from './edit';
import save from './save';
import variations from './variations';

registerBlockType( 'unitone/swiper', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations,
} );
