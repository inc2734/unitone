import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { threshold } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': 'switcher',
					style: {
						'--unitone--threshold': threshold || undefined,
					},
				} )
			) }
		/>
	);
}
