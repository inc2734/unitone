import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import { withSpacingUIDirection } from '../../js/editor/hooks/dimensions/spacing-ui-direction';

import icon from './icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/text', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	deprecated,
} );

addFilter(
	'editor.BlockListBlock',
	'unitone/text/spacing-ui-direction',
	withSpacingUIDirection( 'unitone/text', ( { attributes } ) => ( {
		gap: attributes.column ? 'all' : 'vertical',
	} ) ),
	11
);
