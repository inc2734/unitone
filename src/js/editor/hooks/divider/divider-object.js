import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { __experimentalBorderControl as BorderControl } from '@wordpress/components';
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

export function hasDividerValue( { name, unitone } ) {
	const blockType = wp.data.select( blocksStore ).getBlockType( name );
	const defaultDivider = blockType?.attributes?.unitone?.default?.divider;
	const defaultDividerColor =
		blockType?.attributes?.unitone?.default?.dividerColor;

	return (
		( JSON.stringify( defaultDivider ) !==
			JSON.stringify( unitone?.divider ) &&
			undefined !== unitone?.divider ) ||
		( defaultDividerColor !== unitone?.dividerColor &&
			undefined !== unitone?.dividerColor )
	);
}

export function resetDividerFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			divider: undefined,
			dividerColor: undefined,
		},
	};
}

export function resetDivider( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetDividerFilter( { unitone } )?.unitone ),
	} );
}

export function useIsDividerDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.divider' );
}

export function getDividerEditLabel( { __unstableUnitoneSupports } ) {
	return (
		__unstableUnitoneSupports?.divider?.label || __( 'Divider', 'unitone' )
	);
}

export function DividerEdit( { name, label, unitone, setAttributes } ) {
	const { defaultDivider, defaultDividerColor } = useSelect(
		( select ) => {
			const blockType = select( blocksStore ).getBlockType( name );
			return {
				defaultDivider:
					blockType?.attributes?.unitone?.default?.divider,
				defaultDividerColor:
					blockType?.attributes?.unitone?.default?.dividerColor,
			};
		},
		[ name ]
	);

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
	return (
		<BorderControl
			label={ label }
			value={ hydratedDivider }
			withSlider={ true }
			onChange={ onChangeDivider }
			colors={ colors }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
}

function saveDividerProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.divider' ) ) {
		return extraProps;
	}

	if (
		null == attributes?.unitone?.divider &&
		null == attributes?.unitone?.dividerColor
	) {
		return extraProps;
	}

	let presetColor;
	if ( !! attributes?.unitone?.dividerColor ) {
		presetColor = `var(--wp--preset--color--${ attributes?.unitone?.dividerColor.replace(
			'/',
			'-'
		) })`;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--divider-color':
			attributes?.unitone?.divider?.color || presetColor,
		'--unitone--divider-style': attributes?.unitone?.divider?.style,
		'--unitone--divider-width': attributes?.unitone?.divider?.width,
	};

	return extraProps;
}

export function useDividerBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const { defaultDivider, defaultDividerColor } = useSelect(
		( select ) => {
			const blockTypeAttributes =
				select( blocksStore ).getBlockType( name )?.attributes;
			return {
				defaultDivider: blockTypeAttributes?.unitone?.default?.divider,
				defaultDividerColor:
					blockTypeAttributes?.unitone?.default?.dividerColor,
			};
		},
		[ name ]
	);

	const newDividerProp = useMemo( () => {
		return saveDividerProp( wrapperProps, name, {
			unitone: {
				divider: {
					...( attributes?.unitone?.divider ?? defaultDivider ),
				},
				dividerColor:
					attributes?.unitone?.dividerColor ?? defaultDividerColor,
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newDividerProp,
		},
	};
}
