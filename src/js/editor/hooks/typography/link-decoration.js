import clsx from 'clsx';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { reset, formatStrikethrough, formatUnderline } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const LINK_DECORATIONS = [
	{
		label: __( 'None' ),
		value: 'none',
		icon: reset,
	},
	{
		label: __( 'Underline' ),
		value: 'underline',
		icon: formatUnderline,
	},
	{
		label: __( 'Strikethrough' ),
		value: 'line-through',
		icon: formatStrikethrough,
	},
];

const LinkDecorationControl = ( { label, value, onChange, className } ) => {
	return (
		<ToggleGroupControl
			isDeselectable
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ label }
			className={ clsx(
				'block-editor-text-decoration-control',
				className
			) }
			value={ value }
			onChange={ ( newValue ) => {
				onChange( newValue === value ? undefined : newValue );
			} }
		>
			{ LINK_DECORATIONS.map( ( option ) => {
				return (
					<ToggleGroupControlOptionIcon
						key={ option.value }
						value={ option.value }
						icon={ option.icon }
						label={ option.label }
					/>
				);
			} ) }
		</ToggleGroupControl>
	);
};

export function hasLinkDecorationValue( { attributes: { unitone } } ) {
	return unitone?.linkDecoration !== undefined;
}

export function resetLinkDecorationFilter() {
	return {
		linkDecoration: undefined,
	};
}

export function resetLinkDecoration( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetLinkDecorationFilter() )
		),
	} );
}

export function isLinkDecorationSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.linkDecoration' );
}

export function getLinkDecorationEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Link decoration', 'unitone' );
	const defaultCode = <code>align-items</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.linkDecoration?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.linkDecoration?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.linkDecoration?.code || defaultCode }
		</>
	);
}

export function LinkDecorationEdit( { label, attributes, setAttributes } ) {
	return (
		<LinkDecorationControl
			label={ label }
			value={ attributes?.unitone?.linkDecoration }
			onChange={ ( newValue ) => {
				const newUnitone = {
					...attributes?.unitone,
					linkDecoration: newValue || undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function withLinkDecorationBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.linkDecoration' ) ) {
		return settings;
	}

	const newLinkDecoration = attributes?.unitone?.linkDecoration;

	if ( null == newLinkDecoration ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				`-link-decoration:${ newLinkDecoration }`
			),
		},
	};
}
