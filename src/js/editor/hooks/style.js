/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { cleanEmptyObject } from './utils';

import {
	DimensionsPanel,
	useGapBlockProps,
	useGuttersBlockProps,
	useNegativeBlockProps,
	useOverflowBlockProps,
	usePaddingBlockProps,
	useStairsBlockProps,
} from './dimensions/dimensions';

import {
	LayoutPanel,
	useAlignItemsBlockProps,
	useJustifyContentBlockProps,
	useJustifyContentColumnBlockProps,
	useBlockAlignBlockProps,
	useMaxWidthBlockProps,
	useMaxHeightBlockProps,
	useMinHeightBlockProps,
	useAutoRepeatBlockProps,
	useFlexGrowBlockProps,
	useFlexShrinkBlockProps,
	useFlexBasisBlockProps,
	useAlignSelfBlockProps,
	useJustifySelfBlockProps,
	useGridColumnBlockProps,
	useGridRowBlockProps,
} from './layout/layout';

import { LayerPanel, useMixBlendModeBlockProps } from './layer/layer';

import {
	AnimationPanel,
	useParallaxBlockProps,
	useScrollAnimationBlockProps,
} from './animation/animation';

import {
	TypographyPanel,
	useAutoPhraseBlockProps,
	useFluidTypographyBlockProps,
	useHalfLeadingBlockProps,
} from './typography/typography';

import {
	DividerPanel,
	useDividerBlockProps,
	useDividerTypeBlockProps,
} from './divider/divider';

import { DropShadowPanel, useDropShadowBlockProps } from './border/border';
import { PositionPanel, usePositionBlockProps } from './position/position';

import {
	AdvancedPanel,
	useStyleBlockProps,
	StyleTag,
} from './advanced/advanced';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		props = useAutoPhraseBlockProps( props );
		props = useFluidTypographyBlockProps( props );
		props = useHalfLeadingBlockProps( props );

		props = useAlignItemsBlockProps( props );
		props = useAlignSelfBlockProps( props );
		props = useAutoRepeatBlockProps( props );
		props = useBlockAlignBlockProps( props );
		props = useFlexBasisBlockProps( props );
		props = useFlexGrowBlockProps( props );
		props = useFlexShrinkBlockProps( props );
		props = useGridColumnBlockProps( props );
		props = useGridRowBlockProps( props );
		props = useJustifyContentColumnBlockProps( props );
		props = useJustifyContentBlockProps( props );
		props = useJustifySelfBlockProps( props );
		props = useMaxHeightBlockProps( props );
		props = useMaxWidthBlockProps( props );
		props = useMinHeightBlockProps( props );
		props = usePositionBlockProps( props );

		props = useGapBlockProps( props );
		props = useGuttersBlockProps( props );
		props = useNegativeBlockProps( props );
		props = useOverflowBlockProps( props );
		props = usePaddingBlockProps( props );
		props = useStairsBlockProps( props );

		props = useDividerBlockProps( props );
		props = useDividerTypeBlockProps( props );

		props = useMixBlendModeBlockProps( props );

		props = useDropShadowBlockProps( props );

		props = useParallaxBlockProps( props );
		props = useScrollAnimationBlockProps( props );

		props = useStyleBlockProps( props );

		return (
			<>
				<BlockListBlock { ...props } />
				<StyleTag { ...{ unitone: props?.attributes?.unitone } } />
			</>
		);
	};
}, 'useBlockProps' );

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
		const { clientId, name, attributes, setAttributes, isSelected } = props;

		if ( ! isSelected ) {
			return <BlockEdit { ...props } />;
		}

		const passedProps = {
			clientId,
			name,
			unitone: cleanEmptyObject( {
				...attributes.unitone,
			} ),
			__unstableUnitoneSupports: cleanEmptyObject( {
				...attributes.__unstableUnitoneSupports,
			} ),
			setAttributes,
			className: attributes.className,
		};

		return (
			<>
				<BlockEdit { ...props } />

				<TypographyPanel { ...passedProps } />
				<DimensionsPanel { ...passedProps } />
				<LayoutPanel { ...passedProps } />
				<DividerPanel { ...passedProps } />
				<PositionPanel { ...passedProps } />
				<LayerPanel { ...passedProps } />
				<DropShadowPanel { ...passedProps } />
				<AnimationPanel { ...passedProps } />

				<AdvancedPanel { ...passedProps } />
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
	'editor.BlockListBlock',
	'unitone/style/useBlockProps',
	useBlockProps
);

addFilter(
	'editor.BlockEdit',
	'unitone/with-inspector-controls',
	withInspectorControls
);
