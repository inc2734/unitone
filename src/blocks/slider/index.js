import { registerBlockType } from '@wordpress/blocks';

import 'swiper/scss'; // eslint-disable-line import/no-unresolved
import 'swiper/scss/autoplay'; // eslint-disable-line import/no-unresolved
import 'swiper/scss/navigation'; // eslint-disable-line import/no-unresolved
import 'swiper/scss/pagination'; // eslint-disable-line import/no-unresolved
import './index.scss';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

registerBlockType( 'unitone/slider', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
} );
