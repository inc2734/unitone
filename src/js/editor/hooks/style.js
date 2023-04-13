/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

import {
	DimensionsPanel,
	editPaddingProp,
	editGuttersProp,
	editGapProp,
	editNegativeProp,
	editOverflowProp,
} from './dimensions/dimensions';

import {
	LayoutPanel,
	editAlignItemsProp,
	editJustifyContentProp,
	editJustifyContentColumnProp,
	editBlockAlignProp,
	editMaxWidthProp,
	editMinHeightProp,
	editAutoRepeatProp,
	editFlexBasisProp,
} from './layout/layout';

import {
	LayerPanel,
	editAlignSelfProp,
	editJustifySelfProp,
	editGridColumnProp,
	editGridRowProp,
} from './layer/layer';

import {
	TypographyPanel,
	editFluidTypographyProp,
	editHalfLeadingProp,
} from './typography/typography';

import {
	DividerPanel,
	editDividerProp,
	editDividerTypeProp,
} from './divider/divider';

import { PositionPanel, editPositionProp } from './position/position';

function addEditProps( settings ) {
	if ( !! settings.supports?.typography?.fontSize ) {
		settings = editFluidTypographyProp( settings );
	}

	if ( !! settings.supports?.typography?.lineHeight ) {
		settings = editHalfLeadingProp( settings );
	}

	settings = editAlignItemsProp( settings );
	settings = editBlockAlignProp( settings );
	settings = editDividerProp( settings );
	settings = editDividerTypeProp( settings );
	settings = editGapProp( settings );
	settings = editGuttersProp( settings );
	settings = editJustifyContentColumnProp( settings );
	settings = editJustifyContentProp( settings );
	settings = editMaxWidthProp( settings );
	settings = editMinHeightProp( settings );
	settings = editAutoRepeatProp( settings );
	settings = editFlexBasisProp( settings );
	settings = editNegativeProp( settings );
	settings = editOverflowProp( settings );
	settings = editPaddingProp( settings );
	settings = editPositionProp( settings );
	settings = editAlignSelfProp( settings );
	settings = editJustifySelfProp( settings );
	settings = editGridColumnProp( settings );
	settings = editGridRowProp( settings );

	return settings;
}

const addAttribute = ( settings ) => {
	Object.assign( settings.attributes, {
		unitone: {
			type: 'object',
		},
	} );

	return settings;
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if (
			! hasBlockSupport( props.name, 'typography.fontSize' ) &&
			! hasBlockSupport( props.name, 'typography.lineHeight' ) &&
			! hasBlockSupport( props.name, 'unitone' ) &&
			! props.attributes?.__unstableUnitoneSupports
		) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />

				{ hasBlockSupport( props.name, 'typography.fontSize' ) &&
					hasBlockSupport( props.name, 'typography.lineHeight' ) && (
						<TypographyPanel { ...props } />
					) }

				{ ( hasBlockSupport( props.name, 'unitone' ) ||
					!! props.attributes?.__unstableUnitoneSupports ) && (
					<>
						<DimensionsPanel { ...props } />
						<LayoutPanel { ...props } />
						<DividerPanel { ...props } />
						<PositionPanel { ...props } />
						<LayerPanel { ...props } />
					</>
				) }
			</>
		);
	};
}, 'withInspectorControl' );

addFilter(
	'blocks.registerBlockType',
	'unitone/style/addAttribute',
	addAttribute
);

addFilter(
	'blocks.registerBlockType',
	'unitone/style/addEditProps',
	addEditProps
);

addFilter(
	'editor.BlockEdit',
	'unitone/with-inspector-controls',
	withInspectorControls
);

/**
 * Add parent block name prop.
 */
const withChildBlockAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return ( props ) => {
			const { getBlockParents, getBlock } = useSelect(
				( select ) => {
					return select( blockEditorStore );
				},
				[ props.clientId ]
			);

			const newProps = { ...props };

			const blockParents = getBlockParents( props.clientId );
			if ( 0 < blockParents.length ) {
				const parentClientId = blockParents[ blockParents.length - 1 ];
				if ( !! parentClientId ) {
					const parentBlock = getBlock( parentClientId );

					if ( 'unitone/both-sides' === parentBlock?.name ) {
						newProps.attributes = {
							...newProps.attributes,
							__unstableUnitoneSupports: {
								flexBasis: true,
							},
						};
					} else if ( 'unitone/layers' === parentBlock?.name ) {
						newProps.attributes = {
							...newProps.attributes,
							__unstableUnitoneSupports: {
								alignSelf: true,
								justifySelf: true,
								gridColumn: true,
								gridRow: true,
								maxWidth: true,
								minHeight: true,
							},
						};
					}
				}
			}

			return <BlockListBlock { ...newProps } />;
		};
	},
	'withClientIdClassName'
);

addFilter(
	'editor.BlockListBlock',
	'unitone/with-child-block-attributes',
	withChildBlockAttributes
);
