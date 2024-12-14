import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasMinHeightValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minHeight;

	return (
		defaultValue !== unitone?.minHeight && undefined !== unitone?.minHeight
	);
}

export function resetMinHeightFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			minHeight: undefined,
		},
	};
}

export function resetMinHeight( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMinHeightFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMinHeightDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.minHeight' ) &&
		! __unstableUnitoneSupports?.minHeight
	);
}

export function getMinHeightEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Min height', 'unitone' );
	const defaultCode = <code>min-height</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.minHeight?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.minHeight?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.minHeight?.code || defaultCode }
		</>
	);
}

export function MinHeightEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.minHeight;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.minHeight ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					minHeight: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function useMinHeightBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.minHeight;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.minHeight' ) ) {
		if ( ! __unstableUnitoneSupports?.minHeight ) {
			return settings;
		}
	}

	const newMinHeight = attributes?.unitone?.minHeight ?? defaultValue;

	if ( null == newMinHeight ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--min-height': newMinHeight,
			},
		},
	};
}
