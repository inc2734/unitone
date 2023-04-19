import { hasBlockSupport } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';

export function hasMaxHeightValue( props ) {
	return props.attributes?.unitone?.maxHeight !== undefined;
}

export function resetMaxHeight( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.maxHeight;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMaxHeightDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.maxHeight' ) &&
		! __unstableUnitoneSupports?.maxHeight
	);
}

export function MaxHeightEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<TextControl
			label={ label }
			value={ unitone?.maxHeight || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxHeight: newValue || undefined,
				};
				if ( null == newUnitone.maxHeight ) {
					delete newUnitone.maxHeight;
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

export function saveMaxHeightProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.maxHeight' ) &&
		! attributes?.__unstableUnitoneSupports?.maxHeight
	) {
		delete attributes?.unitone?.maxHeight;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.maxHeight ) {
		return extraProps;
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--max-height': attributes?.unitone?.maxHeight,
		};
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--max-height': attributes?.unitone?.maxHeight,
	};

	return extraProps;
}

export function editMaxHeightProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMaxHeightProp( props, settings, attributes );
	};

	return settings;
}
