import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	mergeObjectWithDefaultValue,
	normalizeForTextControl,
} from '../utils';

import { ResponsiveSettingsContainer, HelpContainer } from '../components';

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.gridColumn.responsive' ) ||
		__unstableUnitoneSupports?.gridColumn?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gridColumn;
	const unstableDefaultValue = __unstableUnitoneSupports?.gridColumn?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridColumn;
	}, [] );
	const unstableDefaultValue = __unstableUnitoneSupports?.gridColumn?.default;
	return unstableDefaultValue ?? defaultValue;
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
	const primitiveValue =
		typeof unitone?.gridColumn === 'string'
			? unitone?.gridColumn
			: undefined;

	const onChangeGridColumn = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridColumn: newValue || undefined,
			} ),
		} );
	};

	const onChangeGridColumnLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridColumn: {
					lg: newValue || undefined,
					md: unitone?.gridColumn?.md,
					sm: unitone?.gridColumn?.sm,
				},
			} ),
		} );
	};

	const onChangeGridColumnMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridColumn: {
					lg: unitone?.gridColumn?.lg ?? primitiveValue,
					md: newValue || undefined,
					sm: unitone?.gridColumn?.sm,
				},
			} ),
		} );
	};

	const onChangeGridColumnSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridColumn: {
					lg: unitone?.gridColumn?.lg ?? primitiveValue,
					md: unitone?.gridColumn?.md,
					sm: newValue || undefined,
				},
			} ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<HelpContainer help={ help } layout="horizontal">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForTextControl(
							unitone?.gridColumn?.lg ??
								primitiveValue ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridColumnLg(
								normalizeForTextControl( newValue )
							)
						}
					/>
				</HelpContainer>
			) }
			tabletControls={ () => (
				<HelpContainer help={ help } layout="horizontal">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForTextControl(
							unitone?.gridColumn?.md ??
								unitone?.gridColumn?.lg ??
								primitiveValue ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridColumnMd(
								normalizeForTextControl( newValue )
							)
						}
					/>
				</HelpContainer>
			) }
			mobileControls={ () => (
				<HelpContainer help={ help } layout="horizontal">
					<TextControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForTextControl(
							unitone?.gridColumn?.sm ??
								unitone?.gridColumn?.md ??
								unitone?.gridColumn?.lg ??
								primitiveValue ??
								defaultValue?.sm ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridColumnSm(
								normalizeForTextControl( newValue )
							)
						}
					/>
				</HelpContainer>
			) }
		/>
	) : (
		<HelpContainer help={ help } layout="horizontal">
			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ normalizeForTextControl(
					unitone?.gridColumn ?? defaultValue
				) }
				onChange={ ( newValue ) =>
					onChangeGridColumn( normalizeForTextControl( newValue ) )
				}
			/>
		</HelpContainer>
	);
}

export function withGridColumnBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isGridColumnSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newGridColumn = mergeObjectWithDefaultValue(
		attributes?.unitone?.gridColumn,
		defaultValue
	);

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
