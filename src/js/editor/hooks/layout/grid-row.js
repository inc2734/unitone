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
		getBlockSupport( name, 'unitone.gridRow.responsive' ) ||
		__unstableUnitoneSupports?.gridRow?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gridRow;
	const unstableDefaultValue = __unstableUnitoneSupports?.gridRow?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridRow;
	}, [] );
	const unstableDefaultValue = __unstableUnitoneSupports?.gridRow?.default;
	return unstableDefaultValue ?? defaultValue;
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
	const primitiveValue =
		typeof unitone?.gridRow === 'string' ? unitone?.gridRow : undefined;

	const onChangeGridRow = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridRow: newValue || undefined,
			} ),
		} );
	};

	const onChangeGridRowLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridRow: {
					lg: newValue || undefined,
					md: unitone?.gridRow?.md,
					sm: unitone?.gridRow?.sm,
				},
			} ),
		} );
	};

	const onChangeGridRowMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridRow: {
					lg: unitone?.gridRow?.lg ?? primitiveValue,
					md: newValue || undefined,
					sm: unitone?.gridRow?.sm,
				},
			} ),
		} );
	};

	const onChangeGridRowSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gridRow: {
					lg: unitone?.gridRow?.lg ?? primitiveValue,
					md: unitone?.gridRow?.md,
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
							unitone?.gridRow?.lg ??
								primitiveValue ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridRowLg(
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
							unitone?.gridRow?.md ??
								unitone?.gridRow?.lg ??
								primitiveValue ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridRowMd(
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
							unitone?.gridRow?.sm ??
								unitone?.gridRow?.md ??
								unitone?.gridRow?.lg ??
								primitiveValue ??
								defaultValue?.sm ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						onChange={ ( newValue ) =>
							onChangeGridRowSm(
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
					unitone?.gridRow ?? defaultValue
				) }
				onChange={ ( newValue ) =>
					onChangeGridRow( normalizeForTextControl( newValue ) )
				}
			/>
		</HelpContainer>
	);
}

export function withGridRowBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isGridRowSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newGridRow = mergeObjectWithDefaultValue(
		attributes?.unitone?.gridRow,
		defaultValue
	);

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
