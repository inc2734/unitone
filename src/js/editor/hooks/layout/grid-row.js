import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { cleanEmptyObject } from '../utils';

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.gridRow.responsive' ) ||
		__unstableUnitoneSupports?.gridRow?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.gridRow?.default
		? __unstableUnitoneSupports?.gridRow?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gridRow;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridRow;
	}, [] );

	return null != __unstableUnitoneSupports?.gridRow?.default
		? __unstableUnitoneSupports?.gridRow?.default
		: defaultValue;
}

export function hasGridRowValue( {
	name,
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !== JSON.stringify( unitone?.gridRow ) &&
		undefined !== unitone?.gridRow
	);
}

export function resetGridRowFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			gridRow: undefined,
		},
	};
}

export function resetGridRow( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetGridRowFilter( { unitone } )?.unitone ),
	} );
}

export function useIsGridRowDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.gridRow' ) &&
		! __unstableUnitoneSupports?.gridRow
	);
}

export function getGridRowEditLabel( {
	__unstableUnitoneSupports,
	__withCode = false,
} ) {
	const defaultLabel = __(
		"A grid item's size and location within the grid row",
		'unitone'
	);
	const defaultCode = <code>grid-row</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.gridRow?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.gridRow?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.gridRow?.code || defaultCode }
		</>
	);
}

export function GridRowEdit( {
	label,
	name,
	help,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const fallbackValue =
		typeof unitone?.gridRow === 'string' ? unitone?.gridRow : undefined;

	const onChangeGridRow = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridRow: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridRowLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridRow: {
				lg: newValue || undefined,
				md: unitone?.gridRow?.md || undefined,
				sm: unitone?.gridRow?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridRowMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridRow: {
				lg: unitone?.gridRow?.lg || fallbackValue || undefined,
				md: newValue || undefined,
				sm: unitone?.gridRow?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridRowSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridRow: {
				lg: unitone?.gridRow?.lg || fallbackValue || undefined,
				md: unitone?.gridRow?.md || undefined,
				sm: newValue || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<TextControl
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						( unitone?.gridRow?.lg || fallbackValue ) ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridRowLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						( unitone?.gridRow?.md ||
							unitone?.gridRow?.lg ||
							fallbackValue ) ??
						( defaultValue?.md || defaultValue?.lg ) ??
						''
					}
					onChange={ onChangeGridRowMd }
				/>
			) }
			mobileControls={ () => (
				<TextControl
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						( unitone?.gridRow?.sm ||
							unitone?.gridRow?.md ||
							unitone?.gridRow?.lg ||
							fallbackValue ) ??
						( defaultValue?.sm ||
							defaultValue?.md ||
							defaultValue?.lg ) ??
						''
					}
					onChange={ onChangeGridRowSm }
				/>
			) }
		/>
	) : (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			value={ unitone?.gridRow ?? defaultValue ?? '' }
			onChange={ onChangeGridRow }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const style = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.gridRow' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.gridRow ) {
				return extraProps?.style;
			}
		}

		if ( null == attributes?.unitone?.gridRow ) {
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--grid-row':
				typeof attributes.unitone?.gridRow === 'string'
					? attributes.unitone?.gridRow || undefined
					: attributes?.unitone?.gridRow?.lg || undefined,
			'--unitone--md-grid-row':
				null != attributes?.unitone?.gridRow?.md
					? attributes?.unitone?.gridRow?.md
					: undefined,
			'--unitone--sm-grid-row':
				null != attributes.unitone?.gridRow?.sm
					? attributes?.unitone?.gridRow?.sm
					: undefined,
		};
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.gridRow,
		extraProps?.style,
		attributes?.unitone?.gridRow,
	] );

	return {
		...extraProps,
		style,
	};
}

export function useGridRowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	const newGridRowProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			gridRow: attributes?.unitone?.gridRow ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newGridRowProp,
		},
	};
}
