import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export default function ( { attributes, setAttributes, clientId } ) {
	const { tagName } = attributes;

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'cluster',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		allowedBlocks: [ 'unitone/cluster-divided-content' ],
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	const TagName = tagName || 'div';

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<SelectControl
						label={ __( 'HTML element', 'unitone' ) }
						options={ [
							{ label: '<div>', value: 'div' },
							{ label: '<ul>', value: 'ul' },
							{ label: '<ol>', value: 'ol' },
						] }
						value={ tagName || 'div' }
						onChange={ ( newAttribute ) =>
							setAttributes( { tagName: newAttribute } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<TagName { ...innerBlocksProps } />
		</>
	);
}
