import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
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
								'--content-min-width':
									contentMinWidth || undefined,
								'--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
];
