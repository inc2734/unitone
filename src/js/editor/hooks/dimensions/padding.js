/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */

import clsx from 'clsx';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject } from '../utils';

export function hasPaddingValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

	return defaultValue !== unitone?.padding && undefined !== unitone?.padding;
}

export function resetPaddingFilter( attributes ) {
	if ( null != attributes?.unitone?.padding ) {
		attributes.unitone.padding = undefined;
	}

	return cleanEmptyObject( attributes );
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

export function usePaddingBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.padding;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.padding' ) ) {
		return settings;
	}

	const newPadding = attributes?.unitone?.padding ?? defaultValue;

	if ( null == newPadding ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-padding:${ newPadding }`
			),
		},
	};
}
