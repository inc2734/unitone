import clsx from 'clsx';

import {
	InspectorControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Button,
	ToggleControl,
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';
import { useEntityRecords, store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { pencil, rotateRight } from '@wordpress/icons';
import { sprintf, __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/navigation' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		const hamburgerButtonColor = !! attributes?.unitone
			?.hamburgerButtonColor
			? `var(--wp--preset--color--${ attributes?.unitone?.hamburgerButtonColor })`
			: attributes?.unitone?.hamburgerButtonCustomColor;
		const hamburgerButtonBackgroundColor = !! attributes?.unitone
			?.hamburgerButtonBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.hamburgerButtonBackgroundColor })`
			: attributes?.unitone?.hamburgerButtonCustomBackgroundColor;

		const overlayMenuColor = !! attributes?.unitone?.overlayMenuColor
			? `var(--wp--preset--color--${ attributes?.unitone?.overlayMenuColor })`
			: attributes?.unitone?.overlayMenuCustomColor;
		const overlayMenuBackgroundColor = !! attributes?.unitone
			?.overlayMenuBackgroundColor
			? `var(--wp--preset--color--${ attributes?.unitone?.overlayMenuBackgroundColor })`
			: attributes?.unitone?.overlayMenuCustomBackgroundColor;

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				className: clsx( wrapperProps?.className, {
					'has-hamburger-button-color': !! hamburgerButtonColor,
					'has-hamburger-button-background-color':
						!! hamburgerButtonBackgroundColor,
					'has-overlay-menu-color': !! overlayMenuColor,
					'has-overlay-menu-background-color':
						!! overlayMenuBackgroundColor,
				} ),
				style: {
					...wrapperProps?.style,
					'--unitone--hamburger-button-color': hamburgerButtonColor,
					'--unitone--hamburger-button-background-color':
						hamburgerButtonBackgroundColor,
					'--unitone--overlay-menu-color': overlayMenuColor,
					'--unitone--overlay-menu-background-color':
						overlayMenuBackgroundColor,
					'--unitone--help-text': !! attributes?.unitone
						?.replaceOverlayMenu
						? `"${ __(
								'The template part overlay-menu is used as an overlay menu.',
								'unitone'
						  ) }"`
						: undefined,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/navigation/useBlockProps',
	useBlockProps
);

const TemplatePartSelectControl = ( { label, value, onChange } ) => {
	const [ refreshKey, setRefreshKey ] = useState( 0 );

	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{
			per_page: -1,
			_refresh: refreshKey,
		}
	);

	const overlayMenuSlugOptions = hasResolved
		? records
				.filter( ( item ) => item.area === 'unitone/overlay-menu' )
				.map( ( item ) => ( {
					label: item.title.rendered,
					value: item.slug,
				} ) )
		: [
				{
					label: __( 'List updating…', 'unitone' ),
					value: undefined,
				},
		  ];

	const { siteUrl, currentTheme } = useSelect( ( select ) => {
		const { getSite, getCurrentTheme } = select( coreStore );

		return {
			siteUrl: getSite()?.url,
			currentTheme: getCurrentTheme()?.stylesheet,
		};
	}, [] );

	if ( ! value ) {
		value = 'overlay-menu';
	}

	return (
		<VStack>
			<div>
				<BaseControl.VisualLabel as="legend">
					{ label }
				</BaseControl.VisualLabel>

				<p
					className="components-base-control__help"
					style={ {
						marginTop: '2px',
						marginBottom: '8px',
						fontSize: '12px',
						color: 'rgb(117, 117, 117)',
					} }
					dangerouslySetInnerHTML={ {
						__html: sprintf(
							// translators: %1$s: <a>, %2$s: </a>
							__(
								'Select an existing template part or %1$screate a new one%2$s.',
								'unitone'
							),
							`<a href="${ siteUrl }/wp-admin/site-editor.php?p=%2Fpattern&postType=wp_template_part&categoryId=unitone%2Foverlay-menu" target="_blank">`,
							'</a>'
						),
					} }
				/>

				<HStack spacing={ 0 }>
					<div style={ { flex: 1 } }>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							options={ overlayMenuSlugOptions }
							value={ value }
							onChange={ onChange }
						/>
					</div>

					<Button
						label={ __( 'Refresh list', 'unitone' ) }
						icon={ rotateRight }
						onClick={ () => setRefreshKey( ( k ) => k + 1 ) }
						style={ { flex: 0 } }
					/>

					<Button
						label={ __(
							'Edit the selected template part',
							'unitone'
						) }
						icon={ pencil }
						href={ `${ siteUrl }/wp-admin/site-editor.php?p=%2Fwp_template_part%2F${
							currentTheme || ''
						}%2F%2F${ value }&canvas=edit` }
						target="_blank"
						style={ { flex: 0 } }
					/>
				</HStack>
			</div>
		</VStack>
	);
};

