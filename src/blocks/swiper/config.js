export const DEFAULT_SETTINGS = {
	slidesPerViewMode: 'number',
	slidesPerView: 1,
	autoSlideWidth: '100%',
	spaceBetween: 0,
	slidesPerGroup: 1,
	slidesOffsetBefore: 0,
	slidesOffsetAfter: 0,
	speed: 300,
	centeredSlides: false,
	snapToSlideEdge: false,
	autoHeight: false,
	loopMode: 'loop',
	effect: 'slide',
	fadeCrossFade: false,
	allowTouchMove: true,
	freeMode: false,
	autoplay: false,
	autoplayDelay: 3000,
	autoplayDisableOnInteraction: true,
	autoplayReverseDirection: false,
	autoplayPauseOnMouseEnter: false,
	breakpointsBase: 'window',
	smBreakpoint: 600,
	mdBreakpoint: 960,
};

const SLIDES_PER_VIEW_MODES = [ 'number', 'auto' ];

export const isSingleSlideEffect = ( effect ) => 'fade' === effect;

const BOOLEAN_KEYS = [
	'centeredSlides',
	'snapToSlideEdge',
	'autoHeight',
	'fadeCrossFade',
	'allowTouchMove',
	'freeMode',
	'autoplay',
	'autoplayDisableOnInteraction',
	'autoplayReverseDirection',
	'autoplayPauseOnMouseEnter',
];

const NUMBER_KEYS = [
	'spaceBetween',
	'slidesPerGroup',
	'slidesOffsetBefore',
	'slidesOffsetAfter',
	'speed',
	'autoplayDelay',
	'smBreakpoint',
	'mdBreakpoint',
];

const asNumber = ( value, fallback ) => {
	if ( '' === value || null == value ) {
		return fallback;
	}

	const number = Number( value );
	return Number.isFinite( number ) ? number : fallback;
};

const asPositiveInteger = ( value, fallback ) =>
	Math.max( 1, Math.round( asNumber( value, fallback ) ) );

const asEnum = ( value, allowed, fallback ) =>
	allowed.includes( value ) ? value : fallback;

export const parseSlidesPerView = (
	value,
	fallback = DEFAULT_SETTINGS.slidesPerView
) =>
	Math.min(
		10,
		Math.max( 0.5, Math.round( asNumber( value, fallback ) * 2 ) / 2 )
	);

export const resolveSettings = ( settings = {} ) => {
	const resolved = { ...DEFAULT_SETTINGS };

	Object.keys( DEFAULT_SETTINGS ).forEach( ( key ) => {
		if ( ! Object.prototype.hasOwnProperty.call( settings, key ) ) {
			return;
		}

		if ( BOOLEAN_KEYS.includes( key ) ) {
			resolved[ key ] = true === settings[ key ];
			return;
		}

		if ( NUMBER_KEYS.includes( key ) ) {
			resolved[ key ] = asNumber(
				settings[ key ],
				DEFAULT_SETTINGS[ key ]
			);
			return;
		}

		resolved[ key ] = settings[ key ];
	} );

	resolved.slidesPerViewMode = asEnum(
		resolved.slidesPerViewMode,
		SLIDES_PER_VIEW_MODES,
		DEFAULT_SETTINGS.slidesPerViewMode
	);
	resolved.slidesPerView = parseSlidesPerView( resolved.slidesPerView );
	resolved.slidesPerGroup = Math.min(
		10,
		asPositiveInteger(
			resolved.slidesPerGroup,
			DEFAULT_SETTINGS.slidesPerGroup
		)
	);
	resolved.smBreakpoint = asPositiveInteger(
		resolved.smBreakpoint,
		DEFAULT_SETTINGS.smBreakpoint
	);
	resolved.mdBreakpoint = Math.max(
		resolved.smBreakpoint + 1,
		asPositiveInteger(
			resolved.mdBreakpoint,
			DEFAULT_SETTINGS.mdBreakpoint
		)
	);
	resolved.loopMode = asEnum(
		resolved.loopMode,
		[ 'none', 'loop', 'rewind' ],
		DEFAULT_SETTINGS.loopMode
	);
	resolved.effect = asEnum(
		resolved.effect,
		[ 'slide', 'fade' ],
		DEFAULT_SETTINGS.effect
	);
	resolved.breakpointsBase = asEnum(
		resolved.breakpointsBase,
		[ 'window', 'container' ],
		DEFAULT_SETTINGS.breakpointsBase
	);
	resolved.autoSlideWidth =
		'string' === typeof resolved.autoSlideWidth &&
		resolved.autoSlideWidth.trim()
			? resolved.autoSlideWidth
			: DEFAULT_SETTINGS.autoSlideWidth;
	if ( 'loop' === resolved.loopMode ) {
		resolved.snapToSlideEdge = false;
	}

	if ( resolved.centeredSlides ) {
		resolved.snapToSlideEdge = false;
	}

	return resolved;
};

