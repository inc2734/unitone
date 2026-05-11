import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { getTextureStyle } from './utils';

export default function ( { attributes } ) {
	const { type, color, customColor, gap, size, bandSize, offset, radius } =
		attributes;

	const blockProps = useBlockProps.save( {
		'data-unitone-layout': clsx( 'texture', {
			[ `-texture:${ type }` ]: !! type,
		} ),
		style: getTextureStyle( {
			type,
			color,
			customColor,
			gap,
			size,
			bandSize,
			offset,
			radius,
		} ),
	} );

	return <div { ...useInnerBlocksProps.save( { ...blockProps } ) } />;
}
