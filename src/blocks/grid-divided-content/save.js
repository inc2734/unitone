import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		className: 'unitone-grid__content',
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			'--unitone--background-image': !! attributes?.gradient
				? `var(--wp--preset--gradient--${ attributes?.gradient })`
				: attributes?.style?.color?.gradient,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-grid__content__content',
	} );

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
