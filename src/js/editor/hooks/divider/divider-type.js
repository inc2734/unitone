import clsx from 'clsx';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
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

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.dividerType' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.dividerType ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-divider:${ attributes.unitone?.dividerType }`
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.dividerType,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useDividerTypeBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.dividerType;
		},
		[ name ]
	);

	const newDividerTypeProp = useBlockProps( wrapperProps, name, {
		unitone: {
			dividerType: attributes?.unitone?.dividerType ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newDividerTypeProp,
		},
	};
}
