import classnames from 'classnames';

import {
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { threshold } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--threshold': threshold || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'switcher',
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
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<TextControl
						label={
							<>
								{ __( 'Threshold', 'unitone' ) }:
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'Inside the %1$sflex-basis%2$s formula',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							</>
						}
						value={ threshold }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								threshold: newAttribute,
							} );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
