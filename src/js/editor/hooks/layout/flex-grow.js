import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';

export function hasFlexGrowValue( props ) {
	return props.attributes?.unitone?.flexGrow !== undefined;
}

export function resetFlexGrow( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.flexGrow;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFlexGrowDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.flexGrow' ) &&
		! __unstableUnitoneSupports?.flexGrow
	);
}

export function FlexGrowEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<RangeControl
			label={ label }
			value={
				null != unitone?.flexGrow ? parseInt( unitone?.flexGrow ) : ''
			}
			allowReset={ true }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					flexGrow: newValue || undefined,
				};
				if ( null == newUnitone.flexGrow ) {
					delete newUnitone.flexGrow;
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
			min={ 0 }
			max={ 10 }
			step={ 1 }
		/>
	);
}

export function saveFlexGrowProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.flexGrow' ) &&
		! attributes?.__unstableUnitoneSupports?.flexGrow
	) {
		delete attributes?.unitone?.flexGrow;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.flexGrow ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-grow': attributes?.unitone?.flexGrow,
	};

	return extraProps;
}

export function editFlexGrowProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFlexGrowProp( props, settings, attributes );
	};

	return settings;
}
