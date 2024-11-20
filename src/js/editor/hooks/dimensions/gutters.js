import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { BaseControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasGuttersValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gutters;

	return defaultValue !== unitone?.gutters && undefined !== unitone?.gutters;
}

export function resetGuttersFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			gutters: undefined,
		},
	};
}

export function resetGutters( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetGuttersFilter( { unitone } )?.unitone ),
	} );
}

export function useIsGuttersDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.gutters' );
}

export function getGuttersEditLabel( {
	__unstableUnitoneSupports,
	__withCode = false,
} ) {
	const defaultLabel = __( 'Margins at both ends', 'unitone' );
	const defaultCode = <code>padding-right/left</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.gutters?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.gutters?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.gutters?.code || defaultCode }
		</>
	);
}

export function GuttersEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gutters;
	}, [] );

	return (
		<BaseControl __nextHasNoMarginBottom id={ label } label={ label }>
			<div
				style={ {
					marginTop: '12px',
					marginBottom: '12px',
				} }
			>
				<ToggleControl
					__nextHasNoMarginBottom
					label={ __( 'Using root padding', 'unitone' ) }
					checked={ 'root' === ( unitone?.gutters ?? defaultValue ) }
					onChange={ ( newValue ) => {
						setAttributes( {
							unitone: cleanEmptyObject( {
								...unitone,
								gutters: newValue ? 'root' : '0',
							} ),
						} );
					} }
				/>
			</div>

			{ 'root' !== ( unitone?.gutters ?? defaultValue ) && (
				<SpacingSizeControl
					value={ unitone?.gutters ?? defaultValue }
					onChange={ ( newValue ) => {
						if ( null != newValue ) {
							// RangeControl returns Int, SelectControl returns String.
							// So cast Int all values.
							newValue = String( newValue );
						}

						const newUnitone = {
							...unitone,
							gutters:
								newValue ||
								( null != defaultValue ? undefined : '' ),
						};

						setAttributes( {
							unitone: cleanEmptyObject( newUnitone ),
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

	if ( null == attributes?.unitone?.gutters ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = clsx(
			extraProps[ 'data-layout' ],
			`-gutters:${ attributes.unitone?.gutters }`
		);
		return extraProps;
	}

	return {
		...extraProps,
		'data-unitone-layout': clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-gutters:${ attributes.unitone?.gutters }`
		),
	};
}

export function useGuttersBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gutters;
		},
		[ name ]
	);

	const newGuttersProp = useMemo( () => {
		return saveGuttersProp( wrapperProps, name, {
			unitone: {
				gutters: attributes?.unitone?.gutters ?? defaultValue,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newGuttersProp,
		},
	};
}
