import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName, revert } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'stack', {
						'-revert': revert,
					} ),
				} )
			) }
		/>
	);
}
