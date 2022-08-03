import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { arrows, pagination, slideWidth } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				className: classnames( 'unitone-slider', {
					'unitone-slider--has-pagination': pagination,
				} ),
				style: {
					'--unitone--slide-width': slideWidth,
				},
			} ) }
		>
			<div className="unitone-slider__canvas">
				<div
					{ ...useInnerBlocksProps.save( {
						className: classnames(
							'unitone-slider__wrapper',
							'swiper-wrapper'
						),
					} ) }
				/>

				{ pagination && <div className="swiper-pagination"></div> }

				{ arrows && (
					<>
						<div className="swiper-button-prev"></div>
						<div className="swiper-button-next"></div>
					</>
				) }
			</div>
		</div>
	);
}