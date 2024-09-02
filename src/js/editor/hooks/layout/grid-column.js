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

	return null != attributes?.__unstableUnitoneSupports?.gridColumn?.default
		? attributes?.__unstableUnitoneSupports?.gridColumn?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gridColumn;
}

function getIsResponsive( props ) {
	const { name, attributes } = props;
	const { __unstableUnitoneSupports } = attributes;

	return (
		getBlockSupport( name, 'unitone.gridColumn.responsive' ) ||
		__unstableUnitoneSupports?.gridColumn?.responsive ||
		false
	);
}

function useDefaultValue( props ) {
	const { name, attributes } = props;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridColumn;
	}, [] );

	return null != __unstableUnitoneSupports?.gridColumn?.default
		? __unstableUnitoneSupports?.gridColumn?.default
		: defaultValue;
}

export function hasGridColumnValue( props ) {
	const { attributes } = props;

	const defaultValue = getDefaultValue( props );

	return null != defaultValue
		? JSON.stringify( attributes?.unitone?.gridColumn ) !==
				JSON.stringify( defaultValue )
		: attributes?.unitone?.gridColumn !== undefined;
}

export function resetGridColumn( props ) {
	const { attributes, setAttributes } = props;

	delete attributes?.unitone?.gridColumn;

	const newUnitone = cleanEmptyObject( {
		...attributes?.unitone,
		gridColumn: getDefaultValue( props ) || undefined,
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

export function GridColumnEdit( props ) {
	const {
		label,
		help,
		attributes: { unitone },
		setAttributes,
	} = props;

	const isResponsive = getIsResponsive( props );
	const defaultValue = useDefaultValue( props );
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

export function saveGridColumnProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gridColumn' ) ) {
		const { __unstableUnitoneSupports } = attributes;

		if ( ! __unstableUnitoneSupports?.gridColumn ) {
			delete attributes?.unitone?.gridColumn;

			if ( ! Object.keys( attributes?.unitone ?? {} ).length ) {
				delete attributes?.unitone;
			}

			return extraProps;
		}
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

export function useGridColumnBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveGridColumnProp( wrapperProps, name, attributes ),
		},
	};
}
