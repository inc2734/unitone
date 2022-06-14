import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { tagName, shadow, position, top, right, bottom, left, zIndex } =
		attributes;

	const TagName = tagName || 'div';

	return (
		<TagName
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					style: {
						'--unitone--top': top || undefined,
						'--unitone--right': right || undefined,
						'--unitone--bottom': bottom || undefined,
						'--unitone--left': left || undefined,
						'--unitone--z-index': zIndex || undefined,
					},
					'data-unitone-layout': classnames( 'decorator', {
						[ `-position:${ position }` ]: position,
						'-shadow': shadow,
					} ),
				} )
			) }
		/>
	);
}
