import { hasBlockSupport } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';

// undefined ... auto
// auto ... undefined にする
// '' ... '' を保存する

export function hasGridRowValue( props ) {
	return props.attributes?.unitone?.gridRow !== undefined;
}

export function resetGridRow( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.gridRow;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
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

export function GridRowEdit( props ) {
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
			value={ unitone?.gridRow || '' }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					gridRow: newAttribute || undefined,
				};
				if ( null == newUnitone.gridRow ) {
					delete newUnitone.gridRow;
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
