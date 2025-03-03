import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import {
	arrowsIconTypes,
	paginationIconTypes,
	Arrows,
	Pagination,
} from './components';

export default function ( { attributes } ) {
	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		arrowsIcon,
		hideOutside,
		pagination,
		paginationAlignment,
		paginationJustification,
		paginationIcon,
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
				className: clsx( 'unitone-slider', {
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
			{ isDisplayPagination &&
				( 'top' === paginationAlignment ||
					'top-inside' === paginationAlignment ) && (
					<Pagination
						icon={
							paginationIconTypes.filter(
								( paginationIconType ) =>
									paginationIconType.name ===
									paginationIcon?.type
							)?.[ 0 ]?.name
						}
						iconColor={ paginationIcon?.color }
						iconCustomColor={ paginationIcon?.customColor }
						alignment={ paginationAlignment }
						justification={ paginationJustification }
					/>
				) }

			<div className="unitone-slider__canvas-wrapper">
				{ isDisplayArrows &&
					( 'top' === arrowsAlignment ||
						'top-inside' === arrowsAlignment ) && (
						<Arrows
							icons={
								arrowsIconTypes.filter(
									( arrowsIconType ) =>
										arrowsIconType.name === arrowsIcon?.type
								)?.[ 0 ]?.icons
							}
							iconStroke={ arrowsIcon?.stroke }
							iconSize={ arrowsIcon?.size }
							iconColor={ arrowsIcon?.color }
							iconCustomColor={ arrowsIcon?.customColor }
							iconBackgroundColor={ arrowsIcon?.backgroundColor }
							iconCustomBackgroundColor={
								arrowsIcon?.customBackgroundColor
							}
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
					data-unitone-swiper-pagination-type={
						pagination && 'bullets' !== paginationIcon?.type
							? paginationIcon?.type
							: undefined
					}
					data-unitone-swiper-effect={
						'slide' !== effect ? effect : undefined
					}
				>
					<div
						{ ...useInnerBlocksProps.save( {
							className: clsx(
								'unitone-slider__wrapper',
								'swiper-wrapper'
							),
						} ) }
					/>
				</div>

				{ isDisplayArrows &&
					( 'bottom' === arrowsAlignment ||
						'bottom-inside' === arrowsAlignment ||
						'center' === arrowsAlignment ) && (
						<Arrows
							icons={
								arrowsIconTypes.filter(
									( arrowsIconType ) =>
										arrowsIconType.name === arrowsIcon?.type
								)?.[ 0 ]?.icons
							}
							iconStroke={ arrowsIcon?.stroke }
							iconSize={ arrowsIcon?.size }
							iconColor={ arrowsIcon?.color }
							iconCustomColor={ arrowsIcon?.customColor }
							iconBackgroundColor={ arrowsIcon?.backgroundColor }
							iconCustomBackgroundColor={
								arrowsIcon?.customBackgroundColor
							}
							alignment={ arrowsAlignment }
							justification={ arrowsJustification }
						/>
					) }
			</div>

			{ isDisplayPagination &&
				( 'bottom' === paginationAlignment ||
					'bottom-inside' === paginationAlignment ) && (
					<Pagination
						icon={
							paginationIconTypes.filter(
								( paginationIconType ) =>
									paginationIconType.name ===
									paginationIcon?.type
							)?.[ 0 ]?.name
						}
						iconColor={ paginationIcon?.color }
						iconCustomColor={ paginationIcon?.customColor }
						alignment={ paginationAlignment }
						justification={ paginationJustification }
					/>
				) }
		</div>
	);
}
