import { registerBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import { withSpacingUIDirection } from '../../js/editor/hooks/dimensions/spacing-ui-direction';

import icon from './icon';
import edit from './edit';
import save from './save';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/popover', {
	icon: {
		src: icon,
	},
	edit,
	save,
} );

addFilter(
	'editor.BlockListBlock',
	'unitone/popover/spacing-ui-direction',
	withSpacingUIDirection( 'unitone/popover', ( { attributes } ) => ( {
		gap: [ 'left', 'right' ].includes( attributes.placement )
			? 'horizontal'
			: 'vertical',
	} ) ),
	11
);
