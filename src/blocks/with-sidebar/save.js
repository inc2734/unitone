import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { sidebarWidth, contentMinWidth, contentMaxWidth, revert, sidebar } =
		attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-unitone-layout': classnames( 'with-sidebar', {
						[ `-sidebar:${ sidebar }` ]: !! sidebar,
						'-revert': revert,
					} ),
					style: {
						'--unitone--sidebar-width': sidebarWidth || undefined,
						'--unitone--content-min-width':
							contentMinWidth || undefined,
						'--unitone--content-max-width':
							contentMaxWidth || undefined,
					},
				} )
			) }
		/>
	);
}
