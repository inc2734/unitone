import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	RangeControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		const colorGradientSettings = useMultipleOriginColorsAndGradients();
		const colors = colorGradientSettings.colors.flatMap(
			( palette ) => palette.colors
		);
		const gradients = colorGradientSettings.gradients.flatMap(
			( palette ) => palette.gradients
		);

		if ( ! hasBlockSupport( name, 'unitone.overlay' ) ) {
			return <BlockListBlock { ...props } />;
		}

		const customColor = attributes?.unitone?.overlay?.customColor;
		const customGradient = attributes?.unitone?.overlay?.customGradient;

		// Backward compatibility.
		const color =
			colors.filter(
				( c ) => attributes?.unitone?.overlay?.color === c.color
			)?.[ 0 ]?.slug ?? attributes?.unitone?.overlay?.color;

		const gradient =
			gradients.filter(
				( c ) => attributes?.unitone?.overlay?.gradient === c.gradient
			)?.[ 0 ]?.slug ?? attributes?.unitone?.overlay?.gradient;

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				style: {
					...wrapperProps?.style,
					'--unitone--overlay-color': !! color
						? `var(--wp--preset--color--${ color })`
						: customColor,
					'--unitone--overlay-gradient': !! gradient
						? `var(--wp--preset--gradient--${ gradient })`
						: customGradient,
					'--unitone--overlay-opacity':
						null != attributes?.unitone?.overlay?.dimRatio
							? attributes.unitone.overlay.dimRatio * 0.01
							: undefined,
					'--unitone--overlay-radius':
						attributes?.style?.border?.radius,
				},
				'data-unitone-layout': clsx(
					wrapperProps?.[ 'data-unitone-layout' ],
					{
						'-overlay':
							!! color ||
							!! gradient ||
							!! customColor ||
							!! customGradient,
					}
				),
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/image/useBlockProps',
	useBlockProps
);

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const colorGradientSettings = useMultipleOriginColorsAndGradients();
		const colors = colorGradientSettings.colors.flatMap(
			( palette ) => palette.colors
		);
		const gradients = colorGradientSettings.gradients.flatMap(
			( palette ) => palette.gradients
		);

		if ( ! props.isSelected || 'core/image' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={ clientId }
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue:
									unitone?.overlay?.customColor ??
									unitone?.overlay?.color, // Actually, just customColor is OK, but color is also referenced for compatibility.
								gradientValue:
									unitone?.overlay?.customGradient ??
									unitone?.overlay?.gradient, // Actually, just customGradient is OK, but gradient is also referenced for compatibility.
								label: __( 'Overlay', 'unitone' ),
								onColorChange: ( newAttribute ) => {
									const colorObject = colors.filter(
										( c ) => newAttribute === c.color
									)?.[ 0 ];
									const newColor = colorObject?.slug;
									const newCustomColor =
										colorObject?.color || newAttribute;

									unitone.overlay ??= {};
									unitone.overlay.color = newColor;
									unitone.overlay.customColor =
										newCustomColor;

									setAttributes( {
										unitone: cleanEmptyObject( unitone ),
									} );
								},
								onGradientChange: ( newAttribute ) => {
									const gradientObject = gradients.filter(
										( c ) => newAttribute === c.gradient
									)?.[ 0 ];
									const newGradient = gradientObject?.slug;
									const newCustomGradient =
										gradientObject?.gradient ||
										newAttribute;

									unitone.overlay ??= {};
									unitone.overlay.gradient = newGradient;
									unitone.overlay.customGradient =
										newCustomGradient;

									setAttributes( {
										unitone: cleanEmptyObject( unitone ),
									} );
								},
								isShownByDefault: true,
								resetAllFilter: () => ( {
									...attributes,
									unitone: {
										...attributes?.unitone,
										overlay: {
											...attributes?.unitone?.overlay,
											color: undefined,
											customColor: undefined,
											gradient: undefined,
											customGradient: undefined,
										},
									},
								} ),
								enableAlpha: true,
								clearable: true,
							},
						] }
						{ ...colorGradientSettings }
					/>

					<ToolsPanelItem
						hasValue={ () => null != unitone?.dimRatio }
						label={ __( 'Overlay opacity', 'unitone' ) }
						onDeselect={ () => {
							unitone.overlay ??= {};
							unitone.overlay.dimRatio = undefined;

							setAttributes( {
								unitone: cleanEmptyObject( unitone ),
							} );
						} }
						resetAllFilter={ () => ( {
							...attributes,
							unitone: {
								...attributes?.unitone,
								overlay: {
									...attributes?.unitone?.overlay,
									dimRatio: undefined,
								},
							},
						} ) }
						isShownByDefault
						panelId={ clientId }
					>
						<RangeControl
							__nextHasNoMarginBottom
							label={ __( 'Overlay opacity', 'unitone' ) }
							value={ attributes?.unitone?.overlay?.dimRatio }
							onChange={ ( newAttribute ) => {
								unitone.overlay ??= {};
								unitone.overlay.dimRatio = newAttribute;

								setAttributes( {
									unitone: cleanEmptyObject( unitone ),
								} );
							} }
							min={ 0 }
							max={ 100 }
							step={ 10 }
							required
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/image/with-inspector-controls',
	withInspectorControls
);
