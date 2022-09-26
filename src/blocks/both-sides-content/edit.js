import classnames from 'classnames';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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
				<PanelBody>
					<TextControl
						label={
							<>
								{ __( 'Width', 'unitone' ) } :
								<code>flex-basis</code>
							</>
						}
						value={ contentWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( { contentWidth: newAttribute } );
						} }
					/>

					<TextControl
						label={
							<>
								{ __( 'Max width', 'unitone' ) } :
								<code>max-width</code>
							</>
						}
						value={ contentMaxWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( { contentMaxWidth: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
