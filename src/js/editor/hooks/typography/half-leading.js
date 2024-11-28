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

function useBlockProps( extraProps, blockType, attributes ) {
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
		};
	}, [ blockType, extraProps?.style, attributes?.unitone?.halfLeading ] );

	return {
		...extraProps,
		style,
	};
}

export function useHalfLeadingBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const newHalfLeadingProp = useBlockProps( wrapperProps, name, {
		unitone: {
			halfLeading: attributes?.unitone?.halfLeading ?? undefined,
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
