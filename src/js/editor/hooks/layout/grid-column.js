import { hasBlockSupport } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';

export function hasGridColumnValue( props ) {
	return props.attributes?.unitone?.gridColumn !== undefined;
}

export function resetGridColumn( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.gridColumn;
	const newUnitone = { ...attributes?.unitone };

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

export function GridColumnEdit( props ) {
	const {
		label,
		help,
		attributes: { unitone },
		setAttributes,
	} = props;

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
					delete newUnitone.gridColumn;
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
