import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	RangeControl,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../hooks/utils';

const saveProp = ( extraProps, blockType, attributes ) => {
	if ( 'core/image' !== blockType ) {
		return extraProps;
	}

	if ( ! hasBlockSupport( blockType, 'unitone.overlay' ) ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
		extraProps[ 'data-unitone-layout' ],
		{
			'-overlay':
				!! attributes?.unitone?.overlay?.color ||
				!! attributes?.unitone?.overlay?.gradient,
		}
	);

	extraProps.style = {
		...extraProps.style,
		'--unitone--overlay-color': attributes?.unitone?.overlay?.color,
		'--unitone--overlay-gradient': attributes?.unitone?.overlay?.gradient,
		'--unitone--overlay-opacity':
			null != attributes?.unitone?.overlay?.dimRatio
				? attributes.unitone.overlay.dimRatio * 0.01
				: undefined,
		'--unitone--overlay-radius': attributes?.style?.border?.radius,
	};

	return extraProps;
};

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		props = {
			...props,
			wrapperProps: {
				...props.wrapperProps,
				...saveProp( wrapperProps, name, attributes ),
			},
		};

		return <BlockListBlock { ...props } />;
	};
} );

addFilter(
	'editor.BlockListBlock',
	'unitone/image/useBlockProps',
	useBlockProps
);

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const colorGradientSettings = useMultipleOriginColorsAndGradients();

		if ( ! props.isSelected || 'core/image' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls group="color">
					<ColorGradientSettingsDropdown
						panelId={ clientId }
						__experimentalIsRenderedInSidebar
						settings={ [
							{
								colorValue: unitone?.overlay?.color,
								gradientValue: unitone?.overlay?.gradient,
								label: __( 'Overlay', 'unitone' ),
								onColorChange: ( newAttribute ) => {
									unitone.overlay ??= {};
									unitone.overlay.color = newAttribute;

									setAttributes( {
										unitone: cleanEmptyObject( unitone ),
									} );
								},
								onGradientChange: ( newAttribute ) => {
									unitone.overlay ??= {};
									unitone.overlay.gradient = newAttribute;

									setAttributes( {
										unitone: cleanEmptyObject( unitone ),
									} );
								},
								isShownByDefault: true,
								resetAllFilter: () => ( {
									...attributes,
									unitone: {
										...attributes?.unitone,
										overlay: {
											...attributes?.unitone?.overlay,
											color: undefined,
											gradient: undefined,
										},
									},
								} ),
							},
						] }
						{ ...colorGradientSettings }
					/>

					<ToolsPanelItem
						hasValue={ () => null != unitone?.dimRatio }
						label={ __( 'Overlay opacity', 'unitone' ) }
						onDeselect={ () => {
							unitone.overlay ??= {};
							unitone.overlay.dimRatio = undefined;

							setAttributes( {
								unitone: cleanEmptyObject( unitone ),
							} );
						} }
						resetAllFilter={ () => ( {
							...attributes,
							unitone: {
								...attributes?.unitone,
								overlay: {
									...attributes?.unitone?.overlay,
									dimRatio: undefined,
								},
							},
						} ) }
						isShownByDefault
						panelId={ clientId }
					>
						<RangeControl
							__nextHasNoMarginBottom
							label={ __( 'Overlay opacity', 'unitone' ) }
							value={ attributes?.unitone?.overlay?.dimRatio }
							onChange={ ( newAttribute ) => {
								unitone.overlay ??= {};
								unitone.overlay.dimRatio = newAttribute;

								setAttributes( {
									unitone: cleanEmptyObject( unitone ),
								} );
							} }
							min={ 0 }
							max={ 100 }
							step={ 10 }
							required
							__next40pxDefaultSize
						/>
					</ToolsPanelItem>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/image/with-inspector-controls',
	withInspectorControls
);
