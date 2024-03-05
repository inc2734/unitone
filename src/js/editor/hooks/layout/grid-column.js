import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export function hasGridColumnValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.gridColumn?.default
			? attributes?.__unstableUnitoneSupports?.gridColumn?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.gridColumn;

	return null != defaultValue
		? attributes?.unitone?.gridColumn !== defaultValue
		: attributes?.unitone?.gridColumn !== undefined;
}

export function resetGridColumn( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.gridColumn;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.gridColumn?.default
			? attributes?.__unstableUnitoneSupports?.gridColumn?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.gridColumn;

	if ( null != defaultValue ) {
		newUnitone.gridColumn = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
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
		name,
		label,
		help,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridColumn;
	}, [] );
	if ( null != __unstableUnitoneSupports?.gridColumn?.default ) {
		defaultValue = __unstableUnitoneSupports?.gridColumn?.default;
	}

	return (
		<TextControl
			label={ label }
			help={ help }
			value={ unitone?.gridColumn || '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					gridColumn: newAttribute || undefined,
				};
				if ( null == newUnitone.gridColumn ) {
					if ( null == defaultValue ) {
						delete newUnitone.gridColumn;
					} else {
						newUnitone.gridColumn = '';
					}
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
		/>
	);
}

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
		'--unitone--grid-column': attributes?.unitone?.gridColumn,
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
