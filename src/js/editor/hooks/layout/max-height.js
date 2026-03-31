import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.maxHeight;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.maxHeight;
	}, [] );

	return defaultValue;
}

export function hasMaxHeightValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.maxHeight && undefined !== unitone?.maxHeight
	);
}

export function resetMaxHeightFilter() {
	return {
		maxHeight: undefined,
	};
}

export function resetMaxHeight( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetMaxHeightFilter() )
		),
	} );
}

export function isMaxHeightSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
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
	const defaultValue = useDefaultValue( { name } );

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

export function withMaxHeightBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isMaxHeightSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newMaxHeight = attributes?.unitone?.maxHeight ?? defaultValue ?? '';

	if ( '' === newMaxHeight ) {
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
