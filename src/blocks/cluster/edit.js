import clsx from 'clsx';

import {
	ButtonBlockAppender,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { HelpContainer } from '../../js/editor/hooks/components';
import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId } ) {
	const { nowrap, templateLock } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
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

			<div { ...innerBlocksProps } />
		</>
	);
}
