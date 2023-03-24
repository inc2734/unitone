import { hasBlockSupport } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';

export function hasMaxWidthValue( props ) {
	return props.attributes?.unitone?.maxWidth !== undefined;
}

export function resetMaxWidth( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.maxWidth;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsMaxWidthDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.maxWidth' );
}

export function MaxWidthEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<TextControl
			label={ label }
			value={ unitone?.maxWidth || '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxWidth: newValue || undefined,
				};
				if ( null == newUnitone.maxWidth ) {
					delete newUnitone.maxWidth;
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

export function saveMaxWidthProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.maxWidth' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.maxWidth ) {
		return extraProps;
	}

	// Deprecation.
	// Blocks with data-layout have no prefix in the CSS custom property.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps.style = {
			...extraProps.style,
			'--max-width': attributes?.unitone?.maxWidth,
		};
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--max-width': attributes?.unitone?.maxWidth,
	};

	return extraProps;
}

export function editMaxWidthProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.maxWidth' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveMaxWidthProp( props, settings, attributes );
	};

	return settings;
}
