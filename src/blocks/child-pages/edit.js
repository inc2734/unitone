import {
	InspectorControls,
	useBlockProps,
	__experimentalLinkControl as LinkControl,
} from '@wordpress/block-editor';

import {
	BaseControl,
	Disabled,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import ServerSideRender from '@wordpress/server-side-render';

export default function ( { attributes, setAttributes } ) {
	const { showTopLevel, parent } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<ToggleControl
						label={ __( 'Show top-level child pages', 'unitone' ) }
						checked={ showTopLevel }
						onChange={ ( newAttribute ) => {
							setAttributes( { showTopLevel: newAttribute } );
						} }
					/>

					{ ! showTopLevel && (
						<BaseControl
							label={ __( 'Specify the parent page', 'unitone' ) }
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
					) }
				</PanelBody>
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
