import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

import './style.scss';

registerBlockType( 'unitone/text', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
} );
