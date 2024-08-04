import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { cleanEmptyObject } from '../utils';

function getDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gridColumn;

	return null != __unstableUnitoneSupports?.gridColumn?.default
		? __unstableUnitoneSupports?.gridColumn?.default
		: defaultValue;
}

function getIsResponsive( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		getBlockSupport( name, 'unitone.gridColumn.responsive' ) ||
		__unstableUnitoneSupports?.gridColumn?.responsive ||
		false
	);
}

function useDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridColumn;
	}, [] );

	return null != __unstableUnitoneSupports?.gridColumn?.default
		? __unstableUnitoneSupports?.gridColumn?.default
		: defaultValue;
}

export function hasGridColumnValue( { name, attributes } ) {
	const defaultValue = getDefaultValue( { name, attributes } );

	return null != defaultValue
		? JSON.stringify( attributes?.unitone?.gridColumn ) !==
				JSON.stringify( defaultValue )
		: attributes?.unitone?.gridColumn !== undefined;
}

export function resetGridColumn( { name, attributes, setAttributes } ) {
	delete attributes?.unitone?.gridColumn;

	const newUnitone = cleanEmptyObject( {
		...attributes?.unitone,
		gridColumn: getDefaultValue( { name, attributes } ) || undefined,
	} );

	setAttributes( {
		unitone: newUnitone,
	} );
}

export function useIsGridColumnDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.gridColumn' ) &&
		! __unstableUnitoneSupports?.gridColumn
	);
}

export function getGridColumnEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.gridColumn?.label ||
		__( "A grid item's size and location within a grid column", 'unitone' )
	);
}

function GridColumnEditPure( {
	name,
	label,
	help,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );
	const defaultValue = useDefaultValue( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );
	const fallbackValue =
		typeof unitone?.gridColumn === 'string'
			? unitone?.gridColumn
			: undefined;

	const onChangeGridColumn = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridColumn: newValue,
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridColumnLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridColumn: {
				lg: newValue,
				md: unitone?.gridColumn?.md || undefined,
				sm: unitone?.gridColumn?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridColumnMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridColumn: {
				lg: unitone?.gridColumn?.lg || fallbackValue || undefined,
				md: newValue,
				sm: unitone?.gridColumn?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeGridColumnSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			gridColumn: {
				lg: unitone?.gridColumn?.lg || fallbackValue || undefined,
				md: unitone?.gridColumn?.md || undefined,
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
					value={ unitone?.gridColumn?.lg || fallbackValue || '' }
					onChange={ onChangeGridColumnLg }
				/>
			) }
			tabletControls={ () => (
				<TextControl
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridColumn?.md ||
						unitone?.gridColumn?.lg ||
						fallbackValue ||
						''
					}
					onChange={ onChangeGridColumnMd }
				/>
			) }
			mobileControls={ () => (
				<TextControl
					hideLabelFromVision
					help={ help }
					value={
						unitone?.gridColumn?.sm ||
						unitone?.gridColumn?.md ||
						unitone?.gridColumn?.lg ||
						fallbackValue ||
						''
					}
					onChange={ onChangeGridColumnSm }
				/>
			) }
		/>
	) : (
		<TextControl
			label={ label }
			help={ help }
			value={ unitone?.gridColumn || '' }
			onChange={ onChangeGridColumn }
		/>
	);
}

export const GridColumnEdit = memo( GridColumnEditPure );

export function saveGridColumnProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.gridColumn' ) &&
		! attributes?.__unstableUnitoneSupports?.gridColumn
	) {
		delete attributes?.unitone?.gridColumn;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gridColumn ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
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
	};

	return extraProps;
}

export function editGridColumnProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGridColumnProp( props, settings, attributes );
	};

	return settings;
}
