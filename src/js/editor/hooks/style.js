/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import {
	DimensionsPanel,
	editPaddingProp,
	editGuttersProp,
	editGapProp,
	editStairsProp,
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
	editMaxHeightProp,
	editMinHeightProp,
	editAutoRepeatProp,
	editFlexGrowProp,
	editFlexShrinkProp,
	editFlexBasisProp,
	editAlignSelfProp,
	editJustifySelfProp,
	editGridColumnProp,
	editGridRowProp,
} from './layout/layout';

import { LayerPanel, editMixBlendModeProp } from './layer/layer';

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
	settings = editStairsProp( settings );
	settings = editGuttersProp( settings );
	settings = editJustifyContentColumnProp( settings );
	settings = editJustifyContentProp( settings );
	settings = editMaxWidthProp( settings );
	settings = editMaxHeightProp( settings );
	settings = editMinHeightProp( settings );
	settings = editAutoRepeatProp( settings );
	settings = editFlexGrowProp( settings );
	settings = editFlexShrinkProp( settings );
	settings = editFlexBasisProp( settings );
	settings = editNegativeProp( settings );
	settings = editOverflowProp( settings );
	settings = editPaddingProp( settings );
	settings = editPositionProp( settings );
	settings = editAlignSelfProp( settings );
	settings = editJustifySelfProp( settings );
	settings = editGridColumnProp( settings );
	settings = editGridRowProp( settings );
	settings = editMixBlendModeProp( settings );

	return settings;
}

const addAttribute = ( settings ) => {
	// Allow blocks to specify their own attribute definition with default values if needed.
	if ( ! settings.attributes.unitone ) {
		Object.assign( settings.attributes, {
			unitone: {
				type: 'object',
			},
		} );
	}

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
}, 'withInspectorControls' );

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
