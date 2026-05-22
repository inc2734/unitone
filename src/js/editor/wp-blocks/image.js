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
	normalizeForToggleControl,
} from '../hooks/utils';

import { HelpContainer } from '../hooks/components';

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		useEffect( () => {
			if ( 'core/image' !== props.name ) {
				return;
			}

			if ( 'custom' === attributes?.linkDestination ) {
				return;
			}

			if ( undefined === unitone?.mediaLink ) {
				return;
			}

			setAttributes( {
				unitone: cleanEmptyObject( {
					...unitone,
					mediaLink: undefined,
				} ),
			} );
		}, [ props.name, attributes?.linkDestination, unitone?.mediaLink ] );

		if ( ! props.isSelected || 'core/image' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const linkUrl = attributes?.href;
		const isCustomLink =
			'custom' === attributes?.linkDestination && !! linkUrl;

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
									checked={ normalizeForToggleControl(
										!! unitone?.mediaLink
									) }
									onChange={ ( newValue ) => {
										const normalizedNewValue =
											normalizeForToggleControl(
												newValue
											);

										setAttributes( {
											unitone: cleanEmptyObject( {
												...unitone,
												mediaLink:
													normalizedNewValue ||
													undefined,
											} ),
										} );
									} }
									disabled={ ! isCustomLink }
								/>
							</HelpContainer>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/image/with-inspector-controls',
	withInspectorControls
);
