import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.flexBasis?.default
		? __unstableUnitoneSupports?.flexBasis?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.flexBasis;
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
	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.flexBasis;
	}, [] );
	if ( null != __unstableUnitoneSupports?.flexBasis?.default ) {
		defaultValue = __unstableUnitoneSupports?.flexBasis?.default;
	}

	return (
		<TextControl
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

	const defaultValue = getDefaultValue( {
		name: blockType,
		__unstableUnitoneSupports: attributes?.__unstableUnitoneSupports,
	} );

	if ( null == attributes?.unitone?.flexBasis ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				flexBasis: defaultValue,
			},
		};
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-basis': attributes?.unitone?.flexBasis,
	};

	return extraProps;
}

export function useFlexBasisBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveFlexBasisProp( wrapperProps, name, attributes ),
		},
	};
}
