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

export function resetFlexBasisFilter() {
	return {
		flexBasis: undefined,
	};
}

export function resetFlexBasis( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetFlexBasisFilter() )
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
			__next40pxDefaultSize
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

export function useFlexBasisBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( {
		name,
		__unstableUnitoneSupports,
	} );

	if ( ! hasBlockSupport( name, 'unitone.flexBasis' ) ) {
		if ( ! attributes?.__unstableUnitoneSupports?.flexBasis ) {
			return settings;
		}
	}

	const newFlexBasis = attributes?.unitone?.flexBasis ?? defaultValue;

	if ( null == newFlexBasis ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--flex-basis': newFlexBasis,
			},
		},
	};
}
