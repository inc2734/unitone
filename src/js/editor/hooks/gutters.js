import classnames from 'classnames/dedupe';

import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from './components';
import { cleanEmptyObject } from './utils';

export function hasGuttersValue( props ) {
	return props.attributes?.unitone?.gutters !== undefined;
}

export function resetGutters( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			gutters: undefined,
		} ),
	} );
}

export function useIsGuttersDisabled( { name: blockName } = {} ) {
	return ! getBlockSupport( blockName, 'unitone.gutters' );
}

export function GuttersEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SpacingSizeControl
			label={
				<>
					{ __( 'Gutters', 'unitone' ) } :
					<code>padding-right/left</code>
				</>
			}
			value={ unitone?.gutters }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}
				const newUnitone = {
					...unitone,
					gutters: newValue,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function saveGuttersProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gutters' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gutters ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-gutters:${ attributes.unitone?.gutters }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-gutters:${ attributes.unitone?.gutters }`
	);

	return extraProps;
}

export function editGuttersProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.gutters' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGuttersProp( props, settings, attributes );
	};

	return settings;
}
