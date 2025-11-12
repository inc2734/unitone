import clsx from 'clsx';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { HelpContainer } from '../../js/editor/hooks/components';
import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { ratio, switchRatio, allowedBlocks, templateLock } = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--ratio': ratio || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'frame',
		blockProps[ 'data-unitone-layout' ],
		{
			'-switch': switchRatio,
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
							ratio !== metadata.attributes.ratio.default
						}
						isShownByDefault
						label={ __( 'Preferred aspect ratio', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								ratio: metadata.attributes.ratio.default,
							} )
						}
					>
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={
								<>
									{ __(
										'Preferred aspect ratio',
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>aspect-ratio</code>
								</>
							}
							value={ ratio }
							onChange={ ( newAttribute ) =>
								setAttributes( { ratio: newAttribute } )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							switchRatio !==
							metadata.attributes.switchRatio.default
						}
						isShownByDefault
						label={ __( 'Switch aspect ratio', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								switchRatio:
									metadata.attributes.switchRatio.default,
							} )
						}
					>
						<HelpContainer
							help={ __(
								'Switch aspect ratio when portrait and mobile width.',
								'unitone'
							) }
							layout="horizontal"
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Switch aspect ratio', 'unitone' ) }
								checked={ switchRatio }
								onChange={ ( newAttribute ) => {
									setAttributes( {
										switchRatio: newAttribute,
									} );
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
