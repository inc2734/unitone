/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import {
	DimensionsPanel,
	savePaddingProp,
	editPaddingProp,
	saveGuttersProp,
	editGuttersProp,
	saveGapProp,
	editGapProp,
	saveNegativeProp,
	editNegativeProp,
} from './dimensions';

import {
	LayoutPanel,
	saveAlignItemsProp,
	editAlignItemsProp,
	saveJustifyContentProp,
	editJustifyContentProp,
	saveJustifyContentColumnProp,
	editJustifyContentColumnProp,
	saveBlockAlignProp,
	editBlockAlignProp,
	saveMaxWidthProp,
	editMaxWidthProp,
	saveMinHeightProp,
	editMinHeightProp,
} from './layout';

import {
	TypographyPanel,
	saveFluidTypographyProp,
	editFluidTypographyProp,
} from './typography';

import { HeaderPanel } from './header';

function addSaveProps( extraProps, blockType, attributes ) {
	extraProps = saveAlignItemsProp( extraProps, blockType, attributes );
	extraProps = saveBlockAlignProp( extraProps, blockType, attributes );
	extraProps = saveJustifyContentColumnProp(
		extraProps,
		blockType,
		attributes
	);
	extraProps = saveFluidTypographyProp( extraProps, blockType, attributes );
	extraProps = saveGapProp( extraProps, blockType, attributes );
	extraProps = saveGuttersProp( extraProps, blockType, attributes );
	extraProps = saveJustifyContentProp( extraProps, blockType, attributes );
	extraProps = saveMaxWidthProp( extraProps, blockType, attributes );
	extraProps = saveMinHeightProp( extraProps, blockType, attributes );
	extraProps = saveNegativeProp( extraProps, blockType, attributes );
	extraProps = savePaddingProp( extraProps, blockType, attributes );
	return extraProps;
}

function addEditProps( settings ) {
	settings = editAlignItemsProp( settings );
	settings = editBlockAlignProp( settings );
	settings = editFluidTypographyProp( settings );
	settings = editGapProp( settings );
	settings = editGuttersProp( settings );
	settings = editJustifyContentColumnProp( settings );
	settings = editJustifyContentProp( settings );
	settings = editMaxWidthProp( settings );
	settings = editMinHeightProp( settings );
	settings = editNegativeProp( settings );
	settings = editPaddingProp( settings );
	return settings;
}

const addAttribute = ( settings ) => {
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
		return (
			<>
				<BlockEdit { ...props } />
				<DimensionsPanel { ...props } />
				<LayoutPanel { ...props } />
				<TypographyPanel { ...props } />

				<HeaderPanel { ...props } />
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
	'blocks.getSaveContent.extraProps',
	'unitone/style/addSaveProps',
	addSaveProps
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
