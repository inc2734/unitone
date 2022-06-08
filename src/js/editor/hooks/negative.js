import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function hasNegativeValue( props ) {
	return props.attributes?.unitone?.negative !== undefined;
}

export function resetNegative( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			negative: undefined,
		} ),
	} );
}

export function useIsNegativeDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.negative' );
}

export function NegativeEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<ToggleControl
			label={ __( 'Using negative margin', 'unitone' ) }
			checked={ !! unitone?.negative }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					negative: !! newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveNegativeProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.negative' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.negative ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			'-negative'
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		'-negative'
	);

	return extraProps;
}

export function editNegativeProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.negative' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveNegativeProp( props, settings, attributes );
	};

	return settings;
}
