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
	unitone,
	__unstableUnitoneSupports,
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

export function resetFlexBasis( { unitone, setAttributes } ) {
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

export function getFlexBasisEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.flexBasis?.label ||
		__( 'Recommended width', 'unitone' )
	);
}

export function FlexBasisEdit( {
	name,
	label,
	unitone,
	__unstableUnitoneSupports,
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

export function saveFlexBasisProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.flexBasis' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.flexBasis ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.flexBasis ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-basis': attributes?.unitone?.flexBasis,
	};

	return extraProps;
}

export function useFlexBasisBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( {
		name,
		__unstableUnitoneSupports,
	} );

	const newFlexBasisProp = useMemo( () => {
		return saveFlexBasisProp( wrapperProps, name, {
			__unstableUnitoneSupports,
			unitone: {
				flexBasis: attributes?.unitone?.flexBasis ?? defaultValue,
			},
		} );
	}, [ JSON.stringify( attributes?.unitone ) ] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newFlexBasisProp,
		},
	};
}
