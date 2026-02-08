import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	RangeControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

import { HelpContainer } from '../hooks/components';

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
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		const colorGradientSettings = useMultipleOriginColorsAndGradients();
		const colors = colorGradientSettings.colors.flatMap(
			( palette ) => palette.colors
		);
		const gradients = colorGradientSettings.gradients.flatMap(
			( palette ) => palette.gradients
		);

		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		useEffect( () => {
			if ( 'core/image' !== props.name ) {
				return;
			}

			if ( 'custom' === attributes?.linkDestination ) {
				return;
			}

			if ( undefined === unitone?.mediaLink ) {
				return;
			}

			setAttributes( {
				unitone: cleanEmptyObject( {
					...unitone,
					mediaLink: undefined,
				} ),
			} );
		}, [ props.name, attributes?.linkDestination, unitone?.mediaLink ] );

		if ( ! props.isSelected || 'core/image' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const linkUrl = attributes?.href;
		const isCustomLink =
			'custom' === attributes?.linkDestination && !! linkUrl;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel
						label="unitone"
						resetAll={ () => {
							setAttributes( {
								unitone: cleanEmptyObject( {
									...unitone,
									mediaLink: undefined,
								} ),
							} );
						} }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () => !! unitone?.mediaLink }
							label={ __( 'Open link as media link', 'unitone' ) }
							onDeselect={ () => {
								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										mediaLink: undefined,
									} ),
								} );
							} }
							isShownByDefault
							panelId={ clientId }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<HelpContainer
								help={ __(
									'This can only be enabled if a custom link is set up.',
									'unitone'
								) }
								layout="horizontal"
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Open link as media link',
										'unitone'
									) }
									checked={ !! unitone?.mediaLink }
									onChange={ ( newValue ) => {
										setAttributes( {
											unitone: cleanEmptyObject( {
												...unitone,
												mediaLink:
													newValue || undefined,
											} ),
										} );
									} }
									disabled={ ! isCustomLink }
								/>
							</HelpContainer>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>

				<InspectorControls group="styles">
					<ToolsPanel
						label={ __( 'Overlay', 'unitone' ) }
						resetAll={ () => {
							setAttributes( {
								unitone: cleanEmptyObject( {
									...unitone,
									overlay: undefined,
								} ),
							} );
						} }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ColorGradientSettingsDropdown
							style={ { marginTop: 0 } }
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
											unitone:
												cleanEmptyObject( unitone ),
										} );
									},
									onGradientChange: ( newAttribute ) => {
										const gradientObject = gradients.filter(
											( c ) => newAttribute === c.gradient
										)?.[ 0 ];
										const newGradient =
											gradientObject?.slug;
										const newCustomGradient =
											gradientObject?.gradient ||
											newAttribute;

										unitone.overlay ??= {};
										unitone.overlay.gradient = newGradient;
										unitone.overlay.customGradient =
											newCustomGradient;

										setAttributes( {
											unitone:
												cleanEmptyObject( unitone ),
										} );
									},
									isShownByDefault: true,
									enableAlpha: true,
									clearable: true,
								},
							] }
							{ ...colorGradientSettings }
						/>

						<ToolsPanelItem
							hasValue={ () =>
								null != unitone?.overlay?.dimRatio
							}
							label={ __( 'Overlay opacity', 'unitone' ) }
							onDeselect={ () => {
								unitone.overlay ??= {};
								unitone.overlay.dimRatio = undefined;

								setAttributes( {
									unitone: cleanEmptyObject( unitone ),
								} );
							} }
							isShownByDefault
							panelId={ clientId }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<RangeControl
								__next40pxDefaultSize
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
								step={ 1 }
								required
							/>
						</ToolsPanelItem>
					</ToolsPanel>
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
