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

export function getGridRowEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.gridRow?.label ||
		__( "A grid item's size and location within the grid row", 'unitone' )
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
			label={ label }
			help={ help }
			value={ unitone?.gridRow ?? defaultValue ?? '' }
			onChange={ onChangeGridRow }
		/>
	);
}

export function saveGridRowProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gridRow' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.gridRow ) {
			return extraProps;
		}
	}

	const defaultValue = getDefaultValue( {
		name: blockType,
		__unstableUnitoneSupports: attributes?.__unstableUnitoneSupports,
	} );

	if ( null == attributes?.unitone?.gridRow ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				gridRow: defaultValue,
			},
		};
	}

	extraProps.style = {
		...extraProps.style,
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

	return extraProps;
}

export function useGridRowBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveGridRowProp( wrapperProps, name, attributes ),
		},
	};
}
