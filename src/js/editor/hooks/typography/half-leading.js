import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '@wordpress/api-fetch';

import { cleanEmptyObject, isNumber } from '../utils';

export function hasHalfLeadingValue( { attributes: { unitone } } ) {
	return unitone?.halfLeading !== undefined;
}

export function resetHalfLeadingFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			halfLeading: undefined,
		},
	};
}

export function resetHalfLeading( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetHalfLeadingFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsHalfLeadingDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.halfLeading' );
}

export function HalfLeadingEdit( {
	label,
	help,
	attributes: { unitone },
	setAttributes,
} ) {
	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			value={ unitone?.halfLeading }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					halfLeading: isNumber( newValue ) ? newValue : undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			allowReset={ true }
			min={ 0 }
			max={ 1 }
			step={ 0.05 }
		/>
	);
}

export function useHalfLeadingBlockProps( settings ) {
	const { attributes, name } = settings;

	const [ baseHalfLeading, setBaseHalfLeading ] = useState();
	const [ baseMinHalfLeading, setBaseMinHalfLeading ] = useState();

	const newHalfLeading = attributes?.unitone?.halfLeading;

	useEffect( () => {
		if ( ! hasBlockSupport( name, 'unitone.halfLeading' ) ) {
			return;
		}

		if ( null != newHalfLeading ) {
			apiFetch( {
				path: addQueryArgs( '/unitone/v1/settings', {
					keys: [ 'half-leading', 'min-half-leading' ],
				} ),
			} ).then( ( themeSettings ) => {
				setBaseHalfLeading(
					parseFloat( themeSettings?.[ 'half-leading' ] )
				);
				setBaseMinHalfLeading(
					parseFloat( themeSettings?.[ 'min-half-leading' ] )
				);
			} );
		} else {
			setBaseHalfLeading( undefined );
			setBaseMinHalfLeading( undefined );
		}
	}, [ newHalfLeading ] );

	if ( ! hasBlockSupport( name, 'unitone.halfLeading' ) ) {
		return settings;
	}

	if ( undefined === newHalfLeading ) {
		return settings;
	}

	const diff =
		null != newHalfLeading &&
		null != baseHalfLeading &&
		null != baseMinHalfLeading &&
		( newHalfLeading > baseHalfLeading ||
			newHalfLeading < baseMinHalfLeading )
			? parseFloat( ( newHalfLeading - baseHalfLeading ).toFixed( 2 ) )
			: undefined;

	let newMinHalfLeading;
	if ( null != baseMinHalfLeading && null != diff ) {
		newMinHalfLeading = parseFloat(
			( baseMinHalfLeading + diff ).toFixed( 2 )
		);
		if ( 0 > newMinHalfLeading ) {
			newMinHalfLeading = 0;
		}
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--half-leading': newHalfLeading,
				'--unitone--min-half-leading': newMinHalfLeading,
			},
		},
	};
}
