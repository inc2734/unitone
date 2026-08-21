import { useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';

const DEFAULT_SETTINGS = {
	type: 'bullets',
	dynamicBullets: false,
	bulletSize: 8,
	progressbarSize: 2,
};

const TYPES = [ 'bullets', 'fraction', 'progressbar' ];

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const asPixelNumber = ( value, fallback ) => {
	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? Math.max( 1, number ) : fallback;
};

const normalizeSettings = ( settings = {} ) => {
	const source = settings || {};

	return {
		type:
			hasSetting( source, 'type' ) && TYPES.includes( source.type )
				? source.type
				: DEFAULT_SETTINGS.type,
		dynamicBullets:
			hasSetting( source, 'dynamicBullets' ) &&
			true === source.dynamicBullets,
		bulletSize: hasSetting( source, 'bulletSize' )
			? asPixelNumber( source.bulletSize, DEFAULT_SETTINGS.bulletSize )
			: DEFAULT_SETTINGS.bulletSize,
		progressbarSize: hasSetting( source, 'progressbarSize' )
			? asPixelNumber(
					source.progressbarSize,
					DEFAULT_SETTINGS.progressbarSize
			  )
			: DEFAULT_SETTINGS.progressbarSize,
	};
};

const resolveSettings = ( settings = {} ) => {
	const resolved = normalizeSettings( settings );

	if ( 'bullets' !== resolved.type ) {
		resolved.dynamicBullets = false;
	}

	return resolved;
};

const getStyle = ( settings = {} ) => {
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

const getDataSettings = ( settings = {} ) => {
	const resolved = resolveSettings( settings );

	return {
		type:
			DEFAULT_SETTINGS.type === resolved.type ? undefined : resolved.type,
		dynamicBullets: resolved.dynamicBullets || undefined,
	};
};

export default [
	{
		attributes: {
			settings: {
				type: 'object',
				default: {},
			},
		},
		supports: metadata.supports,

		migrate( attributes ) {
			const { settings, ...otherAttributes } = attributes;

			return {
				...otherAttributes,
				...normalizeSettings( settings ),
			};
		},

		save( { attributes } ) {
			return (
				<div
					{ ...useBlockProps.save( {
						className:
							'unitone-swiper-pagination swiper-pagination',
						style: getStyle( attributes.settings ),
						'data-unitone-swiper-pagination': JSON.stringify(
							getDataSettings( attributes.settings )
						),
					} ) }
				/>
			);
		},
	},
];
