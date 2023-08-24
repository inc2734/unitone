import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

export function hasGridRowValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.gridRow?.default
			? attributes?.__unstableUnitoneSupports?.gridRow?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.gridRow;

	return null != defaultValue
		? attributes?.unitone?.gridRow !== defaultValue
		: attributes?.unitone?.gridRow !== undefined;
}

export function resetGridRow( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.gridRow;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.gridRow?.default
			? attributes?.__unstableUnitoneSupports?.gridRow?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.gridRow;

	if ( null != defaultValue ) {
		newUnitone.gridRow = defaultValue;
	}

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
		name,
		label,
		help,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gridRow;
	}, [] );
	if ( null != __unstableUnitoneSupports?.gridRow?.default ) {
		defaultValue = __unstableUnitoneSupports?.gridRow?.default;
	}

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
					if ( null == defaultValue ) {
						delete newUnitone.gridRow;
					} else {
						newUnitone.gridRow = '';
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
