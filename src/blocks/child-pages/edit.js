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

import { useEffect } from '@wordpress/element';
import { Icon, globe } from '@wordpress/icons';
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
	const { showTopLevel, parent, parentTitle, className, columnMinWidth } =
		attributes;

	// linkcontrol returns value.title if present, so updating parent does not update the title.
	// In the past, parent.title was saved, so if it is saved, it is removed.
	useEffect( () => {
		setAttributes( {
			parentTitle: parent?.title || parentTitle,
			parent: {
				...parent,
				title: undefined,
			},
		} );
	}, [] );

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
							__nextHasNoMarginBottom
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
								__nextHasNoMarginBottom
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
									{ parentTitle && (
										<div className="unitone-search-post-control__parent-title">
											<Icon icon={ globe } />
											{ parentTitle }
										</div>
									) }
									<LinkControl
										onRemove={ () =>
											setAttributes( {
												parent: {
													...metadata.attributes
														.parent.default,
												},
												parentTitle:
													metadata.attributes
														.parentTitle.default,
											} )
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
													url: newAttribute.url,
												},
												parentTitle: newAttribute.title,
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
								__nextHasNoMarginBottom
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

			<div { ...useBlockProps( { className: 'unitone-child-pages' } ) }>
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
