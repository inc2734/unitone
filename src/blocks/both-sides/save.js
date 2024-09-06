import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'both-sides' ),
				} )
			) }
		/>
	);
}
