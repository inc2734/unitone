import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/responsive-switcher', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
} );
