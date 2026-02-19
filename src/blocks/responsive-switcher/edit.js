import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { breakpoint, allowedBlocks } = attributes;

	const blockProps = useBlockProps( {
		className: 'unitone-responsive-switcher',
		'data-unitone-client-id': clientId,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		allowedBlocks,
		renderAppender: false,
		template: [
			[
				'unitone/responsive-switcher-container',
				{ viewport: 'desktop' },
			],
			[ 'unitone/responsive-switcher-container', { viewport: 'mobile' } ],
		],
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const units = useCustomUnits( {
		availableUnits: [ 'px', 'em', 'rem' ],
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							breakpoint !==
							metadata.attributes.breakpoint.default
						}
						isShownByDefault
						label={ __( 'Dot size', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								breakpoint:
									metadata.attributes.breakpoint.default,
							} )
						}
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __( 'Break point', 'unitone' ) }
							value={ breakpoint || '' }
							units={ units }
							onChange={ ( value ) =>
								setAttributes( {
									breakpoint: value,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
			<style>{ `@media (min-width: ${ breakpoint }) { [data-unitone-client-id="${ clientId }"] > .unitone-responsive-switcher-container--desktop { display: block; } [data-unitone-client-id="${ clientId }"] > .unitone-responsive-switcher-container--mobile { display: none; } }` }</style>
		</>
	);
}
