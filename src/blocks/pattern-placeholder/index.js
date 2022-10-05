import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';

import './index.scss';

registerBlockType( 'unitone/pattern-placeholder', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
