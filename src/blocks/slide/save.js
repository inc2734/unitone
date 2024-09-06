import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: clsx( 'unitone-slider__slide', 'swiper-slide' ),
				} )
			) }
		/>
	);
}
