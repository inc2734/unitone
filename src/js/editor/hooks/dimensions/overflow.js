import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
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

export function hasOverflowValue( { name, attributes: { unitone } } ) {
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

export function resetOverflow( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetOverflowFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsOverflowDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.overflow' );
}

export function getOverflowEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Overflow', 'unitone' );
	const defaultCode = <code>overflow</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.overflow?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.overflow?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.overflow?.code || defaultCode }
		</>
	);
}

export function OverflowEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.overflow;
	}, [] );

	return (
		<SelectControl
			__nextHasNoMarginBottom
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

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.overflow' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.overflow ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-overflow:${ attributes.unitone?.overflow }`
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		attributes?.unitone?.overflow,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useOverflowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.overflow;
		},
		[ name ]
	);

	const newOverflowProp = useBlockProps( wrapperProps, name, {
		unitone: {
			overflow: attributes?.unitone?.overflow ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newOverflowProp,
		},
	};
}
