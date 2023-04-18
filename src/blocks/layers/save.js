import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { cover, fill, portrait } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': classnames( 'layers', {
						'-cover': cover,
						'-fill': fill,
						'-portrait': portrait,
					} ),
				} )
			) }
		/>
	);
}
