import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { cover } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'layers',
		blockProps[ 'data-unitone-layout' ],
		{
			'-cover': cover,
		}
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		allowedBlocks: [ 'unitone/layer' ],
		template: [ [ 'unitone/layer' ], [ 'unitone/layer' ] ],
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<ToggleControl
						label={ __( 'Cover', 'unitone' ) }
						checked={ cover }
						onChange={ ( newAttribute ) => {
							setAttributes( { cover: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...innerBlocksProps } />
		</>
	);
}