const NavigationInspectorControls = ( {
	attributes,
	setAttributes,
	clientId,
} ) => {
	const { unitone = {} } = attributes;

	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const colors = colorGradientSettings.colors.flatMap(
		( palette ) => palette.colors
	);

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				replaceOverlayMenu: false,
			} ),
		} );
	};

	return (
		<>
			<InspectorControls group="color">
				<ColorGradientSettingsDropdown
					__experimentalIsRenderedInSidebar
					settings={ [
						{
							label: __( 'Button text', 'unitone' ),
							colorValue: unitone?.hamburgerButtonCustomColor,
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
										hamburgerButtonColor: newColor,
										hamburgerButtonCustomColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											hamburgerButtonColor: undefined,
											hamburgerButtonCustomColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Button background', 'unitone' ),
							colorValue:
								unitone?.hamburgerButtonCustomBackgroundColor,
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
										hamburgerButtonBackgroundColor:
											newColor,
										hamburgerButtonCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											hamburgerButtonBackgroundColor:
												undefined,
											hamburgerButtonCustomBackgroundColor:
												undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Overlay menu text', 'unitone' ),
							colorValue: unitone?.overlayMenuCustomColor,
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
										overlayMenuColor: newColor,
										overlayMenuCustomColor: newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											overlayMenuColor: undefined,
											overlayMenuCustomColor: undefined,
										} )
									),
								} );
							},
							clearable: true,
						},
						{
							label: __( 'Overlay menu background', 'unitone' ),
							colorValue:
								unitone?.overlayMenuCustomBackgroundColor,
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
										overlayMenuBackgroundColor: newColor,
										overlayMenuCustomBackgroundColor:
											newCustomColor,
									} ),
								} );
							},
							resetAllFilter: () => {
								setAttributes( {
									unitone: cleanEmptyObject(
										Object.assign( unitone, {
											overlayMenuBackgroundColor:
												undefined,
											overlayMenuCustomBackgroundColor:
												undefined,
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

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Overlay menu', 'unitone' ) }
					resetAll={ resetAll }
					panelId={ clientId }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => null != unitone?.replaceOverlayMenu }
						label={ __(
							'Use template parts for overlay menu',
							'unitone'
						) }
						onDeselect={ () => {
							unitone.replaceOverlayMenu = undefined;

							setAttributes( {
								unitone: cleanEmptyObject( unitone ),
							} );
						} }
						isShownByDefault
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToggleControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Use template parts for overlay menu',
								'unitone'
							) }
							checked={ unitone?.replaceOverlayMenu ?? false }
							onChange={ ( newSetting ) =>
								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										replaceOverlayMenu: newSetting,
									} ),
								} )
							}
						/>
					</ToolsPanelItem>

					{ !! unitone?.replaceOverlayMenu && (
						<ToolsPanelItem
							hasValue={ () => null != unitone?.overlayMenuSlug }
							label={ __( 'Template part to use', 'unitone' ) }
							onDeselect={ () => {
								unitone.overlayMenuSlug = undefined;

								setAttributes( {
									unitone: cleanEmptyObject( unitone ),
								} );
							} }
							isShownByDefault
							panelId={ clientId }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<VStack spacing="16px">
								<TemplatePartSelectControl
									label={ __(
										'Template part to use',
										'unitone'
									) }
									value={ unitone?.overlayMenuSlug }
									onChange={ ( newAttribute ) => {
										setAttributes( {
											unitone: cleanEmptyObject( {
												...unitone,
												overlayMenuSlug: newAttribute,
											} ),
										} );
									} }
								/>
							</VStack>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>
		</>
	);
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.isSelected || 'core/navigation' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />

				<NavigationInspectorControls { ...props } />
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/navigation/with-inspector-controls',
	withInspectorControls,
	9
);
