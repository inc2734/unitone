import { useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';

const DEFAULT_SETTINGS = {
	hide: false,
	size: 2,
};

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const resolveSettings = ( settings = {} ) => {
	const source = settings || {};
	const size = Number.parseFloat( source.size );

	return {
		hide: hasSetting( source, 'hide' ) ? true === source.hide : false,
		size:
			hasSetting( source, 'size' ) && Number.isFinite( size )
				? Math.max( 1, size )
				: DEFAULT_SETTINGS.size,
	};
};

const getStyle = ( settings = {} ) => {
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

const getDataSettings = ( settings = {} ) => {
	const source = settings || {};
	const resolved = resolveSettings( source );

	return {
		hide: hasSetting( source, 'hide' ) ? resolved.hide : undefined,
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
				...resolveSettings( settings ),
			};
		},

		save( { attributes } ) {
			return (
				<div
					{ ...useBlockProps.save( {
						className: 'unitone-swiper-scrollbar swiper-scrollbar',
						style: getStyle( attributes.settings ),
						'data-unitone-swiper-scrollbar': JSON.stringify(
							getDataSettings( attributes.settings )
						),
					} ) }
				/>
			);
		},
	},
];
