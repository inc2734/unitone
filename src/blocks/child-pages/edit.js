import {
	InspectorControls,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Disabled,
	TextControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __, sprintf } from '@wordpress/i18n';

import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';

const multiIncludes = ( haystack, needles ) => {
	if ( ! Array.isArray( haystack ) ) {
		haystack = !! haystack ? haystack.split( ' ' ) : [];
	}

	return needles.some( ( needle ) => haystack.includes( needle ) );
};

export default function ( { attributes, setAttributes } ) {
	const { showTopLevel, parent, className, columnMinWidth } = attributes;

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							showTopLevel !==
							metadata.attributes.showTopLevel.default
						}
						isShownByDefault
						label={ __( 'Show top-level child pages', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								showTopLevel:
									metadata.attributes.showTopLevel.default,
							} )
						}
					>
						<ToggleControl
							label={ __(
								'Show top-level child pages',
								'unitone'
							) }
							checked={ showTopLevel }
							onChange={ ( newAttribute ) => {
								setAttributes( { showTopLevel: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					{ ! showTopLevel && (
						<ToolsPanelItem
							hasValue={ () =>
								parent !== metadata.attributes.parent.default
							}
							isShownByDefault
							label={ __( 'Specify the parent page', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									parent: metadata.attributes.parent.default,
								} )
							}
						>
							<BaseControl
								label={ __(
									'Specify the parent page',
									'unitone'
								) }
								help={ __(
									'If not specified, a list of child pages of this page will be displayed.',
									'unitone'
								) }
								id="unitone/child-pages/search-post-control"
							>
								<div className="unitone-search-post-control">
									<LinkControl
										onRemove={ () =>
											setAttributes( { parent: {} } )
										}
										settings={ [] }
										searchInputPlaceholder={ __(
											'Search',
											'unitone'
										) }
										value={ parent }
										onChange={ ( newAttribute ) => {
											setAttributes( {
												parent: {
													id: newAttribute.id,
													title: newAttribute.title,
													url: newAttribute.url,
												},
											} );
										} }
										noDirectEntry={ true }
										noURLSuggestion={ true }
										suggestionsQuery={ {
											type: 'post',
											subtype: 'any',
										} }
										forceIsEditingLink={ ! parent?.id }
									/>
								</div>
							</BaseControl>
						</ToolsPanelItem>
					) }

					{ multiIncludes( className, [
						'is-style-box',
						'is-style-panel',
						'is-style-rich-media',
					] ) && (
						<ToolsPanelItem
							hasValue={ () =>
								columnMinWidth !==
								metadata.attributes.columnMinWidth.default
							}
							isShownByDefault
							label={ __( 'Column min width', 'unitone' ) }
							onDeselect={ () =>
								setAttributes( {
									columnMinWidth:
										metadata.attributes.columnMinWidth
											.default,
								} )
							}
						>
							<TextControl
								label={
									<>
										{ __( 'Column min width', 'unitone' ) }
										&nbsp;:&nbsp;
										<span
											dangerouslySetInnerHTML={ {
												__html: sprintf(
													// translators: %1$s: <code>, %2$s: </code>
													__(
														'Inside the %1$sgrid-template-columns%2$s formula',
														'unitone'
													),
													'<code>',
													'</code>'
												),
											} }
										/>
									</>
								}
								value={ columnMinWidth }
								onChange={ ( newAttribute ) =>
									setAttributes( {
										columnMinWidth: newAttribute,
									} )
								}
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...useBlockProps() }>
				<Disabled>
					<ServerSideRender
						block="unitone/child-pages"
						attributes={ attributes }
					/>
				</Disabled>
			</div>
		</>
	);
}
