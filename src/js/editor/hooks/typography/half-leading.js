import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';

export function hasHalfLeadingValue( props ) {
	return props.attributes?.unitone?.halfLeading !== undefined;
}

export function resetHalfLeading( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.halfLeading;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsHalfLeadingDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.halfLeading' );
}

export function HalfLeadingEdit( props ) {
	const { label, attributes, setAttributes } = props;

	const { unitone } = attributes;

	return (
		<RangeControl
			label={ label }
			value={ unitone?.halfLeading }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					halfLeading: ! isNaN( newValue )
						? parseFloat( newValue )
						: undefined,
				};
				if ( null == newUnitone.halfLeading ) {
					delete newUnitone.halfLeading;
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
			allowReset={ true }
			min={ 0 }
			max={ 1 }
			step={ 0.1 }
		/>
	);
}

export function saveHalfLeadingProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.halfLeading' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.halfLeading ) {
		return extraProps;
	}

	return {
		...extraProps,
		style: {
			...extraProps.style,
			'--unitone--half-leading': attributes?.unitone?.halfLeading,
		},
	};
}

export function editHalfLeadingProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.halfLeading' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveHalfLeadingProp( props, settings, attributes );
	};

	return settings;
}
