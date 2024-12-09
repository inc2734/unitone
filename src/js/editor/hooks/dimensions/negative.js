import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

export function hasNegativeValue( { attributes: { unitone } } ) {
	return !! unitone?.negative;
}

export function resetNegativeFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			negative: undefined,
		},
	};
}

export function resetNegative( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetNegativeFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsNegativeDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.negative' );
}

export function getNegativeEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.negative?.label ||
		__( 'Using negative margin', 'unitone' )
	);
}

export function NegativeEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return !! select( blocksStore ).getBlockType( name )?.attributes
			?.unitone?.default?.negative;
	}, [] );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ !! ( unitone?.negative ?? defaultValue ) }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					negative: newValue || undefined,
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
		if ( ! hasBlockSupport( blockType, 'unitone.negative' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.negative ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		// Deprecation.
		if ( !! extraProps?.[ 'data-layout' ] ) {
			extraProps[ 'data-layout' ] = clsx(
				extraProps[ 'data-layout' ],
				'-negative'
			);
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx( extraProps?.[ 'data-unitone-layout' ], '-negative' );
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		extraProps?.[ 'data-layout' ],
		attributes?.unitone?.negative,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function useNegativeBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.negative;
		},
		[ name ]
	);

	const newNegativeProp = useBlockProps( wrapperProps, name, {
		unitone: {
			negative: attributes?.unitone?.negative ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newNegativeProp,
		},
	};
}
