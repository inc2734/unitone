import { registerBlockType } from '@wordpress/blocks';
import { desktop } from '@wordpress/icons';

import edit from './edit';
import save from './save';
import variations from './variations';

registerBlockType( 'unitone/responsive-switcher-container', {
	icon: {
		src: desktop,
	},
	edit,
	save,
	variations,
} );
