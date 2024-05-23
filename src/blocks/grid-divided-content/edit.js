import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, templateLock } = attributes;

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/grid-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-grid__content',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-grid__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? InnerBlocks.DefaultBlockAppender
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
