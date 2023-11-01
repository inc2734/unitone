import { registerBlockType } from '@wordpress/blocks';

import icon from '../icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import variations from './variations';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/cluster-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
	variations,
} );
