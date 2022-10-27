import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName || 'div';

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': 'cluster',
				} )
			) }
		/>
	);
}
