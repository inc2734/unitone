import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { columnMinWidth } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-layout': 'responsive-grid',
					style: {
						'--column-min-width': columnMinWidth || undefined,
					},
				} )
			) }
		/>
	);
}
