import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

import './index.scss';

registerBlockType( 'unitone/center', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
} );
