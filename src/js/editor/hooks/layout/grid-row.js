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
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !== JSON.stringify( unitone?.gridRow ) &&
		undefined !== unitone?.gridRow
	);
}

export function resetGridRowFilter() {
	return {
		gridRow: undefined,
	};
}

export function resetGridRow( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetGridRowFilter() )
		),
	} );
}

export function isGridRowSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.gridRow' ) &&
		! __unstableUnitoneSupports?.gridRow
	);
}

export function getGridRowEditLabel( {
	attributes: { __unstableUnitoneSupports },
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
	attributes: { unitone, __unstableUnitoneSupports },
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
				md: unitone?.gridRow?.md,
				sm: unitone?.gridRow?.sm,
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
				lg: unitone?.gridRow?.lg ?? fallbackValue,
				md: newValue || undefined,
				sm: unitone?.gridRow?.sm,
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
				lg: unitone?.gridRow?.lg ?? fallbackValue,
				md: unitone?.gridRow?.md,
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
						unitone?.gridRow?.lg ??
						fallbackValue ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridRowLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridRow?.md ??
						unitone?.gridRow?.lg ??
						fallbackValue ??
						defaultValue?.md ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridRowMd }
				/>
			) }
			mobileControls={ () => (
				<TextControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridRow?.sm ??
						unitone?.gridRow?.md ??
						unitone?.gridRow?.lg ??
						fallbackValue ??
						defaultValue?.sm ??
						defaultValue?.md ??
						defaultValue?.lg ??
						''
					}
					onChange={ onChangeGridRowSm }
				/>
			) }
		/>
	) : (
		<TextControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={ help }
			value={ unitone?.gridRow ?? defaultValue ?? '' }
			onChange={ onChangeGridRow }
		/>
	);
}

export function withGridRowBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.gridRow' ) ) {
		if ( ! __unstableUnitoneSupports?.gridRow ) {
			return settings;
		}
	}

	const newGridRow = attributes?.unitone?.gridRow;

	if ( null == newGridRow ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--grid-row':
					typeof newGridRow === 'string'
						? newGridRow
						: newGridRow?.lg,
				'--unitone--md-grid-row': newGridRow?.md,
				'--unitone--sm-grid-row': newGridRow?.sm,
			},
		},
	};
}
