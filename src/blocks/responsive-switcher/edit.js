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

import {
	normalizeForUnitControl,
	useToolsPanelDropdownMenuProps,
} from '../../js/editor/hooks/utils';

import { getResponsiveQuerySelectors } from '../../js/utils/css-container';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { breakpoint, allowedBlocks } = attributes;
	const selectors = getResponsiveQuerySelectors(
		`[data-unitone-client-id="${ clientId }"]`
	);
	const responsiveCSS = Object.entries( selectors )
		.map(
			( [ query, selector ] ) =>
				`@${ query } (min-width: ${ breakpoint }) { ${ selector } { --unitone--responsive-switcher-desktop-display: block; --unitone--responsive-switcher-mobile-display: none; } }`
		)
		.join( '\n' );

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
							label={ __( 'Break point', 'unitone' ) }
							value={ normalizeForUnitControl( breakpoint ) }
							units={ units }
							onChange={ ( value ) =>
								setAttributes( {
									breakpoint:
										normalizeForUnitControl( value ),
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...innerBlocksProps } />
			<style>{ responsiveCSS }</style>
		</>
	);
}
