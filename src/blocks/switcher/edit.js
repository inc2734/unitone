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
import { __, sprintf } from '@wordpress/i18n';

import { HelpContainer } from '../../js/editor/hooks/components';

import {
	useToolsPanelDropdownMenuProps,
	useVisibleResizeObserver,
} from '../../js/editor/hooks/utils';

import metadata from './block.json';

import { setStairsStep } from '@inc2734/unitone-css/library';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { revert, threshold, templateLock } = attributes;

	const innerBlocksLength = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);
	const hasInnerBlocks = !! innerBlocksLength;

	const ref = useVisibleResizeObserver(
		( target ) => setStairsStep( target ),
		[
			innerBlocksLength,
			attributes?.unitone?.stairsUp,
			attributes?.unitone?.stairs,
		]
	);

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--threshold': threshold || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'switcher',
		blockProps[ 'data-unitone-layout' ],
		{
			'-revert': revert,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
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
							label={
								<>
									{ __( 'Threshold', 'unitone' ) }
									&nbsp;:&nbsp;
									<span
										dangerouslySetInnerHTML={ {
											__html: sprintf(
												// translators: %1$s: <code>, %2$s: </code>
												__(
													'Inside the %1$sflex-basis%2$s formula',
													'unitone'
												),
												'<code>',
												'</code>'
											),
										} }
									/>
								</>
							}
							help={ __(
								'When this block is smaller than this width, the contents are arranged in a single column.',
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
								'In single-column display, by default, the elements on the left side of the multi-column display are displayed on top, but when enabled, the elements on the right side of the multi-column display are displayed on top.',
								'unitone'
							) }
							layout="horizontal"
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Revert', 'unitone' ) }
								checked={ revert }
								onChange={ ( newAttribute ) => {
									setAttributes( { revert: newAttribute } );
								} }
							/>
						</HelpContainer>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
