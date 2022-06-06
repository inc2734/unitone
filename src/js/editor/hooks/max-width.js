import { hasBlockSupport } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function useIsMaxWidthDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.maxWidth' );
}

export function MaxWidthEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<TextControl
			label={ __( 'Max width', 'unitone' ) }
			value={ unitone?.maxWidth }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxWidth: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
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

	extraProps.style = {
		...extraProps.style,
		'--max-width': attributes?.unitone?.maxWidth,
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
