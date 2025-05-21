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
				context[ 'unitone/flex-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context[ 'unitone/flex-divided/tagName' ] ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-flex__content',
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			'--unitone--background-image': !! attributes?.gradient
				? `var(--wp--preset--gradient--${ attributes?.gradient })`
				: attributes?.style?.color?.gradient,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-flex__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? undefined
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
