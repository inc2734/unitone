import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
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
