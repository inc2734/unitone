import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasNegativeValue( { attributes: { unitone } } ) {
	return !! unitone?.negative;
}

export function resetNegativeFilter() {
	return {
		negative: undefined,
	};
}

export function resetNegative( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetNegativeFilter() )
		),
	} );
}

export function isNegativeSupportDisabled( { name } ) {
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

export function withNegativeBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.negative' ) ) {
		return settings;
	}

	const newNegative = attributes?.unitone?.negative;

	if ( null == newNegative ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				'-negative'
			),
		},
	};
}
