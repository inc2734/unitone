import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';
import variations from './variations';
import transforms from './transforms';
import deprecated from './deprecated';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/stack', {
	icon: {
		src: icon,
	},
	edit,
	save,
	variations,
	transforms,
	deprecated,
} );
