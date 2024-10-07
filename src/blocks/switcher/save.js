import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { revert, threshold } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'switcher', {
						'-revert': revert,
					} ),
					style: {
						'--unitone--threshold': threshold || undefined,
					},
				} )
			) }
		/>
	);
}
