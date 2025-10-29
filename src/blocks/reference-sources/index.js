import { registerBlockType } from '@wordpress/blocks';
import { pages } from '@wordpress/icons';

import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/reference-sources', {
	icon: {
		src: pages,
	},
	edit,
	save,
} );
