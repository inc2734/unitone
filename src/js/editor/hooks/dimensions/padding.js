/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */
import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasPaddingValue( { name, attributes } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

	return null != defaultValue
		? attributes?.unitone?.padding !== defaultValue
		: attributes?.unitone?.padding !== undefined;
}

export function resetPadding( { name, attributes, setAttributes } ) {
	delete attributes?.unitone?.padding;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

	if ( null != defaultValue ) {
		newUnitone.padding = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsPaddingDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.padding' );
}

export function getPaddingEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.padding?.label || __( 'Padding', 'unitone' )
	);
}

function PaddingEditPure( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.padding;
	}, [] );

	const onChange = useCallback(
		( newValue ) => {
			if ( null == newValue ) {
				newValue = defaultValue;
			}

			if ( null != newValue ) {
				// RangeControl returns Int, SelectControl returns String.
				// So cast Int all values.
				newValue = String( newValue );
			}

			const newUnitone = cleanEmptyObject( {
				...unitone,
				padding: newValue || undefined,
			} );

			setAttributes( {
				unitone: newUnitone,
			} );
		},
		[ defaultValue ]
	);

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.padding }
			onChange={ onChange }
		/>
	);
}

export const PaddingEdit = memo( PaddingEditPure );

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
