import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default function ( { attributes } ) {
	const { cover, fill, blur, portrait, columns, rows } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--blur': !! blur ? `${ blur }px` : undefined,
						'--unitone--columns':
							parseInt( columns ) !==
							metadata.attributes.columns.default
								? String( columns )
								: undefined,
						'--unitone--rows':
							parseInt( rows ) !==
							metadata.attributes.rows.default
								? String( rows )
								: undefined,
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
