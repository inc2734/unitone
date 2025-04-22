import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { columnWidth } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--column-width': columnWidth || undefined,
					},
					'data-unitone-layout': 'masonry',
				} )
			) }
		/>
	);
}
