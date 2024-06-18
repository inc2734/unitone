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

function getDefaultValue( props ) {
	const { name, attributes } = props;

	return null != attributes?.__unstableUnitoneSupports?.gridRow?.default
		? attributes?.__unstableUnitoneSupports?.gridRow?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gridRow;
}

function getIsResponsive( props ) {
	const { name, attributes } = props;
	const { __unstableUnitoneSupports } = attributes;

	return (
		getBlockSupport( name, 'unitone.gridRow.responsive' ) ||
		__unstableUnitoneSupports?.gridRow?.responsive ||
		false
	);
}

function useDefaultValue( props ) {
	const { name, attributes } = props;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridRow;
	}, [] );

	return null != __unstableUnitoneSupports?.gridRow?.default
		? __unstableUnitoneSupports?.gridRow?.default
		: defaultValue;
}

export function hasGridRowValue( props ) {
	const { attributes } = props;

	const defaultValue = getDefaultValue( props );

	return null != defaultValue
		? JSON.stringify( attributes?.unitone?.gridRow ) !==
				JSON.stringify( defaultValue )
		: attributes?.unitone?.gridRow !== undefined;
}

export function resetGridRow( props ) {
	const { attributes, setAttributes } = props;

	delete attributes?.unitone?.gridRow;

	const newUnitone = cleanEmptyObject( {
		...attributes?.unitone,
		gridRow: getDefaultValue( props ) || undefined,
	} );

	setAttributes( {
		unitone: newUnitone,
	} );
}

export function useIsGridRowDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.gridRow' ) &&
		! __unstableUnitoneSupports?.gridRow
	);
}

export function getGridRowEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.gridRow?.label ||
		__( "A grid item's size and location within the grid row", 'unitone' )
	);
}

export function GridRowEdit( props ) {
	const {
		label,
		help,
		attributes: { unitone },
		setAttributes,
	} = props;

	const isResponsive = getIsResponsive( props );
	const defaultValue = useDefaultValue( props );
	const fallbackValue =
		typeof unitone?.gridRow === 'string' ? unitone?.gridRow : undefined;

	const onChangeGridRow = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridRow: newValue,
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridRowLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridRow: {
				lg: newValue,
				md: unitone?.gridRow?.md || undefined,
				sm: unitone?.gridRow?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridRowMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridRow: {
				lg: unitone?.gridRow?.lg || fallbackValue || undefined,
				md: newValue,
				sm: unitone?.gridRow?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridRowSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridRow: {
				lg: unitone?.gridRow?.lg || fallbackValue || undefined,
				md: unitone?.gridRow?.md || undefined,
				sm: newValue,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<TextControl
					hideLabelFromVision
					help={ help }
					value={ unitone?.gridRow?.lg || fallbackValue || '' }
					onChange={ onChangeGridRowLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridRow?.md ||
						unitone?.gridRow?.lg ||
						fallbackValue ||
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
						unitone?.gridRow?.sm ||
						unitone?.gridRow?.md ||
						unitone?.gridRow?.lg ||
						fallbackValue ||
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
			value={ unitone?.gridRow || '' }
			onChange={ onChangeGridRow }
		/>
	);
}

export function saveGridRowProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.gridRow' ) &&
		! attributes?.__unstableUnitoneSupports?.gridRow
	) {
		delete attributes?.unitone?.gridRow;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gridRow ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--grid-row': attributes?.unitone?.gridRow,
	};

	return extraProps;
}

export function editGridRowProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGridRowProp( props, settings, attributes );
	};

	return settings;
}
