import clsx from 'clsx';
import deepmerge from 'deepmerge';
import fastDeepEqual from 'fast-deep-equal/es6';

import {
	InspectorControls,
	store as blockEditorStore,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	RangeControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	normalizeForRangeControl,
	useToolsPanelDropdownMenuProps,
} from '../utils';

export function isOverlaySupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.overlay' );
}

export function resetOverlayFilter() {
	return {
		overlay: undefined,
	};
}

export const resetOverlay = ( props ) => {
	const filters = [ [ isOverlaySupportDisabled, resetOverlayFilter ] ];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

export function OverlayEdit( { attributes, setAttributes, clientId } ) {
	const { unitone = {} } = attributes;

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				deepmerge.all( [
					{ ...attributes?.unitone },
					resetOverlayFilter(),
				] )
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);
	const gradients = colorGradientSettings.gradients.flatMap(
		( palette ) => palette.gradients
	);

	return (
		<ToolsPanel
			label={ __( 'Overlay', 'unitone' ) }
			resetAll={ resetAll }
			panelId={ clientId }
			dropdownMenuProps={ dropdownMenuProps }
		>
			<ColorGradientSettingsDropdown
				style={ { marginTop: 0 } }
				panelId={ clientId }
				__experimentalIsRenderedInSidebar
				settings={ [
					{
						colorValue:
							unitone?.overlay?.customColor ??
							unitone?.overlay?.color, // Actually, just customColor is OK, but color is also referenced for compatibility.
						gradientValue:
							unitone?.overlay?.customGradient ??
							unitone?.overlay?.gradient, // Actually, just customGradient is OK, but gradient is also referenced for compatibility.
						label: __( 'Overlay', 'unitone' ),
						onColorChange: ( newAttribute ) => {
							const colorObject = colors.filter(
								( c ) => newAttribute === c.color
							)?.[ 0 ];
							const newColor = colorObject?.slug;
							const newCustomColor =
								colorObject?.color || newAttribute;

							unitone.overlay ??= {};
							unitone.overlay.color = newColor;
							unitone.overlay.customColor = newCustomColor;

							setAttributes( {
								unitone: cleanEmptyObject( { ...unitone } ),
							} );
						},
						onGradientChange: ( newAttribute ) => {
							const gradientObject = gradients.filter(
								( c ) => newAttribute === c.gradient
							)?.[ 0 ];
							const newGradient = gradientObject?.slug;
							const newCustomGradient =
								gradientObject?.gradient || newAttribute;

							unitone.overlay ??= {};
							unitone.overlay.gradient = newGradient;
							unitone.overlay.customGradient = newCustomGradient;

							setAttributes( {
								unitone: cleanEmptyObject( { ...unitone } ),
							} );
						},
						enableAlpha: true,
						clearable: true,
					},
				] }
				{ ...colorGradientSettings }
			/>

			<ToolsPanelItem
				hasValue={ () => null != unitone?.overlay?.dimRatio }
				label={ __( 'Overlay opacity', 'unitone' ) }
				onDeselect={ () => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							overlay: {
								...unitone?.overlay,
								dimRatio: undefined,
							},
						} ),
					} );
				} }
				isShownByDefault
				panelId={ clientId }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Overlay opacity', 'unitone' ) }
					value={ normalizeForRangeControl(
						attributes?.unitone?.overlay?.dimRatio
					) }
					onChange={ ( newAttribute ) => {
						const normalizedNewValue =
							normalizeForRangeControl( newAttribute );

						setAttributes( {
							unitone: cleanEmptyObject( {
								...unitone,
								overlay: {
									...unitone?.overlay,
									dimRatio: normalizedNewValue,
								},
							} ),
						} );
					} }
					min={ 0 }
					max={ 100 }
					step={ 1 }
					required
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}

export function withOverlayBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	if ( isOverlaySupportDisabled( { name } ) ) {
		return settings;
	}

	const blockEditorSettings = select( blockEditorStore ).getSettings();
	const colors = ( blockEditorSettings.colors ?? [] ).flatMap(
		( palette ) => palette.colors ?? palette
	);
	const gradients = ( blockEditorSettings.gradients ?? [] ).flatMap(
		( palette ) => palette.gradients ?? palette
	);

	const customColor = attributes?.unitone?.overlay?.customColor;
	const customGradient = attributes?.unitone?.overlay?.customGradient;

	// Backward compatibility.
	const color =
		colors.filter(
			( c ) => attributes?.unitone?.overlay?.color === c.color
		)?.[ 0 ]?.slug ?? attributes?.unitone?.overlay?.color;

	const gradient =
		gradients.filter(
			( c ) => attributes?.unitone?.overlay?.gradient === c.gradient
		)?.[ 0 ]?.slug ?? attributes?.unitone?.overlay?.gradient;

	return {
		...settings,
		wrapperProps: {
			...wrapperProps,
			style: {
				...wrapperProps?.style,
				'--unitone--overlay-color': !! color
					? `var(--wp--preset--color--${ color })`
					: customColor,
				'--unitone--overlay-gradient': !! gradient
					? `var(--wp--preset--gradient--${ gradient })`
					: customGradient,
				'--unitone--overlay-opacity':
					null != attributes?.unitone?.overlay?.dimRatio
						? attributes.unitone.overlay.dimRatio * 0.01
						: undefined,
				'--unitone--overlay-radius':
					'object' === typeof attributes?.style?.border?.radius &&
					null !== attributes?.style?.border?.radius
						? Object.values(
								attributes?.style?.border?.radius
						  ).join( ' ' )
						: attributes?.style?.border?.radius,
			},
			'data-unitone-layout': clsx(
				wrapperProps?.[ 'data-unitone-layout' ],
				{
					'-overlay':
						!! color ||
						!! gradient ||
						!! customColor ||
						!! customGradient,
				}
			),
		},
	};
}

export function OverlayPanelPure( props ) {
	const { name } = props;

	if ( isOverlaySupportDisabled( { name } ) ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<OverlayEdit { ...props } />
		</InspectorControls>
	);
}

export const OverlayPanel = memo( OverlayPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
