import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { intrinsic, withText } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': classnames( 'center', {
						'-intrinsic': intrinsic,
						'-with-text': withText,
					} ),
				} )
			) }
		/>
	);
}
