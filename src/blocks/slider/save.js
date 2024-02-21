import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { Arrows, Pagination } from './components';

export default function ( { attributes } ) {
	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		hideOutside,
		pagination,
		paginationAlignment,
		paginationJustification,
		slideWidth,
		autoplay,
		autoplayDelay,
		speed,
		loop,
		centeredSlides,
		effect,
	} = attributes;

	const isDisplayArrows = arrows && ! ( autoplay && 0 === autoplayDelay );
	const isDisplayPagination =
		pagination && ! ( autoplay && 0 === autoplayDelay );
	const canMultiSlides = 'slide' === effect;
	const canCenterdSlides = canMultiSlides && centeredSlides;

	return (
		<div
			{ ...useBlockProps.save( {
				className: classnames( 'unitone-slider', {
					'unitone-slider--hide-outside':
						canMultiSlides && hideOutside,
					'unitone-slider--has-pagination': pagination,
				} ),
				style: {
					'--unitone--slide-width':
						canMultiSlides && !! slideWidth
							? slideWidth
							: undefined,
				},
			} ) }
		>
			{ isDisplayPagination && 'top' === paginationAlignment && (
				<Pagination
					alignment={ paginationAlignment }
					justification={ paginationJustification }
				/>
			) }

			<div className="unitone-slider__canvas-wrapper">
				{ isDisplayArrows && 'top' === arrowsAlignment && (
					<Arrows
						alignment={ arrowsAlignment }
						justification={ arrowsJustification }
					/>
				) }

				<div
					className="unitone-slider__canvas"
					data-unitone-swiper-centered-slides={
						canCenterdSlides ? 'true' : undefined
					}
					data-unitone-swiper-autoplay-delay={
						autoplay ? autoplayDelay * 1000 : undefined
					}
					data-unitone-swiper-speed={
						0 < speed ? speed * 1000 : undefined
					}
					data-unitone-swiper-loop={ loop ? 'true' : undefined }
					data-unitone-swiper-effect={
						'slide' !== effect ? effect : undefined
					}
				>
					<div
						{ ...useInnerBlocksProps.save( {
							className: classnames(
								'unitone-slider__wrapper',
								'swiper-wrapper'
							),
						} ) }
					/>
				</div>

				{ isDisplayArrows &&
					( 'bottom' === arrowsAlignment ||
						'center' === arrowsAlignment ) && (
						<Arrows
							alignment={ arrowsAlignment }
							justification={ arrowsJustification }
						/>
					) }
			</div>

			{ isDisplayPagination && 'bottom' === paginationAlignment && (
				<Pagination
					alignment={ paginationAlignment }
					justification={ paginationJustification }
				/>
			) }
		</div>
	);
}