export const updateSetting = ( settings = {}, key, value ) => {
	const next = { ...settings };

	if ( DEFAULT_SETTINGS[ key ] === value ) {
		delete next[ key ];
	} else {
		next[ key ] = value;
	}

	return next;
};

export const updateResponsiveSetting = (
	settings = {},
	device,
	key,
	value
) => {
	const responsive = { ...( settings.responsive || {} ) };
	const deviceSettings = { ...( responsive[ device ] || {} ) };

	if ( '' === value || null == value ) {
		delete deviceSettings[ key ];
	} else {
		deviceSettings[ key ] = value;
	}

	if ( Object.keys( deviceSettings ).length ) {
		responsive[ device ] = deviceSettings;
	} else {
		delete responsive[ device ];
	}

	const next = { ...settings };
	if ( Object.keys( responsive ).length ) {
		next.responsive = responsive;
	} else {
		delete next.responsive;
	}

	return next;
};

const getResponsiveValue = ( settings, device, key, fallback ) => {
	const value = settings?.responsive?.[ device ]?.[ key ];
	return '' === value || null == value ? fallback : value;
};

const asAutoSlideWidth = ( value, fallback ) =>
	'string' === typeof value && value.trim() ? value : fallback;

const resolveResponsiveDeviceSettings = (
	rawSettings,
	device,
	inheritedSettings
) => {
	const deviceSettings = rawSettings?.responsive?.[ device ] || {};
	const hasExplicitSlidesPerViewMode = SLIDES_PER_VIEW_MODES.includes(
		deviceSettings.slidesPerViewMode
	);

	return {
		slidesPerViewMode: hasExplicitSlidesPerViewMode
			? deviceSettings.slidesPerViewMode
			: inheritedSettings.slidesPerViewMode,
		slidesPerView: hasExplicitSlidesPerViewMode
			? parseSlidesPerView(
					deviceSettings.slidesPerView,
					DEFAULT_SETTINGS.slidesPerView
			  )
			: inheritedSettings.slidesPerView,
		autoSlideWidth: hasExplicitSlidesPerViewMode
			? asAutoSlideWidth(
					deviceSettings.autoSlideWidth,
					inheritedSettings.autoSlideWidth
			  )
			: inheritedSettings.autoSlideWidth,
		slidesPerGroup: Math.min(
			10,
			asPositiveInteger(
				getResponsiveValue(
					rawSettings,
					device,
					'slidesPerGroup',
					inheritedSettings.slidesPerGroup
				),
				inheritedSettings.slidesPerGroup
			)
		),
		spaceBetween: asNumber(
			getResponsiveValue(
				rawSettings,
				device,
				'spaceBetween',
				inheritedSettings.spaceBetween
			),
			inheritedSettings.spaceBetween
		),
	};
};

export const resolveResponsiveSettings = (
	rawSettings = {},
	settings = resolveSettings( rawSettings )
) => {
	const desktop = {
		slidesPerViewMode: settings.slidesPerViewMode,
		slidesPerView: settings.slidesPerView,
		autoSlideWidth: settings.autoSlideWidth,
		slidesPerGroup: settings.slidesPerGroup,
		spaceBetween: settings.spaceBetween,
	};
	const tablet = resolveResponsiveDeviceSettings(
		rawSettings,
		'tablet',
		desktop
	);
	const mobile = resolveResponsiveDeviceSettings(
		rawSettings,
		'mobile',
		tablet
	);

	return { desktop, tablet, mobile };
};

