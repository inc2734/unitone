import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';

import './index.scss';

registerBlockType( 'unitone/child-pages', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
