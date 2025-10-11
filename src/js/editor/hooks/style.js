/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

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

const withBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const newProps = useMemo(
			() =>
				compose( [
					withTypographyBlockProps,
					withLayoutBlockProps,
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
				] )( props ),
			[ props ]
		);

		return (
			<>
				<BlockListBlock { ...newProps } />
				<StyleTag { ...{ unitone: newProps?.attributes?.unitone } } />
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
				<DividerLinePanel { ...passedProps } />
				<SectionDividerPanel { ...passedProps } />
				<PositionPanel { ...passedProps } />
				<LayerPanel { ...passedProps } />
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
		resetDividerLine,
		resetSectionDivider,
		resetPositions,
		resetLayer,
		resetBorder,
		resetColor,
		resetBackdropFilter,
		resetAnimation,
		resetAdvanced,
	] )( props );

	return newProps;
};
