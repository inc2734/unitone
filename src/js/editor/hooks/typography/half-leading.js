import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useMemo, useState, useEffect } from '@wordpress/element';
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

function useBlockProps( extraProps, blockType, attributes ) {
	const [ baseHalfLeading, setBaseHalfLeading ] = useState();
	const [ baseMinHalfLeading, setBaseMinHalfLeading ] = useState();

	useEffect( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.halfLeading' ) ) {
			return;
		}

		if ( null != attributes?.unitone?.halfLeading ) {
			( async () => {
				await apiFetch( {
					path: addQueryArgs( '/unitone/v1/settings', {
						keys: [ 'half-leading', 'min-half-leading' ],
					} ),
				} ).then( ( settings ) => {
					setBaseHalfLeading(
						parseFloat( settings?.[ 'half-leading' ] )
					);
					setBaseMinHalfLeading(
						parseFloat( settings?.[ 'min-half-leading' ] )
					);
				} );
			} )();
		} else {
			setBaseHalfLeading( undefined );
			setBaseMinHalfLeading( undefined );
		}
	}, [ attributes?.unitone?.halfLeading ] );

	const newHalfLeading = attributes?.unitone?.halfLeading;
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

	const style = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.halfLeading' ) ) {
			return extraProps?.style;
		}

		if ( undefined === attributes?.unitone?.halfLeading ) {
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--half-leading': attributes?.unitone?.halfLeading,
			'--unitone--min-half-leading': newMinHalfLeading,
		};
	}, [
		blockType,
		extraProps?.style,
		attributes?.unitone?.halfLeading,
		newMinHalfLeading,
	] );

	return {
		...extraProps,
		style,
	};
}

export function useHalfLeadingBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newHalfLeadingProp = useBlockProps( wrapperProps, name, {
		unitone: {
			halfLeading: attributes?.unitone?.halfLeading,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newHalfLeadingProp,
		},
	};
}
