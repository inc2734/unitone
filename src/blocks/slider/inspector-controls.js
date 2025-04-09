import feather from 'feather-icons';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
	justifyStretch,
} from '@wordpress/icons';

import { __ } from '@wordpress/i18n';

import {
	alignBottom,
	alignBottomExpanded,
	alignCenter,
	alignTop,
	alignTopExpanded,
} from '../../js/editor/hooks/icons';

import { arrowsIconTypes, paginationIconTypes } from './components';

import metadata from './block.json';

const alignmentOptions = [
	{
		value: 'top',
		icon: alignTopExpanded,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'top-inside',
		icon: alignTop,
		label: __( 'Align items top (Inside)', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'bottom-inside',
		icon: alignBottom,
		label: __( 'Align items bottom (Inside)', 'unitone' ),
	},
	{
		value: 'bottom',
		icon: alignBottomExpanded,
		label: __( 'Align items bottom', 'unitone' ),
	},
];

const justificationOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
	{
		value: 'space-between-expanded',
		icon: justifyStretch,
		label: __( 'Justify items space-between (Expanded)', 'unitone' ),
	},
];

const effectOptions = [
	{
		value: 'slide',
		label: __( 'Slide', 'unitone' ),
	},
	{
		value: 'fade',
		label: __( 'Fade', 'unitone' ),
	},
];

