import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/dialog', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations,
} );
