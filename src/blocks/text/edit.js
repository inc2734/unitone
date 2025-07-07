import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	useSettings,
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

export default function ( {
	attributes,
	setAttributes,
	clientId,
	__unstableLayoutClassNames: layoutClassNames,
} ) {
	const { center, column, columnWidth, layout, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const [ layoutSettings ] = useSettings( 'layout' );
	const usedLayout = ! layout?.type
		? { ...layoutSettings, ...layout, type: 'constrained' }
		: { ...layoutSettings, ...layout };

	const blockProps = useBlockProps( {
		className: layoutClassNames,
		style: {
			'--unitone--column-width': ( column && columnWidth ) || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'text',
		'-gap',
		blockProps[ 'data-unitone-layout' ],
		{
			'-center': center,
			'-column': column,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		layout: usedLayout,
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
							center !== metadata.attributes.center.default
						}
						isShownByDefault
						label={ __(
							'Centering by intrinsic size of children',
							'unitone'
						) }
						onDeselect={ () =>
							setAttributes( {
								center: metadata.attributes.center.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Centering by intrinsic size of children',
								'unitone'
							) }
							checked={ center }
							onChange={ ( newAttribute ) => {
								setAttributes( { center: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							column !== metadata.attributes.column.default
						}
						isShownByDefault
						label={ __( 'Multi columns', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								column: metadata.attributes.column.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Multi columns', 'unitone' ) }
							checked={ column }
							onChange={ ( newAttribute ) => {
								setAttributes( { column: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ column && (
						<ToolsPanelItem
							hasValue={ () =>
								columnWidth !==
								metadata.attributes.columnWidth.default
							}
							isShownByDefault
							label={ __( 'Column width', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									columnWidth:
										metadata.attributes.columnWidth.default,
								} )
							}
						>
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={
									<>
										{ __( 'Column width', 'unitone' ) }
										&nbsp;:&nbsp;
										<code>colum-width</code>
									</>
								}
								value={ columnWidth || '' }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										columnWidth: newAttribute,
									} );
								} }
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
