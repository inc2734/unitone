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
					<ToggleControl
						label={ __( 'Revert', 'unitone' ) }
						checked={ revert }
						onChange={ ( newAttribute ) => {
							setAttributes( { revert: newAttribute } );
						} }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Sidebar', 'unitone' ) }>
					<SelectControl
						label={ __(
							'Columns to be treated as sidebars',
							'unitone'
						) }
						value={ sidebar }
						options={ [
							{
								label: __( 'Default', 'unitone' ),
								value: '',
							},
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

					<TextControl
						label={
							<>
								{ __( 'Width', 'unitone' ) }:
								<code>flex-basis</code>
							</>
						}
						value={ sidebarWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								sidebarWidth: newAttribute,
							} );
						} }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Content', 'unitone' ) }>
					<TextControl
						label={
							<>
								{ __( 'Max width', 'unitone' ) }:
								<code>max-width</code>
							</>
						}
						value={ contentMaxWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								contentMaxWidth: newAttribute,
							} );
						} }
					/>

					<TextControl
						label={
							<>
								{ __( 'Min width', 'unitone' ) }:
								<code>min-width</code>
							</>
						}
						value={ contentMinWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								contentMinWidth: newAttribute,
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
