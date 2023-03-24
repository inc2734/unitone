import classnames from 'classnames/dedupe';

import { hasBlockSupport, getBlockSupport } from '@wordpress/blocks';

import { SpacingSizeControl } from './components';

export function hasGapValue( props ) {
	return props.attributes?.unitone?.gap !== undefined;
}

export function resetGap( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.gap;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsGapDisabled( props ) {
	const { name: blockName } = props;

	if ( ! hasBlockSupport( blockName, 'unitone.gap' ) ) {
		return true;
	}

	const blockSupport = getBlockSupport( blockName, 'unitone.gap' );
	if ( true === blockSupport ) {
		return false;
	}

	const className = props.attributes?.className;
	if ( !! className ) {
		return ! className.split( ' ' ).some( ( needle ) => {
			needle = needle.replace( 'is-style-', '' );
			return blockSupport.styles?.[ needle ];
		} );
	}

	return true;
}

export function GapEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.gap }
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					gap: newValue || undefined,
				};
				if ( null == newUnitone.gap ) {
					delete newUnitone.gap;
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
