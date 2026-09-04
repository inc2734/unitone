import { registerBlockType } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import './style.scss';
import './index.scss';

import icon from '../flex/icon';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import variations from './variations';

import { applyFlexDividedChildStyles } from './utils';

registerBlockType( 'unitone/flex-divided', {
	icon: {
		src: icon,
	},
	edit,
	save,
	transforms,
	variations,
} );

const changeUnitoneSupportsLabels = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			if ( ! props.isSelected || 'unitone/flex-divided' !== props.name ) {
				return <BlockListBlock { ...props } />;
			}

			return (
				<BlockListBlock
					{ ...props }
					attributes={ {
						...props.attributes,
						__unstableUnitoneSupports: {
							...props.attributes?.__unstableUnitoneSupports,
							padding: {
								...props.attributes?.__unstableUnitoneSupports
									?.padding,
								label: __( 'Children padding', 'unitone' ),
							},
						},
					} }
				/>
			);
		};
	},
	'changeUnitoneSupportsLabels'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/flex-divided/change-unitone-supports-labels',
	changeUnitoneSupportsLabels,
	11
);

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
					attributes={ applyFlexDividedChildStyles(
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
	'unitone/flex-divided/with-child-block-attributes',
	withChildBlockAttributes,
	11
);
