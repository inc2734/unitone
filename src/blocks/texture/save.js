import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { type, color, customColor, gap, size, offset, radius } = attributes;

	const blockProps = useBlockProps.save( {
		'data-unitone-layout': clsx( 'texture', {
			[ `-texture:${ type }` ]: !! type,
		} ),
		style: {
			'--unitone--texture-color': !! color
				? `var(--wp--preset--color--${ color })`
				: customColor,
			'--unitone--texture-gap': !! gap ? `${ gap }px` : undefined,
			'--unitone--texture-size': !! size ? `${ size }px` : undefined,
			'--unitone--texture-top':
				!! offset?.top && 0 < parseInt( offset?.top )
					? offset?.top
					: undefined,
			'--unitone--texture-right':
				!! offset?.right && 0 < parseInt( offset?.right )
					? offset?.right
					: undefined,
			'--unitone--texture-bottom':
				!! offset?.bottom && 0 < parseInt( offset?.bottom )
					? offset?.bottom
					: undefined,
			'--unitone--texture-left':
				!! offset?.left && 0 < parseInt( offset?.left )
					? offset?.left
					: undefined,
			'--unitone--texture-border-top-left-radius': radius?.topLeft,
			'--unitone--texture-border-top-right-radius': radius?.topRight,
			'--unitone--texture-border-bottom-right-radius':
				radius?.bottomRight,
			'--unitone--texture-border-bottom-left-radius': radius?.bottomLeft,
		},
	} );

	return <div { ...useInnerBlocksProps.save( { ...blockProps } ) } />;
}
