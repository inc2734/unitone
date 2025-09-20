import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { BorderControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

const getColorByProperty = ( colors, property, value ) => {
	let matchedColor;

	colors.some( ( origin ) =>
		origin.colors.some( ( color ) => {
			if ( color[ property ] === value ) {
				matchedColor = color;
				return true;
			}

			return false;
		} )
	);

	return matchedColor;
};

const getMultiOriginColor = ( { colors, namedColor, customColor } ) => {
	// Search each origin (default, theme, or user) for matching color by name.
	if ( namedColor ) {
		const colorObject = getColorByProperty( colors, 'slug', namedColor );
		if ( colorObject ) {
			return colorObject;
		}
	}

	// Skip if no custom color or matching named color.
	if ( ! customColor ) {
		return { color: undefined };
	}

	// Attempt to find color via custom color value or build new object.
	const colorObject = getColorByProperty( colors, 'color', customColor );
	return colorObject ? colorObject : { color: customColor };
};

const getDivider = (
	attributes = { dividerColor: undefined, divider: undefined },
	colors
) => {
	const { dividerColor, divider } = attributes;

	// If we have a named color for a flat border. Fetch that color object and
	// apply that color's value to the color property within the style object.
	if ( dividerColor ) {
		const { color } = getMultiOriginColor( {
			colors,
			namedColor: dividerColor,
		} );

		return color ? { ...divider, color } : divider;
	}

	// Individual side border color slugs are stored within the border style
	// object. If we don't have a border styles object we have nothing further
	// to hydrate.
	if ( ! divider ) {
		return divider;
	}

	return divider;
};

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const blockType = wp.data.select( blocksStore ).getBlockType( name );

	return {
		divider:
			null != __unstableUnitoneSupports?.divider?.default
				? __unstableUnitoneSupports?.divider?.default
				: blockType?.attributes?.unitone?.default?.divider,
		dividerColor:
			null != __unstableUnitoneSupports?.dividerColor?.default
				? __unstableUnitoneSupports?.dividerColor?.default
				: blockType?.attributes?.unitone?.default?.dividerColor,
	};
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const blockType = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name );
	} );

	return {
		divider:
			null != __unstableUnitoneSupports?.divider?.default
				? __unstableUnitoneSupports?.divider?.default
				: blockType?.attributes?.unitone?.default?.divider,
		dividerColor:
			null != __unstableUnitoneSupports?.dividerColor?.default
				? __unstableUnitoneSupports?.dividerColor?.default
				: blockType?.attributes?.unitone?.default?.dividerColor,
	};
}

export function hasDividerValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const defaultDivider = defaultValue?.divider;
	const defaultDividerColor = defaultValue?.dividerColor;

	return (
		( JSON.stringify( defaultDivider ) !==
			JSON.stringify( unitone?.divider ) &&
			undefined !== unitone?.divider ) ||
		( defaultDividerColor !== unitone?.dividerColor &&
			undefined !== unitone?.dividerColor )
	);
}

export function resetDividerFilter() {
	return {
		divider: undefined,
		dividerColor: undefined,
	};
}

export function resetDivider( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetDividerFilter() )
		),
	} );
}

export function isDividerSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.divider' ) &&
		! __unstableUnitoneSupports?.divider
	);
}

export function getDividerEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.divider?.label || __( 'Divider', 'unitone' )
	);
}

export function DividerEdit( {
	name,
	label,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const defaultDivider = defaultValue?.divider;
	const defaultDividerColor = defaultValue?.dividerColor;

	const { colors } = useMultipleOriginColorsAndGradients();

	// @see https://github.com/WordPress/gutenberg/blob/trunk/packages/block-editor/src/hooks/border.js
	const onChangeDivider = ( newBorder ) => {
		// Filter out named colors and apply them to appropriate block
		// attributes so that CSS classes can be used to apply those colors.
		// e.g. has-primary-border-top-color.

		const newBorderStyles = { ...newBorder };
		let newBorderColor;

		if ( newBorder?.color ) {
			// We have a flat border configuration. Apply named color slug to
			// `borderColor` attribute and clear color style property if found.
			const customColor = newBorder?.color;
			const colorObject = getMultiOriginColor( {
				colors,
				customColor,
			} );

			if ( colorObject.slug ) {
				newBorderColor = colorObject.slug;
				newBorderStyles.color = undefined;
			}
		}

		// Ensure previous border radius styles are maintained and clean
		// overall result for empty objects or properties.
		const newStyle = cleanEmptyObject( {
			...newBorderStyles,
		} );

		setAttributes( {
			unitone: {
				...unitone,
				divider: newStyle,
				dividerColor: newBorderColor,
			},
		} );
	};

	const newDivider = unitone?.divider ?? defaultDivider;
	const newDividerColor = unitone?.dividerColor ?? defaultDividerColor;
	const hydratedDivider = getDivider(
		{
			...unitone,
			divider: newDivider,
			dividerColor: newDivider?.color ?? newDividerColor,
		},
		colors
	);

	// Memoize popoverProps to avoid returning a new object every time.
	const popoverProps = useMemo(
		() => ( {
			placement: 'left-start',
			offset: 40,
		} ),
		[]
	);

	return (
		<BorderControl
			__next40pxDefaultSize
			label={ label }
			value={ hydratedDivider }
			withSlider={ true }
			onChange={ onChangeDivider }
			colors={ colors }
			width={ 116 }
			__experimentalIsRenderedInSidebar={ true }
			__unstablePopoverProps={ popoverProps }
		/>
	);
}

export function withDividerBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if ( ! hasBlockSupport( name, 'unitone.divider' ) ) {
		if ( ! __unstableUnitoneSupports?.divider ) {
			return settings;
		}
	}

	const newDivider = {
		divider: {
			...attributes?.unitone?.divider,
		},
		dividerColor: attributes?.unitone?.dividerColor,
	};

	if ( null == newDivider?.divider && null == newDivider?.dividerColor ) {
		return settings;
	}

	let presetColor;
	if ( !! newDivider?.dividerColor ) {
		presetColor = `var(--wp--preset--color--${ newDivider?.dividerColor.replace(
			'/',
			'-'
		) })`;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--divider-color':
					newDivider?.divider?.color || presetColor,
				'--unitone--divider-style': newDivider?.divider?.style,
				'--unitone--divider-width': newDivider?.divider?.width,
			},
		},
	};
}
