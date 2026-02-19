import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { GapControl } from '../components';
import { cleanEmptyObject, isObject } from '../utils';

export function hasGapValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	return defaultValue !== unitone?.gap && undefined !== unitone?.gap;
}

export function resetGapFilter() {
	return {
		gap: undefined,
	};
}

export function resetGap( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetGapFilter() )
		),
	} );
}

export function isGapSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.gap' );
}

export function getGapEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Gap', 'unitone' );
	const defaultCode = <code>gap</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.gap?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.gap?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.gap?.code || defaultCode }
		</>
	);
}

function compacting( attribute, defaultValue = undefined ) {
	if ( 0 === attribute ) {
		return 0;
	}

	if ( null == attribute ) {
		return undefined;
	}

	const values = Object.values( attribute );
	const allEqual =
		2 === values.length && values.every( ( v ) => v === values[ 0 ] );

	const compactedAttribute = allEqual ? values[ 0 ] : attribute;

	if ( isObject( compactedAttribute ) && null != defaultValue ) {
		if ( compactedAttribute?.column === defaultValue?.column ) {
			compactedAttribute.column = undefined;
		}

		if ( compactedAttribute?.row === defaultValue?.row ) {
			compactedAttribute.row = undefined;
		}
	}

	if (
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( defaultValue ) ||
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( compacting( defaultValue ) )
	) {
		return undefined;
	}

	return compactedAttribute;
}

function expand( attribute ) {
	return isObject( attribute )
		? {
				column: attribute?.column,
				row: attribute?.row,
		  }
		: {
				column: attribute,
				row: attribute,
		  };
}

export function GapEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;
	const isVertical = getBlockSupport( name, 'unitone.gap.vertical' ) || false;

	const compactedValue = compacting( unitone?.gap, defaultValue );
	const compactedDefaultValue = compacting( defaultValue );
	const isMixed =
		isObject( compactedValue ) || isObject( compactedDefaultValue );

	const onChangeGap = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const newUnitone = {
			...unitone,
			gap: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGapSide = ( side, newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactedDefault = compacting( defaultValue );
		const expandedDefault = expand( compactedDefault );
		const newGap = expand( unitone?.gap );

		newGap[ side ] = newValue || expandedDefault?.[ side ];

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gap: compacting( newGap, defaultValue ),
			} ),
		} );
	};

	return (
		<GapControl
			label={ label }
			splitOnAxis={ splitOnAxis }
			isVertical={ isVertical }
			isMixed={ isMixed }
			value={ compactedValue ?? defaultValue }
			onChange={ onChangeGap }
			rowValue={
				unitone?.gap?.row ??
				unitone?.gap ??
				defaultValue?.row ??
				defaultValue
			}
			onChangeRow={ ( newValue ) => onChangeGapSide( 'row', newValue ) }
			columnValue={
				unitone?.gap?.column ??
				unitone?.gap ??
				defaultValue?.column ??
				defaultValue
			}
			onChangeColumn={ ( newValue ) =>
				onChangeGapSide( 'column', newValue )
			}
		/>
	);
}

export function withGapBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isGapSupportDisabled( { name } ) ) {
		return settings;
	}

	const newGap = compacting( attributes.unitone?.gap );

	if ( null == newGap ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-gap:${ newGap }` ]:
						null != newGap && ! isObject( newGap ),
					[ `-column-gap:${ newGap?.column }` ]:
						null != newGap?.column,
					[ `-row-gap:${ newGap?.row }` ]: null != newGap?.row,
				}
			),
		},
	};
}
