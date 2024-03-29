import { registerBlockType } from '@wordpress/blocks';

import icon from '../responsive-grid/icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/responsive-grid-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
	variations,
} );
