import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { alignSelf, justifySelf, gridColumn, gridRow } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': classnames( 'layers__layer', {
						[ `-align-self:${ alignSelf }` ]: !! alignSelf,
						[ `-justify-self:${ justifySelf }` ]: !! justifySelf,
					} ),
					style: {
						'--unitone--grid-column': gridColumn || undefined,
						'--unitone--grid-row': gridRow || undefined,
					},
				} )
			) }
		/>
	);
}
