import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

import './style.scss';

registerBlockType( 'unitone/texture', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
} );