const getResponsiveOptions = ( values ) => {
	return {
		slidesPerView:
			'auto' === values.slidesPerViewMode ? 'auto' : values.slidesPerView,
		unitoneAutoSlideWidth: values.autoSlideWidth,
		slidesPerGroup: values.slidesPerGroup,
		spaceBetween: values.spaceBetween,
	};
};

const buildResponsiveOptions = ( rawSettings, settings ) => {
	const responsiveSettings = resolveResponsiveSettings(
		rawSettings,
		settings
	);

	return {
		desktop: getResponsiveOptions( responsiveSettings.desktop ),
		tablet: getResponsiveOptions( responsiveSettings.tablet ),
		mobile: getResponsiveOptions( responsiveSettings.mobile ),
	};
};

export const buildSwiperOptions = ( rawSettings = {} ) => {
	const settings = resolveSettings( rawSettings );
	const configuredResponsive = buildResponsiveOptions(
		rawSettings,
		settings
	);
	const singleSlideEffect = isSingleSlideEffect( settings.effect );
	const singleSlideLayout = {
		slidesPerView: 1,
		unitoneAutoSlideWidth: '100%',
		slidesPerGroup: 1,
		spaceBetween: 0,
	};
	const responsive = singleSlideEffect
		? {
				desktop: { ...singleSlideLayout },
				tablet: { ...singleSlideLayout },
				mobile: { ...singleSlideLayout },
		  }
		: configuredResponsive;

	const options = {
		direction: 'horizontal',
		speed: Math.max( 0, settings.speed ),
		slidesPerView: responsive.mobile.slidesPerView,
		unitoneAutoSlideWidth: responsive.mobile.unitoneAutoSlideWidth,
		slidesPerGroup: responsive.mobile.slidesPerGroup,
		spaceBetween: responsive.mobile.spaceBetween,
		slidesOffsetBefore: singleSlideEffect ? 0 : settings.slidesOffsetBefore,
		slidesOffsetAfter: singleSlideEffect ? 0 : settings.slidesOffsetAfter,
		centeredSlides: singleSlideEffect ? false : settings.centeredSlides,
		snapToSlideEdge: singleSlideEffect ? false : settings.snapToSlideEdge,
		autoHeight: settings.autoHeight,
		loop: 'loop' === settings.loopMode,
		rewind: 'rewind' === settings.loopMode,
		loopAddBlankSlides: true,
		loopAdditionalSlides: 0,
		loopPreventsSliding: true,
		effect: settings.effect,
		allowTouchMove: settings.allowTouchMove,
		grabCursor: settings.allowTouchMove,
		slideToClickedSlide: false,
		freeMode: settings.freeMode
			? {
					enabled: true,
					sticky: false,
			  }
			: false,
		autoplay: settings.autoplay
			? {
					delay: Math.max( 0, settings.autoplayDelay ),
					disableOnInteraction: settings.autoplayDisableOnInteraction,
					reverseDirection: settings.autoplayReverseDirection,
					pauseOnMouseEnter: settings.autoplayPauseOnMouseEnter,
			  }
			: false,
		watchOverflow: true,
		updateOnWindowResize: true,
		resizeObserver: true,
		passiveListeners: true,
		breakpointsBase: settings.breakpointsBase,
		fadeEffect: {
			crossFade: settings.fadeCrossFade,
		},
	};

	if ( rawSettings.responsive ) {
		options.breakpoints = {
			[ settings.smBreakpoint ]: responsive.tablet,
			[ settings.mdBreakpoint ]: responsive.desktop,
		};
	}

	return options;
};

export const getStyle = ( rawSettings = {} ) => {
	const source = rawSettings || {};
	const settings = resolveSettings( source );
	const hasAutoSlideWidth = Object.prototype.hasOwnProperty.call(
		source,
		'autoSlideWidth'
	);

	return {
		'--unitone--auto-slide-width':
			hasAutoSlideWidth &&
			DEFAULT_SETTINGS.autoSlideWidth !== settings.autoSlideWidth
				? settings.autoSlideWidth
				: undefined,
	};
};

const EDITOR_DEVICES = [ 'mobile', 'tablet', 'desktop' ];

