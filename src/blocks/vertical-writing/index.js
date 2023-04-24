import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/vertical-writing', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
} );
