import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.flexShrink?.default
		? __unstableUnitoneSupports?.flexShrink?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.flexShrink;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexShrink;
	}, [] );

	return null != __unstableUnitoneSupports?.flexShrink?.default
		? __unstableUnitoneSupports?.flexShrink?.default
		: defaultValue;
}

export function hasFlexShrinkValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.flexShrink &&
		undefined !== unitone?.flexShrink
	);
}

export function resetFlexShrinkFilter() {
	return {
		flexShrink: undefined,
	};
}

export function resetFlexShrink( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetFlexShrinkFilter() )
		),
	} );
}

export function isFlexShrinkSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.flexShrink' ) &&
		! __unstableUnitoneSupports?.flexShrink
	);
}

export function getFlexShrinkEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Fit', 'unitone' );
	const defaultCode = <code>flex-shrink</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.flexShrink?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.flexShrink?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.flexShrink?.code || defaultCode }
		</>
	);
}

export function FlexShrinkEdit( {
	name,
	label,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		<RangeControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={
				null != ( unitone?.flexShrink || defaultValue )
					? parseInt( unitone?.flexShrink || defaultValue )
					: ''
			}
			allowReset={ true }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					flexShrink: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
			min={ 0 }
			max={ 10 }
			step={ 1 }
		/>
	);
}

export function withFlexShrinkBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.flexShrink' ) ) {
		if ( ! __unstableUnitoneSupports?.flexShrink ) {
			return settings;
		}
	}

	const newFlexShrink = attributes?.unitone?.flexShrink;

	if ( null == newFlexShrink ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--flex-shrink': newFlexShrink,
			},
		},
	};
}
