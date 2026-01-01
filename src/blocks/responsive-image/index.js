import { registerBlockType } from '@wordpress/blocks';
import { image as icon } from '@wordpress/icons';

import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/responsive-image', {
	icon,
	edit,
	save,
} );
