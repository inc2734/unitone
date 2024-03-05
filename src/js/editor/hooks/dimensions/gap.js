import classnames from 'classnames/dedupe';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';

export function hasGapValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	return null != defaultValue
		? attributes?.unitone?.gap !== defaultValue
		: attributes?.unitone?.gap !== undefined;
}

export function resetGap( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.gap;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	if ( null != defaultValue ) {
		newUnitone.gap = defaultValue;
	}

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

export function getGapEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return __unstableUnitoneSupports?.gap?.label || __( 'Gap', 'unitone' );
}

export function GapEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

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
					if ( null == defaultValue ) {
						delete newUnitone.gap;
					} else {
						newUnitone.gap = '';
					}
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
