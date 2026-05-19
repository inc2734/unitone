import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, normalizeForToggleControl } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.negative;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.negative;
	}, [] );

	return defaultValue;
}

export function hasNegativeValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.negative && undefined !== unitone?.negative
	);
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
	const defaultValue = useDefaultValue( { name } );

	return (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ normalizeForToggleControl(
				!! ( unitone?.negative ?? defaultValue )
			) }
			onChange={ ( newValue ) => {
				const normalizedNewValue =
					normalizeForToggleControl( newValue );

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						negative: normalizedNewValue || undefined,
					} ),
				} );
			} }
		/>
	);
}

export function withNegativeBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isNegativeSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newNegative = attributes?.unitone?.negative ?? defaultValue;

	if ( true !== newNegative ) {
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
