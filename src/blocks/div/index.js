import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

import './index.scss';

registerBlockType( 'unitone/div', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
} );
