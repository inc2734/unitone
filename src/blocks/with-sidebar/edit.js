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
	const { sidebarWidth, contentMinWidth, revert, sidebar } = attributes;

	const blockProps = useBlockProps( {
		style: {
			'--unitone--sidebar-width': sidebarWidth || undefined,
			'--unitone--content-min-width': contentMinWidth || undefined,
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
								{ __( 'Width', 'unitone' ) }&nbsp;:&nbsp;
								<code>flex-basis</code>
							</>
						}
						help={ __(
							'If unspecified, the width of the sidebar is calculated from the width of the child elements.',
							'unitone'
						) }
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
								{ __( 'Min width', 'unitone' ) }&nbsp;:&nbsp;
								<code>min-width</code>
							</>
						}
						help={ __(
							'Wrap when content equals this width.',
							'unitone'
						) }
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
