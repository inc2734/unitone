import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { fill, position } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'cover__content', {
						'-fill': fill,
						[ `-valign:${ position }` ]: !! position,
					} ),
				} )
			) }
		/>
	);
}
