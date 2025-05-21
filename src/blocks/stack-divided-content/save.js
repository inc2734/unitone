import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			'--unitone--background-image': !! attributes?.gradient
				? `var(--wp--preset--gradient--${ attributes?.gradient })`
				: attributes?.style?.color?.gradient,
		},
		'data-unitone-layout': 'stack__content',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		'data-unitone-layout': 'stack__content__content',
	} );

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
