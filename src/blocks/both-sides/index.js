import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import icon from './icon';
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';

import { applyBothSidesChildStyles } from './utils';

import './style.scss';
import './index.scss';

registerBlockType( 'unitone/both-sides', {
	icon: {
		src: icon,
	},
	edit,
	save,
	deprecated,
	transforms,
} );

const withChildBlockAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { getBlock } = useSelect( blockEditorStore );

			if ( ! props.rootClientId ) {
				return <BlockListBlock { ...props } />;
			}

			const parentBlock = getBlock( props.rootClientId );

			return (
				<BlockListBlock
					{ ...props }
					attributes={ applyBothSidesChildStyles(
						props.attributes,
						parentBlock
					) }
				/>
			);
		};
	},
	'withChildBlockAttributes'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/both-sides/with-child-block-attributes',
	withChildBlockAttributes,
	11
);
