import clsx from 'clsx';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const getDividerTypeOptions = ( { name } ) => {
	const options = getBlockSupport( name, 'unitone.dividerType' );

	const list = [
		{
			label: '',
			value: '',
		},
		{
			label: __( 'Stripe', 'unitone' ),
			value: 'stripe',
		},
		{
			label: __( 'Divide', 'unitone' ),
			value: 'divide',
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
		return options.includes( value.value ) || '' === value.value;
	} );
};

export function useIsDividerTypeDisabled( { name } ) {
	return (
		! hasBlockSupport( name, 'unitone.divider' ) &&
		! getBlockSupport( name, 'unitone.dividerType' )
	);
}

export function hasDividerTypeValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.dividerType;

	return (
		defaultValue !== unitone?.dividerType &&
		undefined !== unitone?.dividerType
	);
}

export function resetDividerTypeFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			dividerType: undefined,
		},
	};
}

export function resetDividerType( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetDividerTypeFilter( { unitone } )?.unitone
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

export function DividerTypeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.dividerType;
	}, [] );

	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.dividerType ?? defaultValue ?? '' }
			options={ getDividerTypeOptions( { name } ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					dividerType: newAttribute || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function useDividerTypeBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.dividerType;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.dividerType' ) ) {
		return settings;
	}

	const newDividerType = attributes?.unitone?.dividerType ?? defaultValue;

	if ( null == newDividerType ) {
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
