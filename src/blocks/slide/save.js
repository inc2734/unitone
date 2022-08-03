import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useInnerBlocksProps.save(
				useBlockProps.save( {
					className: classnames(
						'unitone-slider__slide',
						'swiper-slide'
					),
				} )
			) }
		/>
	);
}
