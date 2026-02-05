import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName, nowrap } = attributes;

	const TagName = tagName;

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'cluster', {
						'-nowrap': nowrap,
					} ),
				} )
			) }
		/>
	);
}
