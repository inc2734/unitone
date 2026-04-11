import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { placement } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					popover: 'auto',
					'data-unitone-layout': clsx( 'popover-content', {
						[ `-placement:${ placement }` ]: !! placement,
					} ),
				} )
			) }
		/>
	);
}
