import { hasBlockSupport } from '@wordpress/blocks';
import { RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasHalfLeadingValue( props ) {
	return props.attributes?.unitone?.halfLeading !== undefined;
}

export function resetHalfLeading( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			halfLeading: undefined,
		} ),
	} );
}

export function useIsHalfLeadingDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'typography.lineHeight' );
}

export function HalfLeadingEdit( props ) {
	const { attributes, setAttributes } = props;

	const { unitone } = attributes;

	return (
		<RangeControl
			label={ __( 'Half leading', 'unitone' ) }
			value={ unitone?.halfLeading }
			onChange={ ( newValue ) => {
				newValue = isNaN( newValue ) ? undefined : newValue;

				const newUnitone = {
					...unitone,
					halfLeading:
						undefined === newValue
							? undefined
							: parseFloat( newValue ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
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
	if ( ! hasBlockSupport( blockType, 'typography.lineHeight' ) ) {
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
	if ( ! hasBlockSupport( settings, 'typography.lineHeight' ) ) {
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
