import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
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
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.flexShrink &&
		undefined !== unitone?.flexShrink
	);
}

export function resetFlexShrinkFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			flexShrink: undefined,
		},
	};
}

export function resetFlexShrink( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetFlexShrinkFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsFlexShrinkDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.flexShrink' ) &&
		! __unstableUnitoneSupports?.flexShrink
	);
}

export function getFlexShrinkEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.flexShrink?.label || __( 'Fit', 'unitone' )
	);
}

export function FlexShrinkEdit( {
	name,
	label,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
			value={
				null != unitone?.flexShrink
					? parseInt( unitone?.flexShrink )
					: defaultValue
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

export function saveFlexShrinkProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.flexShrink' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.flexShrink ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.flexShrink ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-shrink': attributes?.unitone?.flexShrink,
	};

	return extraProps;
}

export function useFlexShrinkBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	const newFlexShrinkProp = useMemo( () => {
		return saveFlexShrinkProp( wrapperProps, name, {
			__unstableUnitoneSupports,
			unitone: {
				flexShrink: attributes?.unitone?.flexShrink ?? defaultValue,
			},
		} );
	}, [ JSON.stringify( attributes?.unitone ) ] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newFlexShrinkProp,
		},
	};
}
