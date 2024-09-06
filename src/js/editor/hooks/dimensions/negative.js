import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

export function hasNegativeValue( { unitone } ) {
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

export function resetNegative( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetNegativeFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsNegativeDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.negative' );
}

export function getNegativeEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.negative?.label ||
		__( 'Using negative margin', 'unitone' )
	);
}

export function NegativeEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return !! select( blocksStore ).getBlockType( name )?.attributes
			?.unitone?.default?.negative;
	}, [] );

	return (
		<ToggleControl
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

export function saveNegativeProp( extraProps, blockType, attributes ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.negative;

	if ( ! hasBlockSupport( blockType, 'unitone.negative' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.negative ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				negative: defaultValue,
			},
		};
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = clsx(
			extraProps[ 'data-layout' ],
			'-negative'
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
		extraProps[ 'data-unitone-layout' ],
		'-negative'
	);

	return extraProps;
}

export function useNegativeBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveNegativeProp( wrapperProps, name, attributes ),
		},
	};
}
