import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { sidebarWidth, contentMinWidth, revert, sidebar } = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': clsx( 'with-sidebar', {
						[ `-sidebar:${ sidebar }` ]: !! sidebar,
						'-revert': revert,
					} ),
					style: {
						'--unitone--sidebar-width': sidebarWidth || undefined,
						'--unitone--content-min-width':
							contentMinWidth || undefined,
					},
				} )
			) }
		/>
	);
}
