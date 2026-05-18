import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForRangeControl } from '../utils';

export function isOpacitySupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.opacity' );
}

export function resetOpacityFilter() {
	return {
		opacity: undefined,
	};
}

export function OpacityEdit( { attributes: { unitone }, setAttributes } ) {
	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ __( 'Opacity', 'unitone' ) }
			value={ unitone?.opacity }
			onChange={ ( newValue ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						opacity: normalizeForRangeControl( newValue ),
					} ),
				} );
			} }
			allowReset={ true }
			min={ 0 }
			max={ 1 }
			step={ 0.05 }
		/>
	);
}

export function withOpacityBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	if ( isOpacitySupportDisabled( { name } ) ) {
		return settings;
	}

	const opacity = attributes?.unitone?.opacity;

	if ( undefined === opacity ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...wrapperProps,
			style: {
				...wrapperProps?.style,
				'--unitone--opacity': opacity,
			},
		},
	};
}
