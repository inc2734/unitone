import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { contentWidth, contentMaxWidth } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': 'both-sides__content',
					style: {
						'--unitone--content-width': contentWidth || undefined,
						'--unitone--content-max-width':
							contentMaxWidth || undefined,
					},
				} )
			) }
		/>
	);
}
