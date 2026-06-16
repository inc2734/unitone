import clsx from 'clsx';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from '@wordpress/block-editor';

import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

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

import { HelpContainer } from '../../js/editor/hooks/components';

import {
	normalizeForSelectControl,
	normalizeForTextControl,
	normalizeForToggleControl,
	useToolsPanelDropdownMenuProps,
	useVisibleLayoutObserver,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

import { setDividerLinewrap } from '@inc2734/unitone-css/library';

export default function ( { name, attributes, setAttributes, clientId } ) {
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
	const hasInnerBlocks = !! blocks.length;

	useEffect( () => {
		if ( ! blocks[ 0 ] || ! blocks[ 1 ] ) {
			return;
		}

		if ( ! revert === ( 'left' === sidebar ) ) {
			updateBlockAttributes( blocks[ 0 ], { type: 'aside' } );
			updateBlockAttributes( blocks[ 1 ], { type: 'main' } );
		} else {
			updateBlockAttributes( blocks[ 0 ], { type: 'main' } );
			updateBlockAttributes( blocks[ 1 ], { type: 'aside' } );
		}
	}, [ blocks, revert, sidebar, updateBlockAttributes ] );

	const ref = useVisibleLayoutObserver( ( target ) =>
		setDividerLinewrap( target )
	);

	const blockProps = useBlockProps( {
		ref,
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
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
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
						<HelpContainer
							help={ __(
								'In single-column display, by default, the elements on the left side of the two-column display are displayed on top, but when enabled, the elements on the right side of the two-column display are displayed on top.',
								'unitone'
							) }
							layout="horizontal"
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Revert', 'unitone' ) }
								checked={ normalizeForToggleControl( revert ) }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										revert: normalizeForToggleControl(
											newAttribute
										),
									} );
								} }
							/>
						</HelpContainer>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ _x( 'Secondary', 'with-sidebar', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
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
							value={ normalizeForSelectControl( sidebar ) }
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
									sidebar:
										normalizeForSelectControl(
											newAttribute
										),
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
									<code className="unitone-label-code">
										flex-basis
									</code>
								</>
							}
							value={ normalizeForTextControl( sidebarWidth ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									sidebarWidth:
										normalizeForTextControl( newAttribute ),
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>

				<ToolsPanel
					label={ __( 'Main', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
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
									<code className="unitone-label-code">
										min-width
									</code>
								</>
							}
							help={ __(
								'Wrap when content equals this width.',
								'unitone'
							) }
							value={ normalizeForTextControl( contentMinWidth ) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									contentMinWidth:
										normalizeForTextControl( newAttribute ),
								} );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			{ hasInnerBlocks ? (
				<div { ...innerBlocksProps } />
			) : (
				<Placeholder { ...{ clientId, name, setAttributes } } />
			) }
		</>
	);
}

function Placeholder( { clientId, name, setAttributes } ) {
	const { blockType, defaultVariation, variations } = useSelect(
		( select ) => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( blocksStore );

			return {
				blockType: getBlockType( name ),
				defaultVariation: getDefaultBlockVariation( name, 'block' ),
				variations: getBlockVariations( name, 'block' ),
			};
		},
		[ name ]
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	return (
		<div { ...useBlockProps() }>
			<BlockVariationPicker
				icon={ blockType?.icon?.src }
				label={ blockType?.title }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation?.attributes ) {
						setAttributes( nextVariation.attributes );
					}
					if ( nextVariation?.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								nextVariation.innerBlocks
							),
							true
						);
					}
				} }
				allowSkip={ false }
			/>
		</div>
	);
}
