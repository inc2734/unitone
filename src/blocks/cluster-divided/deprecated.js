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
			const { tagName } = attributes;

			const TagName = tagName || 'div';

			let presetColor;
			if ( !! attributes?.unitone?.dividerColor ) {
				presetColor = `var(--wp--preset--color--${ attributes?.unitone?.dividerColor.replace(
					'/',
					'-'
				) })`;
			}

			return (
				<TagName
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames( 'cluster', {
								[ `-align-items:${ attributes?.unitone?.alignItems }` ]:
									null != attributes?.unitone?.alignItems,
								[ `-divider:${ attributes?.unitone?.dividerType }` ]:
									null != attributes?.unitone?.dividerType,
								[ `-gap:${ attributes?.unitone?.gap }` ]:
									null != attributes?.unitone?.gap,
								[ `-justify-content:${ attributes?.unitone?.justifyContent }` ]:
									null != attributes?.unitone?.justifyContent,
							} ),
							style: {
								'--unitone--divider-color':
									attributes?.unitone?.divider?.color ||
									presetColor,
								'--unitone--divider-style':
									attributes?.unitone?.divider?.style,
								'--unitone--divider-width':
									attributes?.unitone?.divider?.width,
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
			divider: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( { divider, unitone } ) {
			return {
				unitone: {
					...unitone,
					dividerType: divider,
				},
			};
		},

		save( { attributes } ) {
			const { divider } = attributes;

			return (
				<div
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							'data-unitone-layout': classnames( 'cluster', {
								[ `-divider:${ divider }` ]: !! divider,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
