import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useBlockProps.save( {
				className: 'unitone-grid__content',
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					className: 'unitone-grid__content__content',
				} ) }
			/>
		</TagName>
	);
}
