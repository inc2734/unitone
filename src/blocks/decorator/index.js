import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/decorator', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
} );
