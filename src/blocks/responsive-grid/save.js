import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { columnMinWidth } = attributes;

	return (
		<div
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
