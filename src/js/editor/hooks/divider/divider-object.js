import { __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { __experimentalBorderControl as BorderControl } from '@wordpress/components';
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

export function hasDividerValue( props ) {
	const { name, attributes } = props;

	const dividerDefaultValue = wp.data
		.select( blocksStore )
		.getBlockType( name )?.attributes?.unitone?.default?.divider;

	const dividerColorDefaultValue = wp.data
		.select( blocksStore )
		.getBlockType( name )?.attributes?.unitone?.default?.dividerColor;

	if ( null != dividerDefaultValue ) {
		return attributes?.unitone?.divider !== dividerDefaultValue;
	}

	if ( null != dividerColorDefaultValue ) {
		return attributes?.unitone?.dividerColor !== dividerColorDefaultValue;
	}

	return (
		props.attributes?.unitone?.divider !== undefined ||
		props.attributes?.unitone?.dividerColor !== undefined
	);
}

export function resetDivider( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.divider;
	delete attributes?.unitone?.dividerColor;
	const newUnitone = { ...attributes?.unitone };

	const dividerDefaultValue = wp.data
		.select( blocksStore )
		.getBlockType( name )?.attributes?.unitone?.default?.divider;

	const dividerColorDefaultValue = wp.data
		.select( blocksStore )
		.getBlockType( name )?.attributes?.unitone?.default?.dividerColor;

	if ( null != dividerDefaultValue ) {
		newUnitone.divider = dividerDefaultValue;
	}

	if ( null != dividerColorDefaultValue ) {
		newUnitone.dividerColor = dividerColorDefaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsDividerDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.divider' );
}

export function getDividerEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.divider?.label || __( 'Divider', 'unitone' )
	);
}

export function DividerEdit( props ) {
	const {
		label,
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

export function useDividerBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveDividerProp( wrapperProps, name, attributes ),
		},
	};
}
