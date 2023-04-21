import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import variations from './variations';

import './index.scss';

registerBlockType( 'unitone/layers', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
	variations,
} );
