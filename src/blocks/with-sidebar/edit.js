import classnames from 'classnames';

import {
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes } ) {
	const { sidebarWidth, contentMinWidth, contentMaxWidth, revert, sidebar } =
		attributes;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--sidebar-width': sidebarWidth || undefined,
			'--unitone--content-min-width': contentMinWidth || undefined,
			'--unitone--content-max-width': contentMaxWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'with-sidebar',
		blockProps[ 'data-unitone-layout' ],
		{
			[ `-sidebar:${ sidebar }` ]: !! sidebar,
			'-revert': revert,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: 'all',
		template: [
			[ 'unitone/with-sidebar-content' ],
			[ 'unitone/with-sidebar-content' ],
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

					<TextControl
						label={ __( 'Content min width', 'unitone' ) }
						value={ contentMinWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								contentMinWidth: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={ __( 'Content max width', 'unitone' ) }
						value={ contentMaxWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								contentMaxWidth: newAttribute,
							} );
						} }
					/>

					<ToggleControl
						label={ __( 'Revert', 'unitone' ) }
						checked={ revert }
						onChange={ ( newAttribute ) => {
							setAttributes( { revert: newAttribute } );
						} }
					/>

					<SelectControl
						label={ __( 'Sidebar', 'unitone' ) }
						value={ sidebar }
						options={ [
							{
								label: __( 'Right', 'unitone' ),
								value: 'right',
							},
							{
								label: __( 'Left', 'unitone' ),
								value: 'left',
							},
						] }
						onChange={ ( newAttribute ) =>
							setAttributes( {
								sidebar: newAttribute,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