export const SettingsInspectorControls = ( {
	attributes,
	setAttributes,
	isDisplayArrowsSettings,
	isDisplayPaginationSettings,
	canMultiSlides,
} ) => {
	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		arrowsIcon,
		hideOutside,
		pagination,
		paginationAlignment,
		paginationJustification,
		paginationIcon,
		slideWidth,
		autoplay,
		autoplayDelay,
		speed,
		loop,
		centeredSlides,
		effect,
	} = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	return (
		<InspectorControls>
			<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
				<ToolsPanelItem
					hasValue={ () =>
						effect !== metadata.attributes.effect.default
					}
					isShownByDefault
					label={ __( 'Effect', 'unitone' ) }
					onDeselect={ () =>
						setAttributes( {
							effect: metadata.attributes.effect.default,
						} )
					}
				>
					<SelectControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Effect', 'unitone' ) }
						value={ effect }
						options={ effectOptions }
						onChange={ ( newAttribute ) => {
							setAttributes( { effect: newAttribute } );
						} }
					/>
				</ToolsPanelItem>

				{ canMultiSlides && (
					<>
						<ToolsPanelItem
							hasValue={ () =>
								slideWidth !==
								metadata.attributes.slideWidth.default
							}
							isShownByDefault
							label={ __( 'Each items width', 'unitone' ) }
							onDeselect={ () => {
								setAttributes( {
									slideWidth:
										metadata.attributes.slideWidth.default,
								} );
							} }
						>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={
									<>
										{ __( 'Each items width', 'unitone' ) }
										&nbsp;:&nbsp;
										<code>width</code>
									</>
								}
								value={ slideWidth }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										slideWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								loop !== metadata.attributes.loop.default
							}
							isShownByDefault
							label={ __( 'Loop', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									loop: metadata.attributes.loop.default,
								} )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Loop', 'unitone' ) }
								checked={ loop }
								onChange={ ( newAttribute ) => {
									setAttributes( { loop: newAttribute } );
								} }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								centeredSlides !==
								metadata.attributes.centeredSlides.default
							}
							isShownByDefault
							label={ __( 'Center the active slide', 'unitone' ) }
							onDeselect={ () => {
								setAttributes( {
									centeredSlides:
										metadata.attributes.centeredSlides
											.default,
								} );
							} }
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __(
									'Center the active slide',
									'unitone'
								) }
								heop={ __(
									"The display isn't reflected on the editor.",
									'unitone'
								) }
								checked={ centeredSlides }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										centeredSlides: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hideOutside !==
								metadata.attributes.hideOutside.default
							}
							isShownByDefault
							label={ __(
								'Hide parts that extend beyond the canvas',
								'unitone'
							) }
							onDeselect={ () =>
								setAttributes( {
									hideOutside:
										metadata.attributes.hideOutside.default,
								} )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __(
									'Hide parts that extend beyond the canvas',
									'unitone'
								) }
								checked={ hideOutside }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										hideOutside: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					</>
				) }

				<ToolsPanelItem
					hasValue={ () =>
						speed !== metadata.attributes.speed.default
					}
					isShownByDefault
					label={ __( 'Speed (s)', 'unitone' ) }
					onDeselect={ () =>
						setAttributes( {
							speed: metadata.attributes.speed.default,
						} )
					}
				>
					<RangeControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Speed (s)', 'unitone' ) }
						value={ speed ?? 0.3 }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								speed: parseFloat( newAttribute ),
							} );
						} }
						min={ 0.1 }
						max={ 20 }
						step={ 0.1 }
					/>
				</ToolsPanelItem>
			</ToolsPanel>

			<ToolsPanel label={ __( 'Autoplay', 'unitone' ) }>
				<ToolsPanelItem
					hasValue={ () =>
						autoplay !== metadata.attributes.autoplay.default
					}
					isShownByDefault
					label={ __( 'Using the autoplay', 'unitone' ) }
					onDeselect={ () =>
						setAttributes( {
							autoplay: metadata.attributes.autoplay.default,
						} )
					}
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Using the autoplay', 'unitone' ) }
						checked={ autoplay }
						onChange={ ( newAttribute ) => {
							setAttributes( { autoplay: newAttribute } );
						} }
					/>
				</ToolsPanelItem>

				{ autoplay && (
					<ToolsPanelItem
						hasValue={ () =>
							autoplayDelay !==
							metadata.attributes.autoplayDelay.default
						}
						isShownByDefault
						label={ __( 'Delay (s)', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								autoplayDelay:
									metadata.attributes.autoplayDelay.default,
							} )
						}
					>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Delay (s)', 'unitone' ) }
							value={ autoplayDelay }
							help={ __(
								'When 0, the prev/next buttons and the pagination will not be displayed.',
								'unitone'
							) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									autoplayDelay: parseFloat( newAttribute ),
								} );
							} }
							min={ 0 }
							max={ 10 }
							step={ 0.1 }
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>

			{ isDisplayArrowsSettings && (
				<ToolsPanel label={ __( 'The prev/next buttons', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							arrows !== metadata.attributes.arrows.default
						}
						isShownByDefault
						label={ __( 'Using the prev/next buttons', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								arrows: metadata.attributes.arrows.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Using the prev/next buttons',
								'unitone'
							) }
							checked={ arrows }
							onChange={ ( newAttribute ) => {
								setAttributes( { arrows: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ arrows && (
						<>
							<ToolsPanelItem
								hasValue={ () =>
									arrowsIcon?.type !==
									metadata.attributes.arrowsIcon.default.type
								}
								isShownByDefault
								label={ __( 'Arrows icon', 'unitone' ) }
								onDeselect={ () => {
									arrowsIcon.type =
										metadata.attributes.arrowsIcon.default?.type;

									setAttributes( {
										arrowsIcon: { ...arrowsIcon },
									} );
								} }
							>
								<BaseControl
									__nextHasNoMarginBottom
									label={ __( 'Arrows icon', 'unitone' ) }
									id="unitone/slider/arrowsIcon"
								>
									<fieldset className="block-editor-text-transform-control">
										<div className="block-editor-text-transform-control__buttons">
											{ arrowsIconTypes.map(
												( arrowsIconType, index ) => (
													<Button
														key={ index }
														className="has-icon"
														label={
															arrowsIconType.label
														}
														isPressed={
															arrowsIconType.name ===
															arrowsIcon?.type
														}
														onClick={ () =>
															setAttributes( {
																arrowsIcon: {
																	...arrowsIcon,
																	type: arrowsIconType.name,
																},
															} )
														}
													>
														<span
															style={ {
																lineHeight: 0,
															} }
															dangerouslySetInnerHTML={ {
																__html: feather.icons[
																	arrowsIconType
																		.icons
																		.next
																].toSvg( {
																	'stroke-width':
																		arrowsIcon?.stroke,
																	width: '16px',
																	height: '16px',
																} ),
															} }
														/>
													</Button>
												)
											) }
										</div>
									</fieldset>
								</BaseControl>
							</ToolsPanelItem>

							{ !! arrowsIcon?.type && (
								<>
									<div style={ { gridColumn: '1 / -1' } }>
										<ColorGradientSettingsDropdown
											style={ { marginTop: 0 } }
											__experimentalIsRenderedInSidebar
											settings={ [
												{
													label: __(
														'Arrows icon color',
														'unitone'
													),
													colorValue:
														arrowsIcon?.customColor ||
														colors.filter(
															( c ) =>
																arrowsIcon?.color ===
																c.slug
														)?.[ 0 ]?.color,
													onColorChange: (
														newAttribute
													) => {
														const colorObject =
															colors.filter(
																( c ) =>
																	newAttribute ===
																	c.color
															)?.[ 0 ];
														const newColor =
															colorObject?.slug;
														const newCustomColor =
															colorObject?.color ||
															newAttribute;

														arrowsIcon.color =
															newColor;
														arrowsIcon.customColor =
															newCustomColor;

														setAttributes( {
															arrowsIcon: {
																...arrowsIcon,
															},
														} );
													},
													clearable: true,
												},
												{
													label: __(
														'Arrows icon background color',
														'unitone'
													),
													colorValue:
														arrowsIcon.customBackgroundColor ||
														colors.filter(
															( c ) =>
																arrowsIcon.backgroundColor ===
																c.slug
														)?.[ 0 ]?.color,
													onColorChange: (
														newAttribute
													) => {
														const colorObject =
															colors.filter(
																( c ) =>
																	newAttribute ===
																	c.color
															)?.[ 0 ];
														const newColor =
															colorObject?.slug;
														const newCustomColor =
															colorObject?.color ||
															newAttribute;

														arrowsIcon.backgroundColor =
															newColor;
														arrowsIcon.customBackgroundColor =
															newCustomColor;

														setAttributes( {
															arrowsIcon: {
																...arrowsIcon,
															},
														} );
													},
													enableAlpha: true,
													clearable: true,
												},
											] }
											{ ...colorGradientSettings }
											gradients={ [] }
											disableCustomGradients
										/>
									</div>

									<ToolsPanelItem
										hasValue={ () =>
											arrowsIcon?.stroke !==
											metadata.attributes.arrowsIcon
												.default.stroke
										}
										isShownByDefault
										label={ __(
											'Arrows icon line thickness',
											'unitone'
										) }
										onDeselect={ () => {
											arrowsIcon.stroke =
												metadata.attributes.arrowsIcon.default.stroke;

											setAttributes( {
												arrowsIcon: { ...arrowsIcon },
											} );
										} }
									>
										<RangeControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											label={ __(
												'Arrows icon line thickness',
												'unitone'
											) }
											value={ arrowsIcon?.stroke }
											onChange={ ( newAttribute ) => {
												setAttributes( {
													arrowsIcon: {
														...arrowsIcon,
														stroke: parseFloat(
															newAttribute
														),
													},
												} );
											} }
											min={ 1 }
											max={ 2 }
											step={ 0.1 }
										/>
									</ToolsPanelItem>

									<ToolsPanelItem
										hasValue={ () =>
											arrowsIcon?.size !==
											metadata.attributes.arrowsIcon
												.default.size
										}
										isShownByDefault
										label={ __(
											'Arrows icon size',
											'unitone'
										) }
										onDeselect={ () => {
											arrowsIcon.size =
												metadata.attributes.arrowsIcon.default.size;

											setAttributes( {
												arrowsIcon: { ...arrowsIcon },
											} );
										} }
									>
										<RangeControl
											__next40pxDefaultSize
											__nextHasNoMarginBottom
											label={ __(
												'Arrows icon size',
												'unitone'
											) }
											value={ arrowsIcon?.size }
											onChange={ ( newAttribute ) => {
												setAttributes( {
													arrowsIcon: {
														...arrowsIcon,
														size: parseFloat(
															newAttribute
														),
													},
												} );
											} }
											min={ 16 }
											max={ 48 }
											step={ 1 }
										/>
									</ToolsPanelItem>
								</>
							) }

							<ToolsPanelItem
								hasValue={ () =>
									arrowsAlignment !==
									metadata.attributes.arrowsAlignment.default
								}
								isShownByDefault
								label={ __( 'Arrows alignment', 'unitone' ) }
								onDeselect={ () =>
									setAttributes( {
										arrowsAlignment:
											metadata.attributes.arrowsAlignment
												.default,
									} )
								}
							>
								<fieldset className="block-editor-hooks__flex-layout-justification-controls">
									<legend>
										{ __( 'Arrows alignment', 'unitone' ) }
									</legend>
									<div>
										{ alignmentOptions.map(
											( { value, icon, label } ) => (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														arrowsAlignment ===
														value
													}
													onClick={ () => {
														setAttributes( {
															arrowsAlignment:
																value,
														} );
													} }
												/>
											)
										) }
									</div>
								</fieldset>
							</ToolsPanelItem>

							<ToolsPanelItem
								hasValue={ () =>
									arrowsJustification !==
									metadata.attributes.arrowsJustification
										.default
								}
								isShownByDefault
								label={ __(
									'Arrows justification',
									'unitone'
								) }
								onDeselect={ () =>
									setAttributes( {
										arrowsJustification:
											metadata.attributes
												.arrowsJustification.default,
									} )
								}
							>
								<fieldset className="block-editor-hooks__flex-layout-justification-controls">
									<legend>
										{ __(
											'Arrows justification',
											'unitone'
										) }
									</legend>
									<div>
										{ justificationOptions.map(
											( { value, icon, label } ) => (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														arrowsJustification ===
														value
													}
													onClick={ () => {
														setAttributes( {
															arrowsJustification:
																value,
														} );
													} }
												/>
											)
										) }
									</div>
								</fieldset>
							</ToolsPanelItem>
						</>
					) }
				</ToolsPanel>
			) }

			{ isDisplayPaginationSettings && (
				<ToolsPanel label={ __( 'The pagination', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							pagination !==
							metadata.attributes.pagination.default
						}
						isShownByDefault
						label={ __( 'Using the pagination', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								pagination:
									metadata.attributes.pagination.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Using the pagination', 'unitone' ) }
							checked={ pagination }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									pagination: newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>

					{ pagination && (
						<>
							<ToolsPanelItem
								hasValue={ () =>
									paginationIcon?.type !==
									metadata.attributes.paginationIcon.default
										.type
								}
								isShownByDefault
								label={ __( 'Pagination icon', 'unitone' ) }
								onDeselect={ () =>
									setAttributes( {
										paginationIcon: {
											...paginationIcon,
											type: metadata.attributes
												.paginationIcon.default?.type,
										},
									} )
								}
							>
								<BaseControl
									__nextHasNoMarginBottom
									label={ __( 'Pagination icon', 'unitone' ) }
									id="unitone/slider/paginationIcon"
								>
									<fieldset className="block-editor-text-transform-control">
										<div className="block-editor-text-transform-control__buttons">
											{ paginationIconTypes.map(
												(
													paginationIconType,
													index
												) => (
													<Button
														key={ index }
														className="has-icon"
														label={
															paginationIconType.label
														}
														isPressed={
															paginationIconType.name ===
															paginationIcon?.type
														}
														onClick={ () =>
															setAttributes( {
																paginationIcon:
																	{
																		...paginationIcon,
																		type:
																			paginationIconType.name ===
																			paginationIcon?.type
																				? ''
																				: paginationIconType.name,
																	},
															} )
														}
													>
														<span
															style={ {
																lineHeight: 0,
															} }
															dangerouslySetInnerHTML={ {
																__html: feather.icons[
																	paginationIconType
																		.icon
																].toSvg( {
																	'stroke-width':
																		paginationIcon?.stroke,
																	width: '16px',
																	height: '16px',
																} ),
															} }
														/>
													</Button>
												)
											) }
										</div>
									</fieldset>
								</BaseControl>
							</ToolsPanelItem>

							<div style={ { gridColumn: '1 / -1' } }>
								<ColorGradientSettingsDropdown
									style={ { marginTop: 0 } }
									__experimentalIsRenderedInSidebar
									settings={ [
										{
											label: __(
												'Pagination icon color',
												'unitone'
											),
											colorValue:
												paginationIcon?.customColor ||
												colors.filter(
													( c ) =>
														paginationIcon.color ===
														c.slug
												)?.[ 0 ]?.color,
											onColorChange: ( newAttribute ) => {
												const colorObject =
													colors.filter(
														( c ) =>
															newAttribute ===
															c.color
													)?.[ 0 ];
												const newColor =
													colorObject?.slug;
												const newCustomColor =
													colorObject?.color ||
													newAttribute;

												paginationIcon.color = newColor;
												paginationIcon.customColor =
													newCustomColor;

												setAttributes( {
													paginationIcon: {
														...paginationIcon,
													},
												} );
											},
											clearable: true,
										},
									] }
									{ ...colorGradientSettings }
									gradients={ [] }
									disableCustomGradients
								/>
							</div>

							<ToolsPanelItem
								hasValue={ () =>
									paginationAlignment !==
									metadata.attributes.paginationAlignment
										.default
								}
								isShownByDefault
								label={ __(
									'Pagination alignment',
									'unitone'
								) }
								onDeselect={ () =>
									setAttributes( {
										paginationAlignment:
											metadata.attributes
												.paginationAlignment.default,
									} )
								}
							>
								<fieldset className="block-editor-hooks__flex-layout-justification-controls">
									<legend>
										{ __(
											'Pagination alignment',
											'unitone'
										) }
									</legend>
									<div>
										{ alignmentOptions
											.filter(
												( { value } ) =>
													'center' !== value
											)
											.map(
												( { value, icon, label } ) => (
													<Button
														key={ value }
														label={ label }
														icon={ icon }
														isPressed={
															paginationAlignment ===
															value
														}
														onClick={ () => {
															setAttributes( {
																paginationAlignment:
																	value,
															} );
														} }
													/>
												)
											) }
									</div>
								</fieldset>
							</ToolsPanelItem>

							<ToolsPanelItem
								hasValue={ () =>
									paginationJustification !==
									metadata.attributes.paginationJustification
										.default
								}
								isShownByDefault
								label={ __(
									'Pagination justification',
									'unitone'
								) }
								onDeselect={ () =>
									setAttributes( {
										paginationJustification:
											metadata.attributes
												.paginationJustification
												.default,
									} )
								}
							>
								<fieldset className="block-editor-hooks__flex-layout-justification-controls">
									<legend>
										{ __(
											'Pagination justification',
											'unitone'
										) }
									</legend>
									<div>
										{ justificationOptions
											.filter(
												( { value } ) =>
													'space-between' !== value &&
													'space-between-expanded' !==
														value
											)
											.map(
												( { value, icon, label } ) => (
													<Button
														key={ value }
														label={ label }
														icon={ icon }
														isPressed={
															paginationJustification ===
															value
														}
														onClick={ () => {
															setAttributes( {
																paginationJustification:
																	value,
															} );
														} }
													/>
												)
											) }
									</div>
								</fieldset>
							</ToolsPanelItem>
						</>
					) }
				</ToolsPanel>
			) }
		</InspectorControls>
	);
};
