import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { __experimentalBorderControl as BorderControl } from '@wordpress/components';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

// @todo For WordPress 6.0
import useMultipleOriginColorsAndGradientsFallback from './use-common-single-multiple-selects';

// @todo For WordPress 6.0
if ( undefined === useMultipleOriginColorsAndGradients ) {
	useMultipleOriginColorsAndGradients =
		useMultipleOriginColorsAndGradientsFallback;
}

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

export function hasDividerValue( props ) {
	return (
		props.attributes?.unitone?.divider !== undefined ||
		props.attributes?.unitone?.dividerColor !== undefined
	);
}

export function resetDivider( { attributes = {}, setAttributes } ) {
	const { unitone } = attributes;

	setAttributes( {
		unitone: cleanEmptyObject( {
			...unitone,
			divider: undefined,
			dividerColor: undefined,
		} ),
	} );
}

export const resetDividerFilter = ( newAttributes ) => ( {
	...newAttributes,
	unitone: cleanEmptyObject( {
		...newAttributes?.unitone,
		dividerColor: undefined,
		divider: undefined,
	} ),
} );

export function useIsDividerDisabled( { name: blockName } = {} ) {
	return ! getBlockSupport( blockName, 'unitone.divider' );
}

export function DividerEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

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

	const hydratedDivider = getDivider( unitone, colors );

	return (
		<BorderControl
			label={ __( 'Border', 'unitone' ) }
			value={ hydratedDivider }
			withSlider={ true }
			onChange={ onChangeDivider }
			colors={ colors }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
}

export function saveDividerProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.divider' ) ) {
		return extraProps;
	}

	if (
		undefined === attributes?.unitone?.divider &&
		undefined === attributes?.unitone?.dividerColor
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

export function editDividerProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.divider' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveDividerProp( props, settings, attributes );
	};

	return settings;
}
