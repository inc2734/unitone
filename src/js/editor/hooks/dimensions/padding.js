/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */
import classnames from 'classnames/dedupe';

import { hasBlockSupport } from '@wordpress/blocks';

import { SpacingSizeControl } from '../components';

export function hasPaddingValue( props ) {
	return props.attributes?.unitone?.padding !== undefined;
}

export function resetPadding( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.padding;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsPaddingDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.padding' );
}

export function PaddingEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.padding }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					padding: newValue || undefined,
				};
				if ( null == newUnitone.padding ) {
					delete newUnitone.padding;
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

export function savePaddingProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.padding' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.padding ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-padding:${ attributes.unitone?.padding }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-padding:${ attributes.unitone?.padding }`
	);

	return extraProps;
}

export function editPaddingProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.padding' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return savePaddingProp( props, settings, attributes );
	};
	return settings;
}
