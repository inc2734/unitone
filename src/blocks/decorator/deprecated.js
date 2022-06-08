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
				tagName,
				shadow,
				position,
				top,
				right,
				bottom,
				left,
				zIndex,
			} = attributes;

			const TagName = tagName || 'div';

			return (
				<TagName
					{ ...useInnerBlocksProps.save(
						useBlockProps.save( {
							style: {
								'--top': top || undefined,
								'--right': right || undefined,
								'--bottom': bottom || undefined,
								'--left': left || undefined,
								'--z-index': zIndex || undefined,
							},
							'data-layout': classnames( 'decorator', {
								[ `-position:${ position }` ]: position,
								'-shadow': shadow,
							} ),
						} )
					) }
				/>
			);
		},
	},
];
