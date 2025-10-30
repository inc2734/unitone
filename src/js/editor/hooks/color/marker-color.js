import {
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function isMarkerColorSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.color.marker' );
}

export function resetMarkerColorFilter() {
	return {
		markerColor: undefined,
		markerCustomColor: undefined,
	};
}

export function MarkerColorEdit( props ) {
	const { attributes, setAttributes, clientId } = props;
	const { unitone = {} } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	const colors =
		colorGradientSettings?.colors?.flatMap(
			( palette ) => palette.colors
		) ?? [];

	return (
		<ColorGradientSettingsDropdown
			__experimentalIsRenderedInSidebar
			settings={ [
				{
					label: __( 'Marker', 'unitone' ),
					colorValue: unitone?.markerCustomColor,
					onColorChange: ( newSetting ) => {
						const colorObject = colors.filter(
							( colorItem ) => newSetting === colorItem.color
						)?.[ 0 ];
						const newColor = colorObject?.slug;
						const newCustomColor = colorObject?.color || newSetting;

						setAttributes( {
							unitone: cleanEmptyObject( {
								...unitone,
								markerColor: newColor,
								markerCustomColor: newCustomColor,
							} ),
						} );
					},
					resetAllFilter: () => {
						setAttributes( {
							unitone: cleanEmptyObject( {
								...unitone,
								...resetMarkerColorFilter(),
							} ),
						} );
					},
					clearable: true,
				},
			] }
			{ ...colorGradientSettings }
			gradients={ [] }
			disableCustomGradients
			panelId={ clientId }
		/>
	);
}

export function withMarkerColorBlockProps( settings ) {
	const { name, attributes, wrapperProps } = settings;
	const { unitone = {} } = attributes;

	if ( isMarkerColorSupportDisabled( { name } ) ) {
		return settings;
	}

	const markerColor = !! unitone?.markerColor
		? `var(--wp--preset--color--${ unitone?.markerColor })`
		: unitone?.markerCustomColor;

	if ( ! markerColor ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...wrapperProps,
			style: {
				...wrapperProps?.style,
				'--unitone--marker-color': markerColor,
			},
		},
	};
}
