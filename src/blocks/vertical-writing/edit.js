import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';
import { useVerticalWritingLayout } from './hooks/use-vertical-writing-layout';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const {
		textOrientation,
		switchWritingMode,
		threshold,
		allowedBlocks,
		templateLock,
	} = attributes;

	const innerBlocksLength = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);
	const hasInnerBlocks = !! innerBlocksLength;

	const ref = useVerticalWritingLayout();

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'vertical-writing-wrapper',
		blockProps[ 'data-unitone-layout' ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			ref,
			'data-unitone-layout': clsx(
				'vertical-writing',
				'vertical-writing:initialized',
				{
					[ `-text-orientation:${ textOrientation }` ]:
						!! textOrientation,
					'-switch': switchWritingMode,
				}
			),
			style: {
				'--unitone--threshold': threshold || undefined,
			},
		},
		{
			templateLock,
			allowedBlocks,
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

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
							textOrientation !==
							metadata.attributes.textOrientation.default
						}
						isShownByDefault
						label={
							<>
								{ __( 'Text orientation', 'unitone' ) }
								&nbsp;:&nbsp;
								<code>text-orientation</code>
							</>
						}
						onDeselect={ () =>
							setAttributes( {
								textOrientation:
									metadata.attributes.textOrientation.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Text orientation', 'unitone' ) }
							options={ [
								{ label: '', value: '' },
								{ label: 'mixed', value: 'mixed' },
								{ label: 'upright', value: 'upright' },
								{ label: 'sideways', value: 'sideways' },
							] }
							value={ textOrientation }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									textOrientation: newAttribute,
								} )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							threshold !== metadata.attributes.threshold.default
						}
						isShownByDefault
						label={ __( 'Threshold', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								threshold:
									metadata.attributes.threshold.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Threshold', 'unitone' ) }
							help={ __(
								'When this block is smaller than this width, switch to writing horizontally.',
								'unitone'
							) }
							value={ threshold }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									threshold: newAttribute,
								} );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							switchWritingMode !==
							metadata.attributes.switchWritingMode.default
						}
						isShownByDefault
						label={ __( 'Switch writing mode', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								switchWritingMode:
									metadata.attributes.switchWritingMode
										.default,
							} )
						}
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Switch writing mode', 'unitone' ) }
							help={ __(
								'Switch writing mode when portrait and mobile width.',
								'unitone'
							) }
							checked={ switchWritingMode }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									switchWritingMode: newAttribute,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
