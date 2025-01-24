import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { type, color, gap, size } = attributes;

	const blockProps = useBlockProps.save( {
		'data-unitone-layout': clsx( 'texture', {
			[ `-texture:${ type }` ]: !! type,
		} ),
		style: {
			'--unitone--texture-color': color || undefined,
			'--unitone--texture-gap': !! gap ? `${ gap }px` : undefined,
			'--unitone--texture-size': !! size ? `${ size }px` : undefined,
		},
	} );

	return <div { ...useInnerBlocksProps.save( { ...blockProps } ) } />;
}
