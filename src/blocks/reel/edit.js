import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { height, itemWidth, noBar, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--height': height || undefined,
			'--unitone--item-width': itemWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'reel',
		blockProps[ 'data-unitone-layout' ],
		{
			'-no-bar': noBar,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
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
							height !== metadata.attributes.height.default
						}
						isShownByDefault
						label={ __( 'Height', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								height: metadata.attributes.height.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Height', 'unitone' ) }&nbsp;:&nbsp;
									<code>height</code>
								</>
							}
							value={ height }
							onChange={ ( newAttribute ) => {
								setAttributes( { height: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							itemWidth !== metadata.attributes.itemWidth.default
						}
						isShownByDefault
						label={ __( 'Each items width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								itemWidth:
									metadata.attributes.itemWidth.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __( 'Each items width', 'unitone' ) } :
									<code>flex-basis</code>
								</>
							}
							value={ itemWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( { itemWidth: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							noBar !== metadata.attributes.noBar.default
						}
						isShownByDefault
						label={ __( 'No scrollbar', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								noBar: metadata.attributes.noBar.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'No scrollbar', 'unitone' ) }
							checked={ noBar }
							onChange={ ( newAttribute ) => {
								setAttributes( { noBar: newAttribute } );
							} }
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
