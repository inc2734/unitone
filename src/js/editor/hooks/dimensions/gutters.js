import classnames from 'classnames/dedupe';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { BaseControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

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

export function getGuttersEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.gutters?.label ||
		__( 'Margins at both ends', 'unitone' )
	);
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
		<BaseControl id={ label } label={ label }>
			<div
				style={ {
					marginTop: '12px',
					marginBottom: '12px',
				} }
			>
				<ToggleControl
					label={ __( 'Using root padding', 'unitone' ) }
					checked={ 'root' === unitone?.gutters }
					onChange={ ( newValue ) => {
						setAttributes( {
							unitone: {
								...unitone,
								gutters: newValue ? 'root' : undefined,
							},
						} );
					} }
				/>
			</div>

			{ 'root' !== unitone?.gutters && (
				<SpacingSizeControl
					value={ unitone?.gutters }
					onChange={ ( newValue ) => {
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
							gutters: newValue || undefined,
						} );

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			) }
		</BaseControl>
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
