import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { withText } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'center', {
						'-with-text': withText,
					} ),
				} )
			) }
		/>
	);
}
