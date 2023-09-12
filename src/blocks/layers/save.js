import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { cover, fill, blur, portrait } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--blur': !! blur ? `${ blur }px` : undefined,
					},
					'data-unitone-layout': classnames( 'layers', {
						'-cover': cover,
						'-fill': fill,
						'-blur': !! blur,
						'-portrait': portrait,
					} ),
				} )
			) }
		/>
	);
}
