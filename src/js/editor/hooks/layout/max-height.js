import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasMaxHeightValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.maxHeight;

	return (
		defaultValue !== unitone?.maxHeight && undefined !== unitone?.maxHeight
	);
}

function resetMaxHeightFilter( attributes ) {
	if ( null != attributes?.unitone?.maxHeight ) {
		attributes.unitone.maxHeight = undefined;
	}

	return attributes;
}

export function resetMaxHeight( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetMaxHeightFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsMaxHeightDisabled( { name, __unstableUnitoneSupports } ) {
	return (
		! hasBlockSupport( name, 'unitone.maxHeight' ) &&
		! __unstableUnitoneSupports?.maxHeight
	);
}

export function getMaxHeightEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Max height', 'unitone' );
	const defaultCode = <code>max-height</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.maxHeight?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.maxHeight?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.maxHeight?.code || defaultCode }
		</>
	);
}

export function MaxHeightEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxHeight;
	}, [] );

	return (
		<TextControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			value={ unitone?.maxHeight ?? defaultValue ?? '' }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...unitone,
					maxHeight: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function useMaxHeightBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.maxHeight;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.maxHeight' ) ) {
		if ( ! __unstableUnitoneSupports?.maxHeight ) {
			return settings;
		}
	}

	const newMaxHeight = attributes?.unitone?.maxHeight ?? defaultValue;

	if ( null == newMaxHeight ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--max-height': newMaxHeight,
			},
		},
	};
}
