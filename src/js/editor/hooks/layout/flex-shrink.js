import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';

export function hasFlexShrinkValue( props ) {
	return props.attributes?.unitone?.flexShrink !== undefined;
}

export function resetFlexShrink( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.flexShrink;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsFlexShrinkDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.flexShrink' ) &&
		! __unstableUnitoneSupports?.flexShrink
	);
}

export function FlexShrinkEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<RangeControl
			label={ label }
			value={
				null != unitone?.flexShrink
					? parseInt( unitone?.flexShrink )
					: ''
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
					flexShrink: newValue || undefined,
				};
				if ( null == newUnitone.flexShrink ) {
					delete newUnitone.flexShrink;
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

export function saveFlexShrinkProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.flexShrink' ) &&
		! attributes?.__unstableUnitoneSupports?.flexShrink
	) {
		delete attributes?.unitone?.flexShrink;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.flexShrink ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--flex-shrink': attributes?.unitone?.flexShrink,
	};

	return extraProps;
}

export function editFlexShrinkProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveFlexShrinkProp( props, settings, attributes );
	};

	return settings;
}
