import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { height, itemWidth, noBar } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--height': height || undefined,
						'--unitone--item-width': itemWidth || undefined,
					},
					'data-unitone-layout': clsx( 'reel', {
						'-no-bar': noBar,
					} ),
				} )
			) }
		/>
	);
}
