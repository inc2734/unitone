import { InspectorControls } from '@wordpress/block-editor';

import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

import { HelpContainer } from '../hooks/components';

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();
		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		useEffect( () => {
			if ( 'core/button' !== props.name ) {
				return;
			}

			if ( ! attributes?.url ) {
				if ( undefined === unitone?.mediaLink ) {
					return;
				}

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						mediaLink: undefined,
					} ),
				} );
			}
		}, [ props.name, attributes?.url, unitone?.mediaLink ] );

		if ( ! props.isSelected || 'core/button' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const hasLink = !! attributes?.url;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel
						label="unitone"
						resetAll={ () => {
							setAttributes( {
								unitone: cleanEmptyObject( {
									...unitone,
									mediaLink: undefined,
								} ),
							} );
						} }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () => !! unitone?.mediaLink }
							label={ __( 'Open link as media link', 'unitone' ) }
							onDeselect={ () => {
								setAttributes( {
									unitone: cleanEmptyObject( {
										...unitone,
										mediaLink: undefined,
									} ),
								} );
							} }
							isShownByDefault
							panelId={ clientId }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<HelpContainer
								help={ __(
									'This can only be enabled if a link is set up.',
									'unitone'
								) }
								layout="horizontal"
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __(
										'Open link as media link',
										'unitone'
									) }
									checked={ !! unitone?.mediaLink }
									onChange={ ( newValue ) => {
										setAttributes( {
											unitone: cleanEmptyObject( {
												...unitone,
												mediaLink:
													newValue || undefined,
											} ),
										} );
									} }
									disabled={ ! hasLink }
								/>
							</HelpContainer>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	};
}, 'unitone/core/button/with-inspector-controls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/button/with-inspector-controls',
	withInspectorControls
);
