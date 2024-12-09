import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { cleanEmptyObject } from '../utils';

export function hasMinWidthValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minWidth;

	return (
		defaultValue !== unitone?.minWidth && undefined !== unitone?.minWidth
	);
}

export function resetMinWidthFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			minWidth: undefined,
		},
	};
}

export function resetMinWidth( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMinWidthFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMinWidthDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.minWidth' ) &&
		! __unstableUnitoneSupports?.minWidth
	);
}

export function getMinWidthEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Min width', 'unitone' );
	const defaultCode = <code>min-width</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.minWidth?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.minWidth?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.minWidth?.code || defaultCode }
		</>
	);
}

export function MinWidthEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.minWidth;
	}, [] );

	return (
		<TextControl
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.minWidth ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					minWidth: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

function useBlockProps( extraProps, blockType, attributes ) {
	const style = useMemo( () => {
		if ( ! hasBlockSupport( blockType, 'unitone.minWidth' ) ) {
			if ( ! attributes?.__unstableUnitoneSupports?.minWidth ) {
				return extraProps?.style;
			}
		}

		if ( null == attributes?.unitone?.minWidth ) {
			return extraProps?.style;
		}

		return {
			...extraProps?.style,
			'--unitone--min-width': attributes?.unitone?.minWidth,
		};
	}, [
		blockType,
		attributes?.__unstableUnitoneSupports?.minWidth,
		attributes?.unitone?.minWidth,
		extraProps?.style,
		extraProps?.[ 'data-layout' ],
	] );

	return {
		...extraProps,
		style,
	};
}

export function useMinWidthBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.minWidth;
		},
		[ name ]
	);

	const newMinWidthProp = useBlockProps( wrapperProps, name, {
		__unstableUnitoneSupports,
		unitone: {
			minWidth: attributes?.unitone?.minWidth ?? defaultValue,
		},
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newMinWidthProp,
		},
	};
}
