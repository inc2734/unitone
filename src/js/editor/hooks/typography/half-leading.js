import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';

import { cleanEmptyObject, isNumber } from '../utils';

export function hasHalfLeadingValue( { attributes: { unitone } } ) {
	return unitone?.halfLeading !== undefined;
}

export function resetHalfLeadingFilter() {
	return {
		halfLeading: undefined,
	};
}

export function resetHalfLeading( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetHalfLeadingFilter() )
		),
	} );
}

export function isHalfLeadingSupportDisabled( { name } ) {
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

export function withHalfLeadingBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.halfLeading' ) ) {
		return settings;
	}

	const newHalfLeading = attributes?.unitone?.halfLeading;

	if ( undefined === newHalfLeading ) {
		return settings;
	}

	const baseHalfLeading =
		null != unitone?.halfLeading
			? parseFloat( unitone?.halfLeading )
			: undefined;
	const baseMinHalfLeading =
		null != unitone?.minHalfLeading
			? parseFloat( unitone?.minHalfLeading )
			: undefined;

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
