import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.flexGrow?.default
		? __unstableUnitoneSupports?.flexGrow?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.flexGrow;
}

export function hasFlexGrowValue( {
	name,
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.flexGrow && undefined !== unitone?.flexGrow
	);
}

export function resetFlexGrowFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			flexGrow: undefined,
		},
	};
}

export function resetFlexGrow( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetFlexGrowFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsFlexGrowDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.flexGrow' ) &&
		! __unstableUnitoneSupports?.flexGrow
	);
}

export function getFlexGrowEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.flexGrow?.label || __( 'Fill', 'unitone' )
	);
}

export function FlexGrowEdit( {
	name,
	label,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexGrow;
	}, [] );
	if ( null != __unstableUnitoneSupports?.flexGrow?.default ) {
		defaultValue = __unstableUnitoneSupports?.flexGrow?.default;
	}

	return (
		<RangeControl
			__nextHasNoMarginBottom
			label={ label }
			value={
				null != unitone?.flexGrow
					? parseInt( unitone?.flexGrow )
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
					flexGrow: newValue || undefined,
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

export function saveFlexGrowProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.flexGrow' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.flexGrow ) {
			return extraProps;
		}
	}

	const defaultValue = getDefaultValue( {
		name: blockType,
		__unstableUnitoneSupports: attributes?.__unstableUnitoneSupports,
	} );

	if ( null == attributes?.unitone?.flexGrow ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				flexGrow: defaultValue,
			},
		};
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-grow': attributes?.unitone?.flexGrow,
	};

	return extraProps;
}

export function useFlexGrowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveFlexGrowProp( wrapperProps, name, attributes ),
		},
	};
}
