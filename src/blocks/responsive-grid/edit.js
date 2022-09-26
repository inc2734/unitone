import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { columnMinWidth } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--column-min-width': columnMinWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'responsive-grid',
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
								{ __( 'Column min width', 'unitone' ) }:
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
							setAttributes( { columnMinWidth: newAttribute } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
