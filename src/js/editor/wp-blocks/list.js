import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/list' !== name && 'core/list-item' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		const markerColor = !! attributes?.unitone?.markerColor
			? `var(--wp--preset--color--${ attributes?.unitone?.markerColor })`
			: attributes?.unitone?.markerCustomColor;

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				style: {
					...wrapperProps?.style,
					'--unitone--marker-color': markerColor,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/list/useBlockProps',
	useBlockProps
);

const ListInspectorControls = ( { attributes, setAttributes, clientId } ) => {
	const { unitone = {} } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Marker', 'unitone' ),
							colorValue: unitone?.markerCustomColor,
							onColorChange: ( newSetting ) => {
								const colorObject = colors.filter(
									( c ) => newSetting === c.color
								)?.[ 0 ];
								const newColor = colorObject?.slug;
								const newCustomColor =
									colorObject?.color || newSetting;

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
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											markerColor: undefined,
											markerCustomColor: undefined,
										} )
									),
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
			</InspectorControls>
		</>
	);
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if (
			! props.isSelected ||
			( 'core/list' !== props.name && 'core/list-item' !== props.name )
		) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />

				<ListInspectorControls { ...props } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/list/with-inspector-controls',
	withInspectorControls,
	9
);
