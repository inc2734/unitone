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
		getBlockSupport( name, 'unitone.gridColumn.responsive' ) ||
		__unstableUnitoneSupports?.gridColumn?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.gridColumn?.default
		? __unstableUnitoneSupports?.gridColumn?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gridColumn;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridColumn;
	}, [] );

	return null != __unstableUnitoneSupports?.gridColumn?.default
		? __unstableUnitoneSupports?.gridColumn?.default
		: defaultValue;
}

export function hasGridColumnValue( {
	name,
	unitone,
	__unstableUnitoneSupports,
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.gridColumn ) &&
		undefined !== unitone?.gridColumn
	);
}

export function resetGridColumnFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			gridColumn: undefined,
		},
	};
}

export function resetGridColumn( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetGridColumnFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsGridColumnDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.gridColumn' ) &&
		! __unstableUnitoneSupports?.gridColumn
	);
}

export function getGridColumnEditLabel( {
	__unstableUnitoneSupports,
	__withCode = false,
} ) {
	const defaultLabel = __(
		"A grid item's size and location within a grid column",
		'unitone'
	);
	const defaultCode = <code>grid-column</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.gridColumn?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.gridColumn?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.gridColumn?.code || defaultCode }
		</>
	);
}

export function GridColumnEdit( {
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
		typeof unitone?.gridColumn === 'string'
			? unitone?.gridColumn
			: undefined;

	const onChangeGridColumn = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridColumn: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridColumnLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridColumn: {
				lg: newValue || undefined,
				md: unitone?.gridColumn?.md || undefined,
				sm: unitone?.gridColumn?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridColumnMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridColumn: {
				lg: unitone?.gridColumn?.lg || fallbackValue || undefined,
				md: newValue || undefined,
				sm: unitone?.gridColumn?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGridColumnSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			gridColumn: {
				lg: unitone?.gridColumn?.lg || fallbackValue || undefined,
				md: unitone?.gridColumn?.md || undefined,
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
						( unitone?.gridColumn?.lg || fallbackValue ) ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridColumnLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						( unitone?.gridColumn?.md ||
							unitone?.gridColumn?.lg ||
							fallbackValue ) ??
						( defaultValue?.md || defaultValue?.lg ) ??
						''
					}
					onChange={ onChangeGridColumnMd }
				/>
			) }
			mobileControls={ () => (
				<TextControl
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						( unitone?.gridColumn?.sm ||
							unitone?.gridColumn?.md ||
							unitone?.gridColumn?.lg ||
							fallbackValue ) ??
						( defaultValue?.sm ||
							defaultValue?.md ||
							defaultValue?.lg ) ??
						''
					}
					onChange={ onChangeGridColumnSm }
				/>
			) }
		/>
	) : (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			value={ unitone?.gridColumn ?? defaultValue ?? '' }
			onChange={ onChangeGridColumn }
		/>
	);
}

export function saveGridColumnProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gridColumn' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.gridColumn ) {
			return extraProps;
		}
	}

	if ( null == attributes?.unitone?.gridColumn ) {
		return extraProps;
	}

	return {
		...extraProps,
		style: {
			...extraProps?.style,
			'--unitone--grid-column':
				typeof attributes.unitone?.gridColumn === 'string'
					? attributes.unitone?.gridColumn || undefined
					: attributes?.unitone?.gridColumn?.lg || undefined,
			'--unitone--md-grid-column':
				null != attributes?.unitone?.gridColumn?.md
					? attributes?.unitone?.gridColumn?.md
					: undefined,
			'--unitone--sm-grid-column':
				null != attributes.unitone?.gridColumn?.sm
					? attributes?.unitone?.gridColumn?.sm
					: undefined,
		},
	};
}

export function useGridColumnBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( {
		name,
		__unstableUnitoneSupports,
	} );

	const newGridColumnProp = useMemo( () => {
		return saveGridColumnProp( wrapperProps, name, {
			__unstableUnitoneSupports,
			unitone: {
				gridColumn: attributes?.unitone?.gridColumn ?? defaultValue,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newGridColumnProp,
		},
	};
}
