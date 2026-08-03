export const DEFAULT_SETTINGS = {
	type: 'bullets',
	dynamicBullets: false,
	bulletSize: 8,
	progressbarSize: 2,
};

const TYPES = [ 'bullets', 'fraction', 'progressbar' ];
const PIXEL_KEYS = [ 'bulletSize', 'progressbarSize' ];

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

	if ( 'dynamicBullets' === key ) {
		return true === value;
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

	if ( 'bullets' !== resolved.type ) {
		resolved.dynamicBullets = false;
	}

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
		'--swiper-pagination-bullet-size':
			hasSetting( source, 'bulletSize' ) &&
			DEFAULT_SETTINGS.bulletSize !== resolved.bulletSize
				? `${ resolved.bulletSize }px`
				: undefined,
		'--swiper-pagination-progressbar-size':
			hasSetting( source, 'progressbarSize' ) &&
			DEFAULT_SETTINGS.progressbarSize !== resolved.progressbarSize
				? `${ resolved.progressbarSize }px`
				: undefined,
	};
};

export const getDataSettings = ( settings = {} ) => {
	const resolved = resolveSettings( settings );

	return {
		type:
			DEFAULT_SETTINGS.type === resolved.type ? undefined : resolved.type,
		dynamicBullets: resolved.dynamicBullets || undefined,
	};
};
