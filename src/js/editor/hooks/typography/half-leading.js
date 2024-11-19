import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useMemo } from '@wordpress/element';

import { cleanEmptyObject, isNumber } from '../utils';

export function hasHalfLeadingValue( { unitone } ) {
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

export function resetHalfLeading( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetHalfLeadingFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsHalfLeadingDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.halfLeading' );
}

export function HalfLeadingEdit( { label, unitone, setAttributes } ) {
	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
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
			step={ 0.1 }
		/>
	);
}

export function saveHalfLeadingProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.halfLeading' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.halfLeading ) {
		return extraProps;
	}

	return {
		...extraProps,
		style: {
			...extraProps.style,
			'--unitone--half-leading': attributes?.unitone?.halfLeading,
		},
	};
}

export function useHalfLeadingBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newHalfLeadingProp = useMemo( () => {
		return saveHalfLeadingProp( wrapperProps, name, {
			unitone: {
				halfLeading: attributes?.unitone?.halfLeading ?? undefined,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newHalfLeadingProp,
		},
	};
}
