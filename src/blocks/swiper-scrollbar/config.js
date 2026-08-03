export const DEFAULT_SETTINGS = {
	hide: true,
	size: 2,
};

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const asPixelNumber = ( value, fallback ) => {
	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? Math.max( 1, number ) : fallback;
};

const normalizeSetting = ( key, value ) => {
	if ( 'hide' === key ) {
		return true === value;
	}

	if ( 'size' === key ) {
		return asPixelNumber( value, DEFAULT_SETTINGS.size );
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
		'--swiper-scrollbar-size':
			hasSetting( source, 'size' ) &&
			DEFAULT_SETTINGS.size !== resolved.size
				? `${ resolved.size }px`
				: undefined,
	};
};

export const getDataSettings = ( settings = {} ) => {
	const resolved = resolveSettings( settings );

	return {
		hide:
			DEFAULT_SETTINGS.hide === resolved.hide ? undefined : resolved.hide,
	};
};
