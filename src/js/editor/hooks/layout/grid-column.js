import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
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
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.gridColumn ) &&
		undefined !== unitone?.gridColumn
	);
}

export function resetGridColumnFilter() {
	return {
		gridColumn: undefined,
	};
}

export function resetGridColumn( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetGridColumnFilter() )
		),
	} );
}

export function isGridColumnSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.gridColumn' ) &&
		! __unstableUnitoneSupports?.gridColumn
	);
}

export function getGridColumnEditLabel( {
	attributes: { __unstableUnitoneSupports },
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
	attributes: { unitone, __unstableUnitoneSupports },
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
				md: unitone?.gridColumn?.md,
				sm: unitone?.gridColumn?.sm,
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
				lg: unitone?.gridColumn?.lg ?? fallbackValue,
				md: newValue || undefined,
				sm: unitone?.gridColumn?.sm,
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
				lg: unitone?.gridColumn?.lg ?? fallbackValue,
				md: unitone?.gridColumn?.md,
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
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridColumn?.lg ??
						fallbackValue ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridColumnLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridColumn?.md ??
						unitone?.gridColumn?.lg ??
						fallbackValue ??
						defaultValue?.md ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridColumnMd }
				/>
			) }
			mobileControls={ () => (
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridColumn?.sm ??
						unitone?.gridColumn?.md ??
						unitone?.gridColumn?.lg ??
						fallbackValue ??
						defaultValue?.sm ??
						defaultValue?.md ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridColumnSm }
				/>
			) }
		/>
	) : (
		<TextControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			value={ unitone?.gridColumn ?? defaultValue ?? '' }
			onChange={ onChangeGridColumn }
		/>
	);
}

export function withGridColumnBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.gridColumn' ) ) {
		if ( ! __unstableUnitoneSupports?.gridColumn ) {
			return settings;
		}
	}

	const newGridColumn = attributes?.unitone?.gridColumn;

	if ( null == newGridColumn ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--grid-column':
					typeof newGridColumn === 'string'
						? newGridColumn
						: newGridColumn?.lg,
				'--unitone--md-grid-column': newGridColumn?.md,
				'--unitone--sm-grid-column': newGridColumn?.sm,
			},
		},
	};
}
