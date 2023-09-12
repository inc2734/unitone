import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { center, column, unitone } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': classnames( 'text', {
						'-center': center,
						'-column': column,
						'-gap': null != unitone?.gap,
					} ),
				} )
			) }
		/>
	);
}
