import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-layout': 'with-sidebar__content',
				} )
			) }
		/>
	);
}
