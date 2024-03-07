import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, templateLock } = attributes;

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/stack-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = classnames(
		'stack__content',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
