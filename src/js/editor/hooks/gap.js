import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from './components';
import { cleanEmptyObject } from './utils';

export function hasGapValue( props ) {
	return props.attributes?.unitone?.gap !== undefined;
}

export function resetGap( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			gap: undefined,
		} ),
	} );
}

export function useIsGapDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.gap' );
}

export function GapEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SpacingSizeControl
			label={
				<>
					{ __( 'Gap', 'unitone' ) } : <code>gap</code>
				</>
			}
			value={ unitone?.gap }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}
				const newUnitone = {
					...unitone,
					gap: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveGapProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gap' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gap ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-gap:${ attributes.unitone?.gap }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-gap:${ attributes.unitone?.gap }`
	);

	return extraProps;
}

export function editGapProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.gap' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGapProp( props, settings, attributes );
	};
	return settings;
}
