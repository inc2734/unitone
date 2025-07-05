import { registerBlockType } from '@wordpress/blocks';

import icon from './icon';
import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/timeline-dots', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );
