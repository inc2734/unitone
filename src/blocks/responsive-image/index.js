import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/responsive-image', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
