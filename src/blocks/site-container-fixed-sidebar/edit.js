import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes } ) {
	const { sidebarWidth } = attributes;

	const blockProps = useBlockProps( {
		className: 'site-container-fixed-sidebar',
		style: {
			'--unitone--sidebar-width': sidebarWidth || undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		template: [
			[ 'unitone/site-container-fixed-sidebar-content' ],
			[ 'unitone/site-container-fixed-sidebar-content' ],
		],
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<TextControl
						label={ __( 'Sidebar width', 'unitone' ) }
						value={ sidebarWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								sidebarWidth: newAttribute,
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
