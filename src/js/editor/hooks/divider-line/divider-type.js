import clsx from 'clsx';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForSelectControl } from '../utils';

const getDividerTypeOptions = ( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) => {
	const options =
		getBlockSupport( name, 'unitone.dividerType' ) ||
		__unstableUnitoneSupports?.dividerType?.options ||
		__unstableUnitoneSupports?.dividerType;

	const list = [
		{
			label: __( 'None', 'unitone' ),
			value: '',
		},
		{
			label: __( 'Stripe', 'unitone' ),
			value: 'stripe',
		},
		{
			label: __( 'Stripe (Vertical)', 'unitone' ),
			value: 'stripe-vertical',
		},
		{
			label: __( 'Divide', 'unitone' ),
			value: 'divide',
		},
		{
			label: __( 'Divide (Vertical)', 'unitone' ),
			value: 'divide-vertical',
		},
		{
			label: __( 'Underline', 'unitone' ),
			value: 'underline',
		},
		{
			label: __( 'Slash', 'unitone' ),
			value: 'slash',
		},
		{
			label: __( 'Bordered', 'unitone' ),
			value: 'bordered',
		},
	];

	return list.filter( ( value ) => {
		return options?.includes( value.value );
	} );
};

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.dividerType;
	const unstableDefaultValue =
		__unstableUnitoneSupports?.dividerType?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.dividerType;
	}, [] );
	const unstableDefaultValue =
		__unstableUnitoneSupports?.dividerType?.default;
	return unstableDefaultValue ?? defaultValue;
}

export function isDividerTypeSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.divider' ) &&
		! __unstableUnitoneSupports?.dividerType
	);
}

export function hasDividerTypeValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		defaultValue !== unitone?.dividerType &&
		undefined !== unitone?.dividerType
	);
}

export function resetDividerTypeFilter() {
	return {
		dividerType: undefined,
	};
}

export function resetDividerType( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetDividerTypeFilter() )
		),
	} );
}

export function getDividerTypeEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.dividerType?.label || __( 'Type', 'unitone' )
	);
}

export function DividerTypeEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ normalizeForSelectControl(
				unitone?.dividerType ?? defaultValue
			) }
			options={ getDividerTypeOptions( { ...props } ) }
			onChange={ ( newAttribute ) => {
				const normalizedNewValue =
					normalizeForSelectControl( newAttribute );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						dividerType: normalizedNewValue || undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withDividerTypeBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isDividerTypeSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newDividerType =
		attributes?.unitone?.dividerType ?? defaultValue ?? '';

	if ( '' === newDividerType ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-divider:${ newDividerType }`
			),
		},
	};
}
