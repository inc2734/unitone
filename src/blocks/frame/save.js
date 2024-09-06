import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { ratio, switchRatio } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'frame', {
						'-switch': switchRatio,
					} ),
					style: {
						'--unitone--ratio': ratio || undefined,
					},
				} )
			) }
		/>
	);
}
