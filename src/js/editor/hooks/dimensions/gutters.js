import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import { SpacingSizeControl } from '../components';

export function hasGuttersValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gutters;

	return null != defaultValue
		? attributes?.unitone?.gutters !== defaultValue
		: attributes?.unitone?.gutters !== undefined;
}

export function resetGutters( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.gutters;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gutters;

	if ( null != defaultValue ) {
		newUnitone.gutters = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsGuttersDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.gutters' );
}

export function GuttersEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gutters;
	}, [] );

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.gutters }
			allowRoot
			onChange={ ( newValue ) => {
				if ( 'undefined' !== typeof newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					gutters: newValue || undefined,
				};
				if ( null == newUnitone.gutters ) {
					if ( null == defaultValue ) {
						delete newUnitone.gutters;
					} else {
						newUnitone.gutters = '';
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
