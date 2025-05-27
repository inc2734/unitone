/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { createHigherOrderComponent, compose } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import {
	DimensionsPanel,
	useDimensionsBlockProps,
	useResetDimensions,
} from './dimensions/dimensions';

import {
	TypographyPanel,
	useTypographyBlockProps,
	useResetTypography,
} from './typography/typography';

import {
	DividerLinePanel,
	useDividerLineBlockProps,
	useResetDividerLine,
} from './divider-line/divider-line';

import {
	SectionDividerPanel,
	useSectionDividerBlockProps,
	useResetSectionDivider,
} from './section-divider/section-divider';

import {
	BackdropFilterPanel,
	useBackdropFilterBlockProps,
	useResetBackdropFilter,
} from './backdrop-filter/backdrop-filter';

import {
	AdvancedPanel,
	useAdvancedBlockProps,
	StyleTag,
	useResetAdvanced,
} from './advanced/advanced';

import {
	LayoutPanel,
	useLayoutBlockProps,
	useResetLayout,
} from './layout/layout';

import {
	BorderPanel,
	useBorderBlockProps,
	useResetBorder,
} from './border/border';

import {
	PositionPanel,
	usePositionBlockProps,
	useResetPosition,
} from './position/position';

import {
	AnimationPanel,
	useAnimationProps,
	useResetAnimation,
} from './animation/animation';

import { LayerPanel, useLayerBlockProps, useResetLayer } from './layer/layer';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		props = useTypographyBlockProps( props );
		props = useLayoutBlockProps( props );
		props = useDimensionsBlockProps( props );
		props = usePositionBlockProps( props );
		props = useDividerLineBlockProps( props );
		props = useSectionDividerBlockProps( props );
		props = useLayerBlockProps( props );
		props = useBorderBlockProps( props );
		props = useBackdropFilterBlockProps( props );
		props = useAnimationProps( props );
		props = useAdvancedBlockProps( props );

		return (
			<>
				<BlockListBlock { ...props } />
				<StyleTag { ...{ unitone: props?.attributes?.unitone } } />
			</>
		);
	};
}, 'useBlockProps' );

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
				<BackdropFilterPanel { ...passedProps } />
				<AnimationPanel { ...passedProps } />

				<AdvancedPanel { ...passedProps } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockListBlock',
	'unitone/style/useBlockProps',
	useBlockProps
);

addFilter(
	'editor.BlockEdit',
	'unitone/with-inspector-controls',
	withInspectorControls
);

export const resetUnitoneStyles = ( props ) => {
	const newProps = compose( [
		useResetTypography,
		useResetDimensions,
		useResetLayout,
		useResetDividerLine,
		useResetSectionDivider,
		useResetPosition,
		useResetLayer,
		useResetBorder,
		useResetBackdropFilter,
		useResetAnimation,
		useResetAdvanced,
	] )( props );

	return newProps;
};
