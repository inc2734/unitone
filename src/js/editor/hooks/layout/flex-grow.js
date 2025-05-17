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

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexGrow;
	}, [] );

	return null != __unstableUnitoneSupports?.flexBasis?.default
		? __unstableUnitoneSupports?.flexBasis?.default
		: defaultValue;
}

export function hasFlexGrowValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.flexGrow && undefined !== unitone?.flexGrow
	);
}

export function resetFlexGrowFilter() {
	return {
		flexGrow: undefined,
	};
}

export function resetFlexGrow( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetFlexGrowFilter() )
		),
	} );
}

export function useIsFlexGrowDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.flexGrow' ) &&
		! __unstableUnitoneSupports?.flexGrow
	);
}

export function getFlexGrowEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Fill', 'unitone' );
	const defaultCode = <code>flex-grow</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.flexGrow?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.flexGrow?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.flexGrow?.code || defaultCode }
		</>
	);
}

export function FlexGrowEdit( {
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

export function useFlexGrowBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( {
		name,
		__unstableUnitoneSupports,
	} );

	if ( ! hasBlockSupport( name, 'unitone.flexGrow' ) ) {
		if ( ! attributes?.__unstableUnitoneSupports?.flexGrow ) {
			return settings;
		}
	}

	const newFlexGrow = attributes?.unitone?.flexGrow ?? defaultValue;

	if ( null == newFlexGrow ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--flex-grow': newFlexGrow,
			},
		},
	};
}
