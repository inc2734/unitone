import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { closedBy } = attributes;

	return (
		<dialog
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					closedby: closedBy,
					'data-unitone-layout': 'dialog-content',
				} )
			) }
		/>
	);
}
