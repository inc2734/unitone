import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: 'unitone-flex',
				} )
			) }
		/>
	);
}
