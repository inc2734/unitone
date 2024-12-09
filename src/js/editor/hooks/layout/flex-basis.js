import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.flexBasis?.default
		? __unstableUnitoneSupports?.flexBasis?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.flexBasis;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexBasis;
	}, [] );

	return null != __unstableUnitoneSupports?.flexBasis?.default
		? __unstableUnitoneSupports?.flexBasis?.default
		: defaultValue;
}

export function hasFlexBasisValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.flexBasis && undefined !== unitone?.flexBasis
	);
}

export function resetFlexBasisFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			flexBasis: undefined,
		},
	};
}

export function resetFlexBasis( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetFlexBasisFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsFlexBasisDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.flexBasis' ) &&
		! __unstableUnitoneSupports?.flexBasis
	);
}

export function getFlexBasisEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Recommended width', 'unitone' );
	const defaultCode = <code>flex-basis</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.flexBasis?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.flexBasis?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.flexBasis?.code || defaultCode }
		</>
	);
}

export function FlexBasisEdit( {
	name,
	label,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.flexBasis ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					flexBasis: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const style = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.flexBasis' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.flexBasis ) {
				return extraProps?.style;
			}
		}

		if ( null == attributes?.unitone?.flexBasis ) {
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--flex-basis': attributes?.unitone?.flexBasis,
		};
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.flexBasis,
		extraProps?.style,
		attributes?.unitone?.flexBasis,
	] );

	return {
		...extraProps,
		style,
	};
}

export function useFlexBasisBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( {
		name,
		__unstableUnitoneSupports,
	} );

	const newFlexBasisProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			flexBasis: attributes?.unitone?.flexBasis ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newFlexBasisProp,
		},
	};
}
