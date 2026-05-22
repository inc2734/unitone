/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { getBlockType } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';

import {
	createHigherOrderComponent,
	compose,
	useInstanceId,
} from '@wordpress/compose';

import {
	DimensionsPanel,
	withDimensionsBlockProps,
	resetDimensions,
} from './dimensions/dimensions';

import {
	TypographyPanel,
	withTypographyBlockProps,
	resetTypography,
} from './typography/typography';

import {
	DividerLinePanel,
	withDividerLineBlockProps,
	resetDividerLine,
} from './divider-line/divider-line';

import {
	SectionDividerPanel,
	withSectionDividerBlockProps,
	resetSectionDivider,
} from './section-divider/section-divider';

import {
	BackdropFilterPanel,
	withBackdropFilterBlockProps,
	resetBackdropFilter,
} from './backdrop-filter/backdrop-filter';

import {
	AdvancedPanel,
	withAdvancedBlockProps,
	StyleTag,
	resetAdvanced,
} from './advanced/advanced';

import {
	LayoutPanel,
	withLayoutBlockProps,
	resetLayout,
} from './layout/layout';

import {
	AlignmentDistributionPanel,
	withAlignmentDistributionBlockProps,
	resetAlignmentDistribution,
} from './alignment-distribution/alignment-distribution';

import {
	BorderPanel,
	withBorderBlockProps,
	resetBorder,
} from './border/border';

import { ColorPanel, withColorBlockProps, resetColor } from './color/color';

import {
	PositionPanel,
	withPositionBlockProps,
	resetPositions,
} from './position/position';

import {
	AnimationPanel,
	withAnimationProps,
	resetAnimation,
} from './animation/animation';

import { LayerPanel, withLayerBlockProps, resetLayer } from './layer/layer';

import {
	OverlayPanel,
	withOverlayBlockProps,
	resetOverlay,
} from './overlay/overlay';

const applyBlockProps = compose( [
	withOverlayBlockProps,
	withTypographyBlockProps,
	withLayoutBlockProps,
	withAlignmentDistributionBlockProps,
	withDimensionsBlockProps,
	withPositionBlockProps,
	withDividerLineBlockProps,
	withSectionDividerBlockProps,
	withLayerBlockProps,
	withBorderBlockProps,
	withColorBlockProps,
	withBackdropFilterBlockProps,
	withAnimationProps,
	withAdvancedBlockProps,
] );

const blockTypeHasUnitoneCache = new Map();

const hasValue = ( value ) => {
	if ( undefined === value || null === value ) {
		return false;
	}

	if ( Array.isArray( value ) ) {
		return value.some( hasValue );
	}

	if ( 'object' === typeof value ) {
		return Object.values( value ).some( hasValue );
	}

	return true;
};

const hasUnitoneAttributeValue = ( attributes ) =>
	hasValue( attributes?.unitone ) ||
	hasValue( attributes?.__unstableUnitoneSupports );

const blockTypeHasUnitoneSettings = ( name ) => {
	if ( blockTypeHasUnitoneCache.has( name ) ) {
		return blockTypeHasUnitoneCache.get( name );
	}

	const blockType = getBlockType( name );
	const hasUnitoneSettings =
		hasValue( blockType?.supports?.unitone ) ||
		hasValue( blockType?.attributes?.unitone?.default );

	blockTypeHasUnitoneCache.set( name, hasUnitoneSettings );

	return hasUnitoneSettings;
};

const shouldSkipBlockProps = ( { name, attributes } ) =>
	! hasUnitoneAttributeValue( attributes ) &&
	! blockTypeHasUnitoneSettings( name );

const CUSTOM_CSS_INSTANCE_REFERENCE = {};

const shouldRenderStyleTag = ( unitone ) => !! unitone?.style;

const withBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const customCSSIdentifier = useInstanceId(
			CUSTOM_CSS_INSTANCE_REFERENCE,
			'unitone-custom-css'
		);

		if ( shouldSkipBlockProps( props ) ) {
			return <BlockListBlock { ...props } />;
		}

		const newProps = applyBlockProps( {
			...props,
			customCSSIdentifier,
		} );
		const blockListBlockProps = { ...newProps };
		delete blockListBlockProps.customCSSIdentifier;

		return (
			<>
				<BlockListBlock { ...blockListBlockProps } />

				{ shouldRenderStyleTag( newProps?.attributes?.unitone ) && (
					<StyleTag
						{ ...{
							unitone: newProps.attributes.unitone,
							customCSSIdentifier,
						} }
					/>
				) }
			</>
		);
	};
}, 'withBlockProps' );

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { clientId, name, attributes, setAttributes, isSelected } = props;

		if ( ! isSelected ) {
			return <BlockEdit { ...props } />;
		}

		const passedProps = {
			clientId,
			name,
			attributes,
			setAttributes,
			className: attributes.className,
		};

		return (
			<>
				<BlockEdit { ...props } />

				<TypographyPanel { ...passedProps } />
				<DimensionsPanel { ...passedProps } />
				<LayoutPanel { ...passedProps } />
				<AlignmentDistributionPanel { ...passedProps } />
				<DividerLinePanel { ...passedProps } />
				<SectionDividerPanel { ...passedProps } />
				<PositionPanel { ...passedProps } />
				<LayerPanel { ...passedProps } />
				<OverlayPanel { ...passedProps } />
				<BorderPanel { ...passedProps } />
				<ColorPanel { ...passedProps } />
				<BackdropFilterPanel { ...passedProps } />
				<AnimationPanel { ...passedProps } />

				<AdvancedPanel { ...passedProps } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockListBlock',
	'unitone/style/withBlockProps',
	withBlockProps
);

addFilter(
	'editor.BlockEdit',
	'unitone/with-inspector-controls',
	withInspectorControls
);

export const resetUnitoneStyles = ( props ) => {
	const newProps = compose( [
		resetTypography,
		resetDimensions,
		resetLayout,
		resetAlignmentDistribution,
		resetDividerLine,
		resetSectionDivider,
		resetPositions,
		resetLayer,
		resetOverlay,
		resetBorder,
		resetColor,
		resetBackdropFilter,
		resetAnimation,
		resetAdvanced,
	] )( props );

	return newProps;
};
