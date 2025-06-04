import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { clientId } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: 'unitone-responsive-switcher',
					'data-unitone-client-id': clientId,
				} )
			) }
		/>
	);
}
