import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { BaseControl, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasGuttersValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gutters;

	return defaultValue !== unitone?.gutters && undefined !== unitone?.gutters;
}

export function resetGuttersFilter() {
	return {
		gutters: undefined,
	};
}

export function resetGutters( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetGuttersFilter() )
		),
	} );
}

export function useIsGuttersDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.gutters' );
}

export function getGuttersEditLabel( {
	attributes: { __unstableUnitoneSupports },
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

export function GuttersEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
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

export function useGuttersBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gutters;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.gutters' ) ) {
		return settings;
	}

	const newGutters = attributes?.unitone?.gutters ?? defaultValue;

	if ( null == newGutters ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-gutters:${ newGutters }`
			),
		},
	};
}
