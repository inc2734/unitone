import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	isObject,
	mergeObjectWithDefaultValue,
} from '../utils';

import { GapControl, isDefaultSpacingSizeValue } from '../components';

function isPresetSpacingValue( value ) {
	return 'string' === typeof value && value.startsWith( 'var:preset|' );
}

function getPresetCssVar( value ) {
	if ( ! isPresetSpacingValue( value ) ) {
		return value;
	}

	const [ , type, slug ] = value.split( '|' );

	return `var(--wp--preset--${ type }--${ slug })`;
}

function isCustomSpacingSizeValue( value ) {
	return (
		null != value &&
		'' !== value &&
		! isObject( value ) &&
		! isDefaultSpacingSizeValue( value )
	);
}

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.gap;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	return defaultValue;
}

export function hasGapValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

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
	const defaultCode = <code className="unitone-label-code">gap</code>;

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
	const defaultValue = useDefaultValue( { name } );

	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;
	const isVertical = getBlockSupport( name, 'unitone.gap.vertical' ) || false;

	const compactedValue = compacting( unitone?.gap, defaultValue );
	const compactedDefaultValue = compacting( defaultValue );
	const expandedDefaultValue = expand( compactedDefaultValue );
	const displayedGap = mergeObjectWithDefaultValue(
		expand( unitone?.gap ),
		expandedDefaultValue
	);
	const isMixed =
		isObject( compactedValue ) || isObject( compactedDefaultValue );

	const onChangeGap = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gap: newValue || undefined,
			} ),
		} );
	};

	const onChangeGapSide = ( side, newValue ) => {
		const newGap = expand( unitone?.gap );

		newGap[ side ] = newValue || expandedDefaultValue?.[ side ];

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
			rowValue={ displayedGap?.row }
			onChangeRow={ ( newValue ) => onChangeGapSide( 'row', newValue ) }
			columnValue={ displayedGap?.column }
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

	const defaultValue = getDefaultValue( { name } );
	const newGap = compacting(
		mergeObjectWithDefaultValue(
			expand( attributes.unitone?.gap ),
			expand( defaultValue )
		)
	);

	if ( null == newGap ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				...( isCustomSpacingSizeValue( newGap )
					? { '--unitone--gap': getPresetCssVar( newGap ) }
					: {} ),
				...( isCustomSpacingSizeValue( newGap?.column )
					? {
							'--unitone--column-gap': getPresetCssVar(
								newGap.column
							),
					  }
					: {} ),
				...( isCustomSpacingSizeValue( newGap?.row )
					? { '--unitone--row-gap': getPresetCssVar( newGap.row ) }
					: {} ),
			},
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-gap:${ newGap }` ]:
						null != newGap &&
						! isObject( newGap ) &&
						! isCustomSpacingSizeValue( newGap ),
					[ `-column-gap:${ newGap?.column }` ]:
						null != newGap?.column &&
						! isCustomSpacingSizeValue( newGap.column ),
					[ `-row-gap:${ newGap?.row }` ]:
						null != newGap?.row &&
						! isCustomSpacingSizeValue( newGap.row ),
				}
			),
		},
	};
}
