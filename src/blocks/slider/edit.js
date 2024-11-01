import clsx from 'clsx';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
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
} from '@wordpress/icons';

import { useDispatch, useSelect } from '@wordpress/data';
import { useRef, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	alignBottom,
	alignCenter,
	alignTop,
} from '../../js/editor/hooks/icons';

import { Arrows, Pagination } from './components';

const alignmentOptions = [
	{
		value: 'top',
		icon: alignTop,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'bottom',
		icon: alignBottom,
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

import metadata from './block.json';

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		hideOutside,
		pagination,
		paginationAlignment,
		paginationJustification,
		slideWidth,
		autoplay,
		autoplayDelay,
		speed,
		loop,
		centeredSlides,
		effect,
		templateLock,
	} = attributes;

	const isDisplayArrowsSettings = ! autoplay || 0 < autoplayDelay;
	const isDisplayPaginationSettings = ! autoplay || 0 < autoplayDelay;

	const isDisplayArrows = arrows && isDisplayArrowsSettings;
	const isDisplayPagination = pagination && isDisplayPaginationSettings;
	const canMultiSlides = 'slide' === effect;
	const canCenterdSlides = canMultiSlides && centeredSlides;

	const [ ownerDocument, setOwnerDocument ] = useState( null );
	const ref = useRef();
	useEffect( () => {
		setOwnerDocument( ref.current.ownerDocument );
	}, [] );

	useEffect( () => {
		const sliderClientId = slides?.[ 0 ]?.clientId;
		if ( !! sliderClientId ) {
			const slideNode = ref.current.ownerDocument.getElementById(
				`block-${ sliderClientId }`
			);
			const wrapper = slideNode.parentNode;
			const canvas = wrapper.parentNode;

			const resizeObserver = new window.ResizeObserver( () => {
				const x = canCenterdSlides
					? ( canvas.getBoundingClientRect().width -
							slideNode.getBoundingClientRect().width ) /
					  2
					: undefined;

				wrapper.style.transform = !! x ? `translateX(${ x }px)` : '';
			} );
			resizeObserver.observe( wrapper );
		}
	}, [ canCenterdSlides, slideWidth ] );

	const { selectBlock } = useDispatch( blockEditorStore );

	const { slides, selectedSlides, hasChildSelected } = useSelect(
		( select ) => {
			const _slides =
				select( blockEditorStore ).getBlock( clientId ).innerBlocks;

			return {
				slides: _slides,
				selectedSlides: _slides.filter(
					( slide ) =>
						slide.clientId ===
						select( blockEditorStore ).getSelectedBlockClientId()
				),
				hasChildSelected: select(
					blockEditorStore
				).hasSelectedInnerBlock( clientId, true ),
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		ref,
		className: clsx( 'unitone-slider', {
			'unitone-slider--hide-outside': canMultiSlides && hideOutside,
			'unitone-slider--has-pagination': pagination,
		} ),
		style: {
			'--unitone--slide-width':
				canMultiSlides && !! slideWidth ? slideWidth : undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: clsx( 'unitone-slider__wrapper', 'swiper-wrapper' ),
		},
		{
			templateLock,
			allowedBlocks: [ 'unitone/slide' ],
			template: [ [ 'unitone/slide' ], [ 'unitone/slide' ] ],
			renderAppender: false,
		}
	);

	return (
		<>
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
								onDeselect={ () =>
									setAttributes( {
										slideWidth:
											metadata.attributes.slideWidth
												.default,
									} )
								}
							>
								<TextControl
									__nextHasNoMarginBottom
									label={
										<>
											{ __(
												'Each items width',
												'unitone'
											) }
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
								label={ __(
									'Center the active slide',
									'unitone'
								) }
								onDeselect={ () =>
									setAttributes( {
										centeredSlides:
											metadata.attributes.centeredSlides
												.default,
									} )
								}
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
											metadata.attributes.hideOutside
												.default,
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
										metadata.attributes.autoplayDelay
											.default,
								} )
							}
						>
							<RangeControl
								__nextHasNoMarginBottom
								label={ __( 'Delay (s)', 'unitone' ) }
								value={ autoplayDelay }
								help={ __(
									'When 0, the prev/next buttons and the pagination will not be displayed.',
									'unitone'
								) }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										autoplayDelay:
											parseFloat( newAttribute ),
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
					<ToolsPanel
						label={ __( 'The prev/next buttons', 'unitone' ) }
					>
						<ToolsPanelItem
							hasValue={ () =>
								arrows !== metadata.attributes.arrows.default
							}
							isShownByDefault
							label={ __(
								'Using the prev/next buttons',
								'unitone'
							) }
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
										arrowsAlignment !==
										metadata.attributes.arrowsAlignment
											.default
									}
									isShownByDefault
									label={ __(
										'Arrows alignment',
										'unitone'
									) }
									onDeselect={ () =>
										setAttributes( {
											arrowsAlignment:
												metadata.attributes
													.arrowsAlignment.default,
										} )
									}
								>
									<fieldset className="block-editor-hooks__flex-layout-justification-controls">
										<legend>
											{ __(
												'Arrows alignment',
												'unitone'
											) }
										</legend>
										<div>
											{ alignmentOptions.map(
												( { value, icon, label } ) => {
													return (
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
													);
												}
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
													.arrowsJustification
													.default,
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
												( { value, icon, label } ) => {
													return (
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
													);
												}
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
								label={ __(
									'Using the pagination',
									'unitone'
								) }
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
													.paginationAlignment
													.default,
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
													( {
														value,
														icon,
														label,
													} ) => {
														return (
															<Button
																key={ value }
																label={ label }
																icon={ icon }
																isPressed={
																	paginationAlignment ===
																	value
																}
																onClick={ () => {
																	setAttributes(
																		{
																			paginationAlignment:
																				value,
																		}
																	);
																} }
															/>
														);
													}
												) }
										</div>
									</fieldset>
								</ToolsPanelItem>

								<ToolsPanelItem
									hasValue={ () =>
										paginationJustification !==
										metadata.attributes
											.paginationJustification.default
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
														'space-between' !==
														value
												)
												.map(
													( {
														value,
														icon,
														label,
													} ) => {
														return (
															<Button
																key={ value }
																label={ label }
																icon={ icon }
																isPressed={
																	paginationJustification ===
																	value
																}
																onClick={ () => {
																	setAttributes(
																		{
																			paginationJustification:
																				value,
																		}
																	);
																} }
															/>
														);
													}
												) }
										</div>
									</fieldset>
								</ToolsPanelItem>
							</>
						) }
					</ToolsPanel>
				) }
			</InspectorControls>

			<div { ...blockProps }>
				{ isDisplayPagination && 'top' === paginationAlignment && (
					<Pagination
						slides={ slides }
						alignment={ paginationAlignment }
						justification={ paginationJustification }
					/>
				) }

				<div className="unitone-slider__canvas-wrapper">
					{ isDisplayArrows && 'top' === arrowsAlignment && (
						<Arrows
							alignment={ arrowsAlignment }
							justification={ arrowsJustification }
						/>
					) }

					<div
						className={ clsx( 'unitone-slider__canvas', {
							'swiper-fade': 'fade' === effect,
						} ) }
						data-unitone-swiper-centered-slides={
							canCenterdSlides ? true : undefined
						}
						data-unitone-swiper-loop={ loop ? 'true' : undefined }
					>
						<div { ...innerBlocksProps } />
					</div>

					{ isDisplayArrows &&
						( 'bottom' === arrowsAlignment ||
							'center' === arrowsAlignment ) && (
							<Arrows
								alignment={ arrowsAlignment }
								justification={ arrowsJustification }
							/>
						) }
				</div>

				{ isDisplayPagination && 'bottom' === paginationAlignment && (
					<Pagination
						slides={ slides }
						alignment={ paginationAlignment }
						justification={ paginationJustification }
					/>
				) }

				{ ( isSelected || hasChildSelected ) && (
					<div className="unitone-slider-pagination">
						{ slides.map( ( slide, index ) => {
							const sliderClientId = slide.clientId;
							const isActive =
								sliderClientId ===
								selectedSlides[ 0 ]?.clientId;

							return (
								<Button
									isPrimary={ isActive }
									isSecondary={ ! isActive }
									className="block-editor-button-block-appender"
									onClick={ () => {
										selectBlock( sliderClientId );

										const slideNode =
											ownerDocument.getElementById(
												`block-${ sliderClientId }`
											);
										const wrapper = slideNode.parentNode;
										const slider =
											ownerDocument.getElementById(
												`block-${ clientId }`
											);
										let x =
											wrapper.getBoundingClientRect()
												.left -
											slideNode.getBoundingClientRect()
												.left;

										if ( canCenterdSlides ) {
											const canvas = wrapper.parentNode;
											x =
												x +
												( canvas.getBoundingClientRect()
													.width -
													slideNode.getBoundingClientRect()
														.width ) /
													2;
										}

										wrapper.style.transform = `translateX(${ x }px)`;

										const lastSlide =
											ownerDocument.querySelector(
												`.wp-block[data-block="${
													slides[ slides.length - 1 ]
														.clientId
												}"]`
											);

										const lastSlideRight =
											lastSlide.getBoundingClientRect()
												.left + lastSlide.offsetWidth;

										const sliderRight =
											slider.getBoundingClientRect()
												.left + slider.offsetWidth;

										if ( lastSlideRight < sliderRight ) {
											x =
												x +
												sliderRight -
												lastSlideRight;
											wrapper.style.transform = `translateX(${ x }px)`;
										}
									} }
									key={ index }
								>
									<span>{ index + 1 }</span>
								</Button>
							);
						} ) }

						<InnerBlocks.ButtonBlockAppender />
					</div>
				) }
			</div>
		</>
	);
}
