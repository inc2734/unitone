export const DEFAULT_SETTINGS = {
	type: 'bar',
	thickness: 2,
	circleSize: 16,
};

const TYPES = [ 'bar', 'circle' ];
const PIXEL_KEYS = [ 'thickness', 'circleSize' ];

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const asPixelNumber = ( value, fallback ) => {
	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? Math.max( 1, number ) : fallback;
};

const normalizeSetting = ( key, value ) => {
	if ( 'type' === key ) {
		return TYPES.includes( value ) ? value : DEFAULT_SETTINGS.type;
	}

	if ( PIXEL_KEYS.includes( key ) ) {
		return asPixelNumber( value, DEFAULT_SETTINGS[ key ] );
	}

	return value;
};

export const resolveSettings = ( settings = {} ) => {
	const source = settings || {};
	const resolved = { ...DEFAULT_SETTINGS };

	Object.keys( DEFAULT_SETTINGS ).forEach( ( key ) => {
		if ( hasSetting( source, key ) ) {
			resolved[ key ] = normalizeSetting( key, source[ key ] );
		}
	} );

	return resolved;
};

export const updateSetting = ( settings = {}, key, value ) => {
	const next = { ...( settings || {} ) };
	const normalized = normalizeSetting( key, value );

	if ( DEFAULT_SETTINGS[ key ] === normalized ) {
		delete next[ key ];
	} else {
		next[ key ] = normalized;
	}

	return next;
};

export const getStyle = ( settings = {} ) => {
	const source = settings || {};
	const resolved = resolveSettings( source );

	return {
		'--unitone--swiper-autoplay-progress-thickness':
			hasSetting( source, 'thickness' ) &&
			DEFAULT_SETTINGS.thickness !== resolved.thickness
				? `${ resolved.thickness }px`
				: undefined,
		'--unitone--swiper-autoplay-progress-circle-size':
			hasSetting( source, 'circleSize' ) &&
			DEFAULT_SETTINGS.circleSize !== resolved.circleSize
				? `${ resolved.circleSize }px`
				: undefined,
	};
};
