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
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	useToolsPanelDropdownMenuProps,
	useVisibleResizeObserver,
} from '../../js/editor/hooks/utils';

import { HelpContainer } from '../../js/editor/hooks/components';

import metadata from './block.json';

import { setDividerLinewrap } from '@inc2734/unitone-css/library';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName, allowedBlocks, templateLock, nowrap } = attributes;

	const innerBlocksLength = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);
	const hasInnerBlocks = !! innerBlocksLength;

	const ref = useVisibleResizeObserver(
		( target ) => setDividerLinewrap( target ),
		[ attributes ]
	);

	const blockProps = useBlockProps( { ref } );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'cluster',
		blockProps[ 'data-unitone-layout' ],
		{
			'-nowrap': nowrap,
		}
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		orientation: 'horizontal',
		templateLock,
		allowedBlocks,
		renderAppender: hasInnerBlocks ? undefined : renderAppender,
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const TagName = tagName;

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							tagName !== metadata.attributes.tagName.default
						}
						isShownByDefault
						label={ __( 'HTML element', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								tagName: metadata.attributes.tagName.default,
							} )
						}
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'HTML element', 'unitone' ) }
							options={ [
								{ label: '<div>', value: 'div' },
								{ label: '<ul>', value: 'ul' },
								{ label: '<ol>', value: 'ol' },
							] }
							value={ tagName }
							onChange={ ( newAttribute ) =>
								setAttributes( { tagName: newAttribute } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							nowrap !== metadata.attributes.nowrap.default
						}
						isShownByDefault
						label={ __( 'No wrapping', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								nowrap: metadata.attributes.nowrap.default,
							} )
						}
					>
						<HelpContainer
							help={ __(
								'The overhanging part will not automatically scroll horizontally, so if there is a possibility that it may overhang, it must be enclosed in a parent element that allows horizontal scrolling.',
								'unitone'
							) }
							layout="horizontal"
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'No wrapping', 'unitone' ) }
								checked={ nowrap }
								onChange={ ( newAttribute ) => {
									setAttributes( { nowrap: newAttribute } );
								} }
							/>
						</HelpContainer>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
