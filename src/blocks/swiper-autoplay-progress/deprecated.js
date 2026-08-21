import clsx from 'clsx';

import { useBlockProps } from '@wordpress/block-editor';

import metadata from './block.json';

const DEFAULT_SETTINGS = {
	type: 'bar',
	thickness: 2,
	circleSize: 16,
};

const TYPES = [ 'bar', 'circle' ];

const hasSetting = ( settings, key ) =>
	Object.prototype.hasOwnProperty.call( settings, key );

const asPixelNumber = ( value, fallback ) => {
	const number = Number.parseFloat( value );
	return Number.isFinite( number ) ? Math.max( 1, number ) : fallback;
};

const resolveSettings = ( settings = {} ) => {
	const source = settings || {};
	const resolved = { ...DEFAULT_SETTINGS };

	if ( hasSetting( source, 'type' ) ) {
		resolved.type = TYPES.includes( source.type )
			? source.type
			: DEFAULT_SETTINGS.type;
	}

	[ 'thickness', 'circleSize' ].forEach( ( key ) => {
		if ( hasSetting( source, key ) ) {
			resolved[ key ] = asPixelNumber(
				source[ key ],
				DEFAULT_SETTINGS[ key ]
			);
		}
	} );

	return resolved;
};

const getStyle = ( settings = {} ) => {
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
			const settings = resolveSettings( attributes.settings );

			return (
				<div
					{ ...useBlockProps.save( {
						className: clsx(
							'unitone-swiper-autoplay-progress',
							`unitone-swiper-autoplay-progress--${ settings.type }`
						),
						style: getStyle( attributes.settings ),
						'aria-hidden': true,
					} ) }
				>
					<div className="unitone-swiper-autoplay-progress__track">
						<span className="unitone-swiper-autoplay-progress__fill" />
					</div>
				</div>
			);
		},
	},
];
