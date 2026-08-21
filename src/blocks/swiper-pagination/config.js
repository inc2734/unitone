import metadata from './block.json';

export const DEFAULT_SETTINGS = {
	type: metadata.attributes.type.default,
	dynamicBullets: metadata.attributes.dynamicBullets.default,
	bulletSize: metadata.attributes.bulletSize.default,
	progressbarSize: metadata.attributes.progressbarSize.default,
};

const TYPES = [ 'bullets', 'fraction', 'progressbar' ];
const PIXEL_KEYS = [ 'bulletSize', 'progressbarSize' ];

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const asPixelNumber = ( value, fallback ) => {
	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? Math.max( 1, number ) : fallback;
};

export const normalizeSetting = ( key, value ) => {
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