const getEditorDeviceProperty = ( device, property ) =>
	`--unitone--editor-${ device }-${ property }`;

const getEditorDeviceStyle = ( device, deviceSettings ) => {
	const isAuto = 'auto' === deviceSettings.slidesPerViewMode;
	const { autoSlideWidth, slidesPerView, spaceBetween } = deviceSettings;
	const slideSize = isAuto
		? 'auto'
		: `calc((100% - (${ slidesPerView } - 1) * ${ spaceBetween }px) / ${ slidesPerView })`;

	return {
		[ getEditorDeviceProperty( device, 'auto-slide-width' ) ]:
			autoSlideWidth,
		[ getEditorDeviceProperty(
			device,
			'space-between'
		) ]: `${ spaceBetween }px`,
		[ getEditorDeviceProperty( device, 'slide-size' ) ]: slideSize,
		[ getEditorDeviceProperty( device, 'slide-width' ) ]: isAuto
			? `var(${ getEditorDeviceProperty( device, 'auto-slide-width' ) })`
			: '100%',
	};
};

const getActiveEditorDeviceStyle = ( device ) => ( {
	'--unitone--auto-slide-width': `var(${ getEditorDeviceProperty(
		device,
		'auto-slide-width'
	) })`,
	'--unitone--editor-space-between': `var(${ getEditorDeviceProperty(
		device,
		'space-between'
	) })`,
	'--unitone--editor-slide-size': `var(${ getEditorDeviceProperty(
		device,
		'slide-size'
	) })`,
	'--unitone--slide-width': `var(${ getEditorDeviceProperty(
		device,
		'slide-width'
	) })`,
} );

const getSingleSlideResponsiveSettings = () => ( {
	desktop: {
		slidesPerViewMode: 'number',
		slidesPerView: 1,
		autoSlideWidth: '100%',
		spaceBetween: 0,
	},
	tablet: {
		slidesPerViewMode: 'number',
		slidesPerView: 1,
		autoSlideWidth: '100%',
		spaceBetween: 0,
	},
	mobile: {
		slidesPerViewMode: 'number',
		slidesPerView: 1,
		autoSlideWidth: '100%',
		spaceBetween: 0,
	},
} );

export const getEditorIdentifier = ( clientId = '' ) =>
	`unitone-swiper-${ String( clientId ).replace( /[^a-zA-Z0-9_-]/g, '-' ) }`;

export const getEditorStyle = (
	rawSettings = {},
	settings = resolveSettings( rawSettings )
) => {
	const responsiveSettings = isSingleSlideEffect( settings.effect )
		? getSingleSlideResponsiveSettings()
		: resolveResponsiveSettings( rawSettings, settings );

	return {
		...EDITOR_DEVICES.reduce(
			( style, device ) => ( {
				...style,
				...getEditorDeviceStyle( device, responsiveSettings[ device ] ),
			} ),
			{}
		),
		...getActiveEditorDeviceStyle( 'desktop' ),
	};
};

const getEditorDeviceDeclarations = ( device ) =>
	Object.entries( getActiveEditorDeviceStyle( device ) )
		.map( ( [ property, value ] ) => `${ property }: ${ value };` )
		.join( ' ' );

export const getEditorResponsiveCSS = (
	rawSettings = {},
	clientId = '',
	settings = resolveSettings( rawSettings )
) => {
	if ( isSingleSlideEffect( settings.effect ) ) {
		return '';
	}

	const editorIdentifier = getEditorIdentifier( clientId );
	const selector = `[data-unitone-swiper-editor-id="${ editorIdentifier }"]`;
	const isContainer = 'container' === settings.breakpointsBase;
	const target = `${ selector } > *`;
	const buildCSS = ( breakpoint, device ) => {
		const query = isContainer
			? `@container ${ editorIdentifier } not`
			: '@media not all and';

		return `${ query } (min-width: ${ breakpoint }px) { ${ target } { ${ getEditorDeviceDeclarations(
			device
		) } } }`;
	};

	return [
		buildCSS( settings.mdBreakpoint, 'tablet' ),
		buildCSS( settings.smBreakpoint, 'mobile' ),
	].join( '\n' );
};
