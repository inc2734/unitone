import { registerBlockType } from '@wordpress/blocks';
import { group } from '@wordpress/icons';

import edit from './edit';
import save from './save';
import transforms from './transforms';

import './index.scss';

registerBlockType( 'unitone/div', {
	icon: {
		src: group,
	},
	edit,
	save,
	transforms,
} );
