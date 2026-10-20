import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import { withSpacingUIDirection } from '../../js/editor/hooks/dimensions/spacing-ui-direction';

import icon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';

import './style.scss';

registerBlockType( 'unitone/accordion', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
} );

addFilter(
	'editor.BlockListBlock',
	'unitone/accordion/spacing-ui-direction',
	withSpacingUIDirection( 'unitone/accordion', ( { attributes } ) => ( {
		padding: /(?:^|\s)is-style-(?:box|panel)(?:\s|$)/.test(
			attributes.className || ''
		)
			? 'all'
			: 'vertical',
	} ) ),
	11
);
