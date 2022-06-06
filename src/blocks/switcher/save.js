import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { threshold } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-layout': 'switcher',
					style: {
						'--threshold': threshold || undefined,
					},
				} )
			) }
		/>
	);
}
