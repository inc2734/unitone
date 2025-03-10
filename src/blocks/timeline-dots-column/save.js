import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { nonentity } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: clsx( 'unitone-timeline-dots-column', {
						'unitone-timeline-dots-column--nonentity': nonentity,
					} ),
				} )
			) }
		/>
	);
}
