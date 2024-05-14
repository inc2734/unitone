import {
	Button,
	Disabled,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { divider } = attributes;

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							divider !== metadata.attributes.divider.default
						}
						isShownByDefault
						label={ __( 'Divider', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								divider: metadata.attributes.divider.default,
							} )
						}
					>
						<fieldset className="block-editor-text-transform-control">
							<div className="block-editor-text-transform-control__buttons">
								<Button
									isPressed={ 'slash' === divider }
									label={ __( 'Slash', 'unitone' ) }
									icon={ () => <>/</> }
									onClick={ () =>
										setAttributes( { divider: undefined } )
									}
								/>

								<Button
									isPressed={ 'hyphen' === divider }
									label={ __( 'Hyphen', 'unitone' ) }
									icon={ () => <>-</> }
									onClick={ () =>
										setAttributes( { divider: 'hyphen' } )
									}
								/>

								<Button
									isPressed={ 'underscore' === divider }
									label={ __( 'Underscore', 'unitone' ) }
									icon={ () => <>_</> }
									onClick={ () =>
										setAttributes( {
											divider: 'underscore',
										} )
									}
								/>

								<Button
									isPressed={ 'greater-than' === divider }
									label={ __( 'Greater than', 'unitone' ) }
									icon={ () => <>&gt;</> }
									onClick={ () =>
										setAttributes( {
											divider: 'greater-than',
										} )
									}
								/>

								<Button
									isPressed={ 'arrow' === divider }
									label={ __( 'Arrow', 'unitone' ) }
									icon={ () => <>→</> }
									onClick={ () =>
										setAttributes( { divider: 'arrow' } )
									}
								/>
							</div>
						</fieldset>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<Disabled>
					<ServerSideRender
						block="unitone/breadcrumbs"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
