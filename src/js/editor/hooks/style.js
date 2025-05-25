/**
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/style.js
 */

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import {
	DimensionsPanel,
	useDimensionsBlockProps,
} from './dimensions/dimensions';

import {
	TypographyPanel,
	useTypographyBlockProps,
} from './typography/typography';

import {
	DividerLinePanel,
	useDividerLineBlockProps,
} from './divider-line/divider-line';

import {
	SectionDividerPanel,
	useSectionDividerBlockProps,
} from './section-divider/section-divider';

import {
	BackdropFilterPanel,
	useBackdropFilterBlockProps,
} from './backdrop-filter/backdrop-filter';

import {
	AdvancedPanel,
	useAdvancedBlockProps,
	StyleTag,
} from './advanced/advanced';

import { LayoutPanel, useLayoutBlockProps } from './layout/layout';
import { LayerPanel, useLayerBlockProps } from './layer/layer';
import { BorderPanel, useBorderBlockProps } from './border/border';
import { PositionPanel, usePositionBlockProps } from './position/position';
import { AnimationPanel, useAnimationProps } from './animation/animation';

const addAttribute = ( settings ) => {
	// Allow blocks to specify their own attribute definition with default values if needed.
	if ( ! settings.attributes.unitone ) {
		Object.assign( settings.attributes, {
			unitone: {
				type: 'object',
			},
			__unstableUnitoneSupports: {
				type: 'object',
				role: 'local',
			},
			__unitoneStates: {
				type: 'object',
				role: 'local',
			},
		} );
	}

	return settings;
};

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
