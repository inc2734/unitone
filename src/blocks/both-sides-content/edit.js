import classnames from 'classnames';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';

export default function ( { attributes, setAttributes, clientId } ) {
	const { contentWidth, contentMaxWidth } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--content-width': contentWidth || undefined,
			'--unitone--content-max-width': contentMaxWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'both-sides__content',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel label={ __( 'Settings', 'unitone' ) }>
					<ToolsPanelItem
						hasValue={ () =>
							contentWidth !==
							metadata.attributes.contentWidth.default
						}
						isShownByDefault
						label={ __( 'Width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								contentWidth:
									metadata.attributes.contentWidth.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __( 'Width', 'unitone' ) }&nbsp;:&nbsp;
									<code>flex-basis</code>
								</>
							}
							value={ contentWidth }
							onChange={ ( newAttribute ) => {
								setAttributes( { contentWidth: newAttribute } );
							} }
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							contentMaxWidth !==
							metadata.attributes.contentMaxWidth.default
						}
						isShownByDefault
						label={ __( 'Max width', 'unitone' ) }
						onDeselect={ () =>
							setAttributes( {
								contentMaxWidth:
									metadata.attributes.contentMaxWidth.default,
							} )
						}
					>
						<TextControl
							label={
								<>
									{ __( 'Max width', 'unitone' ) }
									&nbsp;:&nbsp;
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
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
