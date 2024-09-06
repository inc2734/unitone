import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { center, column, columnWidth } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--column-width':
							( column && columnWidth ) || undefined,
					},
					'data-unitone-layout': clsx( 'text', '-gap', {
						'-center': center,
						'-column': column,
					} ),
				} )
			) }
		/>
	);
}
