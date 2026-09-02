import {
	Notice,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

import {
	HelpContainer,
	ResponsiveSettingsContainer,
} from '../../js/editor/hooks/components';

import {
	DEFAULT_SETTINGS,
	isSingleSlideEffect,
	resolveResponsiveSettings,
	resolveSettings,
	updateResponsiveSetting,
	updateSetting,
} from './config';

const asNumber = ( value, fallback ) => {
	if ( '' === value || null == value ) {
		return fallback;
	}

	const number = Number( value );
	return Number.isFinite( number ) ? number : fallback;
};

const PIXEL_UNITS = [ { value: 'px', label: 'px', default: 0 } ];

const asPixelNumber = ( value, fallback ) => {
	if ( '' === value || null == value ) {
		return fallback;
	}

	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? number : fallback;
};

const ResponsiveControls = ( {
	device,
	settings,
	resolvedSettings,
	onChange,
} ) => {
	const deviceSettings = settings?.responsive?.[ device ] || {};
	const isDesktop = 'desktop' === device;
	const responsiveSettings = resolveResponsiveSettings(
		settings,
		resolvedSettings
	);
	const currentResponsiveSettings = responsiveSettings[ device ];
	const inheritedSettings =
		'mobile' === device
			? responsiveSettings.tablet
			: responsiveSettings.desktop;

	const getValue = ( key ) =>
		isDesktop ? resolvedSettings[ key ] : deviceSettings[ key ] ?? '';

	const getInheritedValue = ( key ) => inheritedSettings[ key ];

	const change = ( key, value ) =>
		onChange(
			device,
			key,
			isDesktop && '' === value ? DEFAULT_SETTINGS[ key ] : value
		);

	const configuredSlidesPerViewMode = getValue( 'slidesPerViewMode' );
	const slidesPerView = getValue( 'slidesPerView' );
	const autoSlideWidth = getValue( 'autoSlideWidth' );
	const inheritedAutoSlideWidth = getInheritedValue( 'autoSlideWidth' );

	const slidesPerViewMode =
		! isDesktop && '' === configuredSlidesPerViewMode
			? 'inherit'
			: configuredSlidesPerViewMode;

	const slidesPerGroup = getValue( 'slidesPerGroup' );
	const inheritedSlidesPerGroup = getInheritedValue( 'slidesPerGroup' );
	const spaceBetween = getValue( 'spaceBetween' );

	return (
		<div style={ { display: 'grid', gap: '16px' } }>
			<div style={ { display: 'grid', gap: '8px' } }>
				<ToggleGroupControl
					__nextHasNoMarginBottom
					isBlock
					label={ __( 'Slide sizing', 'unitone' ) }
					value={ slidesPerViewMode }
					onChange={ ( mode ) =>
						change(
							'slidesPerViewMode',
							'inherit' === mode ? '' : mode
						)
					}
				>
					{ ! isDesktop && (
						<ToggleGroupControlOption
							label={ __( 'Inherit', 'unitone' ) }
							value="inherit"
						/>
					) }

					<ToggleGroupControlOption
						label={ _x( 'Number', 'Number of slides', 'unitone' ) }
						value="number"
					/>

					{ /* Swiper implements width-based sizing as slidesPerView: 'auto'. */ }
					<ToggleGroupControlOption
						label={ __( 'Width', 'unitone' ) }
						value="auto"
					/>
				</ToggleGroupControl>

				{ 'number' === slidesPerViewMode && (
					<RangeControl
						__nextHasNoMarginBottom
						ariaLabel={ __( 'Slides per view', 'unitone' ) }
						value={ asNumber(
							slidesPerView,
							currentResponsiveSettings.slidesPerView
						) }
						min={ 1 }
						max={ 10 }
						step={ 0.5 }
						onChange={ ( value ) =>
							change(
								'slidesPerView',
								value ?? DEFAULT_SETTINGS.slidesPerView
							)
						}
					/>
				) }

				{ 'auto' === slidesPerViewMode && (
					// Keep arbitrary CSS functions and custom properties intact.
					<TextControl
						__nextHasNoMarginBottom
						label={ __( 'Slide width', 'unitone' ) }
						value={ autoSlideWidth }
						placeholder={
							isDesktop ? undefined : inheritedAutoSlideWidth
						}
						onChange={ ( value ) =>
							change( 'autoSlideWidth', value ?? '' )
						}
					/>
				) }
			</div>

			<UnitControl
				__nextHasNoMarginBottom
				label={ __( 'Space between slides', 'unitone' ) }
				value={ '' === spaceBetween ? '' : `${ spaceBetween }px` }
				units={ PIXEL_UNITS }
				min={ 0 }
				placeholder={
					isDesktop ? undefined : __( 'Inherit', 'unitone' )
				}
				onChange={ ( value ) =>
					change(
						'spaceBetween',
						'' === value
							? ''
							: asPixelNumber(
									value,
									DEFAULT_SETTINGS.spaceBetween
							  )
					)
				}
			/>

			<RangeControl
				__nextHasNoMarginBottom
				label={ __( 'Slides per group', 'unitone' ) }
				value={
					'' === slidesPerGroup
						? undefined
						: asNumber(
								slidesPerGroup,
								DEFAULT_SETTINGS.slidesPerGroup
						  )
				}
				currentInput={ asNumber(
					inheritedSlidesPerGroup,
					DEFAULT_SETTINGS.slidesPerGroup
				) }
				min={ 1 }
				max={ 10 }
				step={ 1 }
				allowReset={ ! isDesktop }
				onChange={ ( value ) =>
					change( 'slidesPerGroup', value ?? '' )
				}
			/>
		</div>
	);
};

export const SettingsInspectorControls = ( { attributes, setAttributes } ) => {
	const { settings = {} } = attributes;

	const resolved = resolveSettings( settings );
	const singleSlideEffect = isSingleSlideEffect( resolved.effect );
	const usesWidthSizing = Object.values(
		resolveResponsiveSettings( settings, resolved )
	).some( ( deviceSettings ) => 'auto' === deviceSettings.slidesPerViewMode );
	const snapToSlideEdgeDisabled =
		singleSlideEffect ||
		'loop' === resolved.loopMode ||
		resolved.centeredSlides;
	const freeModeDisabled =
		singleSlideEffect ||
		! resolved.allowTouchMove ||
		resolved.snapToSlideEdge;

	const hasSetting = ( key ) =>
		Object.prototype.hasOwnProperty.call( settings, key );

	const setSetting = ( key, value ) => {
		let next = updateSetting( settings, key, value );

		if ( 'loopMode' === key && 'loop' === value ) {
			next = updateSetting( next, 'snapToSlideEdge', false );
		}

		if ( 'centeredSlides' === key && value ) {
			next = updateSetting( next, 'snapToSlideEdge', false );
		}

		if (
			( 'effect' === key && isSingleSlideEffect( value ) ) ||
			( 'allowTouchMove' === key && ! value ) ||
			( 'snapToSlideEdge' === key && value )
		) {
			next = updateSetting( next, 'freeMode', false );
		}

		setAttributes( { settings: next } );
	};

	const resetSetting = ( key ) => {
		setAttributes( {
			settings: updateSetting( settings, key, DEFAULT_SETTINGS[ key ] ),
		} );
	};

	const resetSettings = ( keys ) => {
		const next = keys.reduce(
			( nextSettings, key ) =>
				updateSetting( nextSettings, key, DEFAULT_SETTINGS[ key ] ),
			settings
		);

		setAttributes( { settings: next } );
	};

	const setResponsiveSetting = ( device, key, value ) => {
		if ( 'desktop' === device ) {
			setSetting( key, value );
			return;
		}

		const next = updateResponsiveSetting( settings, device, key, value );

		setAttributes( { settings: next } );
	};

	const responsiveKeys = [
		'slidesPerViewMode',
		'slidesPerView',
		'autoSlideWidth',
		'spaceBetween',
		'slidesPerGroup',
	];

	const hasResponsiveSetting = () =>
		responsiveKeys.some(
			( key ) =>
				hasSetting( key ) ||
				[ 'tablet', 'mobile' ].some( ( device ) =>
					Object.prototype.hasOwnProperty.call(
						settings?.responsive?.[ device ] || {},
						key
					)
				)
		);

	const getSettingsWithoutResponsiveLayout = ( currentSettings ) => {
		let next = responsiveKeys.reduce(
			( nextSettings, key ) =>
				updateSetting( nextSettings, key, DEFAULT_SETTINGS[ key ] ),
			currentSettings
		);

		[ 'tablet', 'mobile' ].forEach( ( device ) => {
			responsiveKeys.forEach( ( key ) => {
				next = updateResponsiveSetting( next, device, key, '' );
			} );
		} );

		return next;
	};

	const resetResponsiveSettings = () => {
		setAttributes( {
			settings: getSettingsWithoutResponsiveLayout( settings ),
		} );
	};

	const resetSlideSettings = () => {
		const next = [
			'slidesOffsetBefore',
			'slidesOffsetAfter',
			'speed',
			'loopMode',
			'centeredSlides',
			'snapToSlideEdge',
			'autoHeight',
		].reduce(
			( nextSettings, key ) =>
				updateSetting( nextSettings, key, DEFAULT_SETTINGS[ key ] ),
			getSettingsWithoutResponsiveLayout( settings )
		);

		setAttributes( { settings: next } );
	};

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Effects', 'unitone' ) }
				resetAll={ () =>
					resetSettings( [ 'effect', 'fadeCrossFade' ] )
				}
			>
				<ToolsPanelItem
					hasValue={ () => hasSetting( 'effect' ) }
					isShownByDefault
					label={ __( 'Effect', 'unitone' ) }
					onDeselect={ () => resetSetting( 'effect' ) }
				>
					<SelectControl
						__nextHasNoMarginBottom
						label={ __( 'Effect', 'unitone' ) }
						value={ resolved.effect }
						options={ [
							{
								label: __( 'Slide', 'unitone' ),
								value: 'slide',
							},
							{
								label: __( 'Fade', 'unitone' ),
								value: 'fade',
							},
						] }
						onChange={ ( value ) => setSetting( 'effect', value ) }
					/>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'fadeCrossFade' ) }
					isShownByDefault
					label={ __( 'Cross fade', 'unitone' ) }
					onDeselect={ () => resetSetting( 'fadeCrossFade' ) }
				>
					<HelpContainer
						help={ __( 'Disabled when: Slide effect', 'unitone' ) }
						layout="horizontal"
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Cross fade', 'unitone' ) }
							checked={ resolved.fadeCrossFade }
							disabled={ ! singleSlideEffect }
							onChange={ ( value ) =>
								setSetting( 'fadeCrossFade', value )
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Settings', 'unitone' ) }
				resetAll={ resetSlideSettings }
			>
				{ ! singleSlideEffect && (
					<ToolsPanelItem
						hasValue={ hasResponsiveSetting }
						isShownByDefault
						label={ __( 'Responsive slide layout', 'unitone' ) }
						onDeselect={ resetResponsiveSettings }
					>
						<div className="unitone-swiper-responsive-settings">
							<ResponsiveSettingsContainer
								label={ __(
									'Responsive slide layout',
									'unitone'
								) }
								desktopControls={ () => (
									<ResponsiveControls
										device="desktop"
										settings={ settings }
										resolvedSettings={ resolved }
										onChange={ setResponsiveSetting }
									/>
								) }
								tabletControls={ () => (
									<ResponsiveControls
										device="tablet"
										settings={ settings }
										resolvedSettings={ resolved }
										onChange={ setResponsiveSetting }
									/>
								) }
								mobileControls={ () => (
									<ResponsiveControls
										device="mobile"
										settings={ settings }
										resolvedSettings={ resolved }
										onChange={ setResponsiveSetting }
									/>
								) }
							/>

							{ 'loop' === resolved.loopMode &&
								usesWidthSizing && (
									<Notice
										status="warning"
										isDismissible={ false }
									>
										{ __(
											'Loop mode requires at least the number of visible slides plus "Slides per group", and one more slide when centered. Check that there are enough slides at every responsive size.',
											'unitone'
										) }
									</Notice>
								) }
						</div>
					</ToolsPanelItem>
				) }

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'slidesOffsetBefore' ) }
					isShownByDefault
					label={ __( 'Container beginning offset', 'unitone' ) }
					onDeselect={ () => resetSetting( 'slidesOffsetBefore' ) }
				>
					<HelpContainer
						help={ __( 'Disabled when: Fade effect', 'unitone' ) }
						layout="horizontal"
					>
						<UnitControl
							__nextHasNoMarginBottom
							label={ __(
								'Container beginning offset',
								'unitone'
							) }
							value={
								'' === resolved.slidesOffsetBefore
									? ''
									: `${ resolved.slidesOffsetBefore }px`
							}
							units={ PIXEL_UNITS }
							disabled={ singleSlideEffect }
							onChange={ ( value ) =>
								setSetting(
									'slidesOffsetBefore',
									'' === value
										? ''
										: asPixelNumber(
												value,
												DEFAULT_SETTINGS.slidesOffsetBefore
										  )
								)
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'slidesOffsetAfter' ) }
					isShownByDefault
					label={ __( 'Container end offset', 'unitone' ) }
					onDeselect={ () => resetSetting( 'slidesOffsetAfter' ) }
				>
					<HelpContainer
						help={ __( 'Disabled when: Fade effect', 'unitone' ) }
						layout="horizontal"
					>
						<UnitControl
							__nextHasNoMarginBottom
							label={ __( 'Container end offset', 'unitone' ) }
							value={
								'' === resolved.slidesOffsetAfter
									? ''
									: `${ resolved.slidesOffsetAfter }px`
							}
							units={ PIXEL_UNITS }
							disabled={ singleSlideEffect }
							onChange={ ( value ) =>
								setSetting(
									'slidesOffsetAfter',
									'' === value
										? ''
										: asPixelNumber(
												value,
												DEFAULT_SETTINGS.slidesOffsetAfter
										  )
								)
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'speed' ) }
					isShownByDefault
					label={ __( 'Animation speed (ms)', 'unitone' ) }
					onDeselect={ () => resetSetting( 'speed' ) }
				>
					<TextControl
						__nextHasNoMarginBottom
						type="number"
						label={ __( 'Animation speed (ms)', 'unitone' ) }
						value={ String( resolved.speed ) }
						min={ 0 }
						step={ 10 }
						onChange={ ( value ) =>
							setSetting(
								'speed',
								'' === value
									? DEFAULT_SETTINGS.speed
									: asNumber( value, DEFAULT_SETTINGS.speed )
							)
						}
					/>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'loopMode' ) }
					isShownByDefault
					label={ __( 'Loop', 'unitone' ) }
					onDeselect={ () => resetSetting( 'loopMode' ) }
				>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						isBlock
						label={ __( 'Loop', 'unitone' ) }
						value={ resolved.loopMode }
						onChange={ ( value ) =>
							setSetting( 'loopMode', value )
						}
					>
						<ToggleGroupControlOption
							label={ __( 'Off', 'unitone' ) }
							value="none"
						/>
						<ToggleGroupControlOption
							label={ __( 'Loop', 'unitone' ) }
							value="loop"
						/>
						<ToggleGroupControlOption
							label={ __( 'Rewind', 'unitone' ) }
							value="rewind"
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'centeredSlides' ) }
					isShownByDefault
					label={ __( 'Center the active slide', 'unitone' ) }
					onDeselect={ () => resetSetting( 'centeredSlides' ) }
				>
					<HelpContainer
						help={ __( 'Disabled when: Fade effect', 'unitone' ) }
						layout="horizontal"
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Center the active slide', 'unitone' ) }
							checked={ resolved.centeredSlides }
							disabled={ singleSlideEffect }
							onChange={ ( value ) =>
								setSetting( 'centeredSlides', value )
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'snapToSlideEdge' ) }
					isShownByDefault
					label={ __( 'Snap to slide edge', 'unitone' ) }
					onDeselect={ () => resetSetting( 'snapToSlideEdge' ) }
				>
					<HelpContainer
						help={ __(
							'Disabled when: Fade effect, Loop is active, Center the active slide is active',
							'unitone'
						) }
						layout="horizontal"
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Snap to slide edge', 'unitone' ) }
							checked={ resolved.snapToSlideEdge }
							disabled={ snapToSlideEdgeDisabled }
							onChange={ ( value ) =>
								setSetting( 'snapToSlideEdge', value )
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'autoHeight' ) }
					isShownByDefault
					label={ __( 'Auto height', 'unitone' ) }
					onDeselect={ () => resetSetting( 'autoHeight' ) }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Auto height', 'unitone' ) }
						checked={ resolved.autoHeight }
						onChange={ ( value ) =>
							setSetting( 'autoHeight', value )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Touch', 'unitone' ) }
				resetAll={ () => resetSettings( [ 'allowTouchMove' ] ) }
			>
				<ToolsPanelItem
					hasValue={ () => hasSetting( 'allowTouchMove' ) }
					isShownByDefault
					label={ __( 'Allow touch move', 'unitone' ) }
					onDeselect={ () => resetSetting( 'allowTouchMove' ) }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Allow touch move', 'unitone' ) }
						checked={ resolved.allowTouchMove }
						onChange={ ( value ) =>
							setSetting( 'allowTouchMove', value )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Free mode', 'unitone' ) }
				resetAll={ () => resetSettings( [ 'freeMode' ] ) }
			>
				<ToolsPanelItem
					hasValue={ () => hasSetting( 'freeMode' ) }
					isShownByDefault
					label={ __( 'Free mode', 'unitone' ) }
					onDeselect={ () => resetSetting( 'freeMode' ) }
				>
					<HelpContainer
						help={ __(
							'Disabled when: Fade effect, Allow touch move is inactive, Snap to slide edge is active',
							'unitone'
						) }
						layout="horizontal"
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Free mode', 'unitone' ) }
							checked={ resolved.freeMode }
							disabled={ freeModeDisabled }
							onChange={ ( value ) =>
								setSetting( 'freeMode', value )
							}
						/>
					</HelpContainer>
				</ToolsPanelItem>
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Autoplay', 'unitone' ) }
				resetAll={ () =>
					resetSettings( [
						'autoplay',
						'autoplayDelay',
						'autoplayDisableOnInteraction',
						'autoplayReverseDirection',
						'autoplayPauseOnMouseEnter',
					] )
				}
			>
				<ToolsPanelItem
					hasValue={ () => hasSetting( 'autoplay' ) }
					isShownByDefault
					label={ __( 'Autoplay', 'unitone' ) }
					onDeselect={ () => resetSetting( 'autoplay' ) }
				>
					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Autoplay', 'unitone' ) }
						checked={ resolved.autoplay }
						onChange={ ( value ) =>
							setSetting( 'autoplay', value )
						}
					/>
				</ToolsPanelItem>

				{ resolved.autoplay && (
					<>
						<ToolsPanelItem
							hasValue={ () => hasSetting( 'autoplayDelay' ) }
							isShownByDefault
							label={ __( 'Delay (ms)', 'unitone' ) }
							onDeselect={ () => resetSetting( 'autoplayDelay' ) }
						>
							<TextControl
								__nextHasNoMarginBottom
								type="number"
								label={ __( 'Delay (ms)', 'unitone' ) }
								value={ String( resolved.autoplayDelay ) }
								min={ 0 }
								onChange={ ( value ) =>
									setSetting(
										'autoplayDelay',
										'' === value
											? DEFAULT_SETTINGS.autoplayDelay
											: asNumber(
													value,
													DEFAULT_SETTINGS.autoplayDelay
											  )
									)
								}
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSetting( 'autoplayDisableOnInteraction' )
							}
							isShownByDefault
							label={ __( 'Disable on interaction', 'unitone' ) }
							onDeselect={ () =>
								resetSetting( 'autoplayDisableOnInteraction' )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __(
									'Disable on interaction',
									'unitone'
								) }
								checked={
									resolved.autoplayDisableOnInteraction
								}
								onChange={ ( value ) =>
									setSetting(
										'autoplayDisableOnInteraction',
										value
									)
								}
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSetting( 'autoplayReverseDirection' )
							}
							isShownByDefault
							label={ __( 'Reverse direction', 'unitone' ) }
							onDeselect={ () =>
								resetSetting( 'autoplayReverseDirection' )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Reverse direction', 'unitone' ) }
								checked={ resolved.autoplayReverseDirection }
								onChange={ ( value ) =>
									setSetting(
										'autoplayReverseDirection',
										value
									)
								}
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSetting( 'autoplayPauseOnMouseEnter' )
							}
							isShownByDefault
							label={ __(
								'Pause on pointer enter over',
								'unitone'
							) }
							onDeselect={ () =>
								resetSetting( 'autoplayPauseOnMouseEnter' )
							}
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __(
									'Pause on pointer enter over',
									'unitone'
								) }
								checked={ resolved.autoplayPauseOnMouseEnter }
								onChange={ ( value ) =>
									setSetting(
										'autoplayPauseOnMouseEnter',
										value
									)
								}
							/>
						</ToolsPanelItem>
					</>
				) }
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Responsive settings', 'unitone' ) }
				resetAll={ () =>
					resetSettings( [
						'breakpointsBase',
						'smBreakpoint',
						'mdBreakpoint',
					] )
				}
			>
				<ToolsPanelItem
					hasValue={ () => hasSetting( 'breakpointsBase' ) }
					isShownByDefault
					label={ __( 'Responsive basis', 'unitone' ) }
					onDeselect={ () => resetSetting( 'breakpointsBase' ) }
				>
					<ToggleGroupControl
						__nextHasNoMarginBottom
						isBlock
						label={ __( 'Responsive basis', 'unitone' ) }
						value={ resolved.breakpointsBase }
						onChange={ ( value ) =>
							setSetting( 'breakpointsBase', value )
						}
					>
						<ToggleGroupControlOption
							label={ __( 'Viewport', 'unitone' ) }
							value="window"
						/>
						<ToggleGroupControlOption
							label={ __( 'This block', 'unitone' ) }
							value="container"
						/>
					</ToggleGroupControl>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'smBreakpoint' ) }
					isShownByDefault
					label={ __( 'Tablet breakpoint', 'unitone' ) }
					onDeselect={ () => resetSetting( 'smBreakpoint' ) }
				>
					<UnitControl
						__nextHasNoMarginBottom
						label={ __( 'Tablet breakpoint', 'unitone' ) }
						value={ `${ resolved.smBreakpoint }px` }
						units={ PIXEL_UNITS }
						min={ 1 }
						step={ 1 }
						onChange={ ( value ) =>
							setSetting(
								'smBreakpoint',
								'' === value
									? DEFAULT_SETTINGS.smBreakpoint
									: asPixelNumber(
											value,
											DEFAULT_SETTINGS.smBreakpoint
									  )
							)
						}
					/>
				</ToolsPanelItem>

				<ToolsPanelItem
					hasValue={ () => hasSetting( 'mdBreakpoint' ) }
					isShownByDefault
					label={ __( 'Desktop breakpoint', 'unitone' ) }
					onDeselect={ () => resetSetting( 'mdBreakpoint' ) }
				>
					<UnitControl
						__nextHasNoMarginBottom
						label={ __( 'Desktop breakpoint', 'unitone' ) }
						value={ `${ resolved.mdBreakpoint }px` }
						units={ PIXEL_UNITS }
						min={ resolved.smBreakpoint + 1 }
						step={ 1 }
						onChange={ ( value ) =>
							setSetting(
								'mdBreakpoint',
								'' === value
									? DEFAULT_SETTINGS.mdBreakpoint
									: asPixelNumber(
											value,
											DEFAULT_SETTINGS.mdBreakpoint
									  )
							)
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>
		</InspectorControls>
	);
};
