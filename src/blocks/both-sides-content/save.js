import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { contentWidth, contentMaxWidth } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-layout': 'both-sides__content',
					style: {
						'--content-width': contentWidth || undefined,
						'--content-max-width': contentMaxWidth || undefined,
					},
				} )
			) }
		/>
	);
}
