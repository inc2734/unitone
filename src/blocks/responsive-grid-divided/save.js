import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName, columnMinWidth } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': 'responsive-grid',
					style: {
						'--unitone--column-min-width':
							columnMinWidth || undefined,
					},
				} )
			) }
		/>
	);
}
