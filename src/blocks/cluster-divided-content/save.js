import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useBlockProps.save( {
				'data-unitone-layout': 'cluster__content',
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					'data-unitone-layout': 'cluster__content__content',
				} ) }
			/>
		</TagName>
	);
}
