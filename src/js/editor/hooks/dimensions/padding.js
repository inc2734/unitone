/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */

import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasPaddingValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

	return defaultValue !== unitone?.padding && undefined !== unitone?.padding;
}

export function resetPaddingFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			padding: undefined,
		},
	};
}

export function resetPadding( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetPaddingFilter( { unitone } )?.unitone ),
	} );
}

export function useIsPaddingDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.padding' );
}

export function getPaddingEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Padding', 'unitone' );
	const defaultCode = <code>padding</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.padding?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.padding?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.padding?.code || defaultCode }
		</>
	);
}

export function PaddingEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.padding;
	}, [] );

	return (
		<SpacingSizeControl
			label={ label }
			value={ unitone?.padding ?? defaultValue }
			onChange={ ( newValue ) => {
				if ( null != newValue ) {
					// RangeControl returns Int, SelectControl returns String.
					// So cast Int all values.
					newValue = String( newValue );
				}

				const newUnitone = {
					...unitone,
					padding:
						newValue || ( null == defaultValue ? undefined : '' ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const unitoneLayout = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.padding' ) ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		if ( null == attributes?.unitone?.padding ) {
			return extraProps?.[ 'data-unitone-layout' ];
		}

		// Deprecation.
		if ( !! extraProps?.[ 'data-layout' ] ) {
			extraProps[ 'data-layout' ] = clsx(
				extraProps[ 'data-layout' ],
				`-padding:${ attributes.unitone?.padding }`
			);
			return extraProps?.[ 'data-unitone-layout' ];
		}

		return clsx(
			extraProps?.[ 'data-unitone-layout' ],
			`-padding:${ attributes.unitone?.padding }`
		);
	}, [
		blockType,
		extraProps?.[ 'data-unitone-layout' ],
		extraProps?.[ 'data-layout' ],
		attributes?.unitone?.padding,
	] );

	return {
		...extraProps,
		'data-unitone-layout': unitoneLayout,
	};
}

export function usePaddingBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.padding;
		},
		[ name ]
	);

	const newPaddingProp = useBlockProps( wrapperProps, name, {
		unitone: {
			padding: attributes?.unitone?.padding ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newPaddingProp,
		},
	};
}
