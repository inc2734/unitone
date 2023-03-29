import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			sidebar: {
				type: 'string',
				default: '',
			},
			contentMaxWidth: {
				type: 'string',
			},
		},

		migrate( attributes ) {
			if ( ! attributes.sidebar ) {
				attributes.sidebar = 'right';
			}
			return attributes;
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
							'data-unitone-layout': classnames( 'with-sidebar', {
								[ `-sidebar:${ sidebar }` ]: !! sidebar,
								'-revert': revert,
							} ),
							style: {
								'--unitone--sidebar-width':
									sidebarWidth || undefined,
								'--unitone--content-min-width':
									contentMinWidth || undefined,
								'--unitone--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			sidebar: {
				type: 'string',
				default: '',
			},
			contentMaxWidth: {
				type: 'string',
			},
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
							'data-unitone-layout': classnames( 'with-sidebar', {
								[ `-sidebar:${ sidebar }` ]: !! sidebar,
								'-revert': revert,
								[ `-align-items:${ attributes?.unitone?.alignItems }` ]:
									null != attributes?.unitone?.alignItems,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
							} ),
							style: {
								'--unitone--sidebar-width':
									sidebarWidth || undefined,
								'--unitone--content-min-width':
									contentMinWidth || undefined,
								'--unitone--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			contentMaxWidth: {
				type: 'string',
			},
			sidebar: {
				type: 'string',
				default: 'right',
			},
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
							'data-unitone-layout': classnames( 'with-sidebar', {
								[ `-sidebar:${ sidebar }` ]: !! sidebar,
								'-revert': revert,
							} ),
							style: {
								'--unitone--sidebar-width':
									sidebarWidth || undefined,
								'--unitone--content-min-width':
									contentMinWidth || undefined,
								'--unitone--content-max-width':
									contentMaxWidth || undefined,
							},
						} )
					) }
				/>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
			contentMaxWidth: {
				type: 'string',
			},
			sidebar: {
				type: 'string',
				default: 'right',
			},
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
