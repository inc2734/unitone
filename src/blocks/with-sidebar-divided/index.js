import { registerBlockType } from '@wordpress/blocks';

import icon from '../with-sidebar/icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/with-sidebar-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
} );
