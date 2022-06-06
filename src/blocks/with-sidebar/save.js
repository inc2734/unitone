import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const {
		sidebarWidth,
		contentMinWidth,
		contentMaxWidth,
		revert,
		sidebar,
	} = attributes;

	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					'data-layout': classnames( 'with-sidebar', {
						[ `-sidebar:${ sidebar }` ]: !! sidebar,
						'-revert': revert,
					} ),
					style: {
						'--sidebar-width': sidebarWidth || undefined,
						'--content-min-width': contentMinWidth || undefined,
						'--content-max-width': contentMaxWidth || undefined,
					},
				} )
			) }
		/>
	);
}
