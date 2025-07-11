import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasMinWidthValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.minWidth;

	return (
		defaultValue !== unitone?.minWidth && undefined !== unitone?.minWidth
	);
}

export function resetMinWidthFilter() {
	return {
		minWidth: undefined,
	};
}

export function resetMinWidth( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetMinWidthFilter() )
		),
	} );
}

export function isMinWidthSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
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
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={ label }
			help={ __(
				"If the specified width exceeds the parent's width, it will be internally adjusted to ensure it does not exceed the parent's width.",
				'unitone'
			) }
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

export function withMinWidthBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.minWidth' ) ) {
		if ( ! __unstableUnitoneSupports?.minWidth ) {
			return settings;
		}
	}

	const newMinWidth = attributes?.unitone?.minWidth;

	if ( null == newMinWidth ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--min-width': newMinWidth,
			},
		},
	};
}
