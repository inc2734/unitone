import clsx from 'clsx';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToggleControl,
	TextControl,
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		sidebarWidth,
		contentMinWidth,
		revert,
		sidebar,
		allowedBlocks,
		templateLock,
	} = attributes;

	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const blocks = useSelect(
		( select ) => select( blockEditorStore ).getBlockOrder( clientId ),
		[ clientId ]
	);

	useEffect( () => {
		if ( ! revert === ( 'left' === sidebar ) ) {
			updateBlockAttributes( blocks[ 0 ], { type: 'aside' } );
			updateBlockAttributes( blocks[ 1 ], { type: 'main' } );
		} else {
			updateBlockAttributes( blocks[ 0 ], { type: 'main' } );
			updateBlockAttributes( blocks[ 1 ], { type: 'aside' } );
		}
	}, [ sidebar, revert ] );

	const blockProps = useBlockProps( {
		style: {
			'--unitone--sidebar-width': sidebarWidth || undefined,
			'--unitone--content-min-width': contentMinWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'with-sidebar',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-sidebar:${ sidebar }` ]: !! sidebar,
			'-revert': revert,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
		renderAppender: false,
		template: [
			[
				'unitone/with-sidebar-content',
				{ type: 'main', lock: { move: true, remove: true } },
			],
			[
				'unitone/with-sidebar-content',
				{ type: 'aside', lock: { move: true, remove: true } },
			],
		],
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							revert !== metadata.attributes.revert.default
						}
						isShownByDefault
						label={ __( 'Revert', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								revert: metadata.attributes.revert.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Revert', 'unitone' ) }
							help={ __(
								'In single-column display, by default, the elements on the left side of the two-column display are displayed on top, but when enabled, the elements on the right side of the two-column display are displayed on top.',
								'unitone'
							) }
							checked={ revert }
							onChange={ ( newAttribute ) => {
								setAttributes( { revert: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ _x( 'Secondary', 'with-sidebar', 'unitone' ) }
				>
					<ToolsPanelItem
						hasValue={ () =>
							sidebar !== metadata.attributes.sidebar.default
						}
						isShownByDefault
						label={ __(
							'A column to be treated as secondary',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								sidebar: metadata.attributes.sidebar.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'A column to be treated as secondary',
								'unitone'
							) }
							value={ sidebar }
							options={ [
								{
									label: __( 'Right', 'unitone' ),
									value: 'right',
								},
								{
									label: __( 'Left', 'unitone' ),
									value: 'left',
								},
							] }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									sidebar: newAttribute,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							sidebarWidth !==
							metadata.attributes.sidebarWidth.default
						}
						isShownByDefault
						label={ __( 'Width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								sidebarWidth:
									metadata.attributes.sidebarWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Width', 'unitone' ) }&nbsp;:&nbsp;
									<code>flex-basis</code>
								</>
							}
							help={ __(
								'If unspecified, the width of the secondary column is calculated from the width of the child elements.',
								'unitone'
							) }
							value={ sidebarWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									sidebarWidth: newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel label={ __( 'Main', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							contentMinWidth !==
							metadata.attributes.contentMinWidth.default
						}
						isShownByDefault
						label={ __( 'Min width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								contentMinWidth:
									metadata.attributes.contentMinWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Min width', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>min-width</code>
								</>
							}
							help={ __(
								'Wrap when content equals this width.',
								'unitone'
							) }
							value={ contentMinWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									contentMinWidth: newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
