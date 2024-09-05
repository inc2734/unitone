import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const overflowOptions = [
	{ label: '', value: '' },
	{
		label: 'visible',
		value: 'visible',
	},
	{
		label: 'hidden',
		value: 'hidden',
	},
	{
		label: 'scroll',
		value: 'scroll',
	},
	{
		label: 'auto',
		value: 'auto',
	},
	{
		label: 'clip',
		value: 'clip',
	},
];

export function hasOverflowValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.overflow;

	return (
		defaultValue !== unitone?.overflow && undefined !== unitone?.overflow
	);
}

export function resetOverflowFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			overflow: undefined,
		},
	};
}

export function resetOverflow( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetOverflowFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsOverflowDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.overflow' );
}

export function getOverflowEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.overflow?.label ||
		__( 'Overflow', 'unitone' )
	);
}

export function OverflowEdit( { label, name, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.overflow;
	}, [] );

	return (
		<SelectControl
			label={ label }
			options={ overflowOptions }
			value={ unitone?.overflow ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					overflow: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveOverflowProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.overflow;

	if ( ! hasBlockSupport( blockType, 'unitone.overflow' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.parallax ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				overflow: defaultValue,
			},
		};
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-overflow:${ attributes.unitone?.overflow }`
	);

	return extraProps;
}

export function useOverflowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveOverflowProp( wrapperProps, name, attributes ),
		},
	};
}
