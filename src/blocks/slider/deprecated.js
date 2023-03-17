import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { Arrows, Pagination } from './components';

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
				arrows,
				arrowsAlignment,
				arrowsJustification,
				hideOutSide,
				pagination,
				paginationAlignment,
				paginationJustification,
				slideWidth,
				autoplay,
				autoplayDelay,
				speed,
				loop,
			} = attributes;

			const isDisplayArrows =
				arrows && ! ( autoplay && 0 === autoplayDelay );
			const isDisplayPagination =
				pagination && ! ( autoplay && 0 === autoplayDelay );

			return (
				<div
					{ ...useBlockProps.save( {
						className: classnames( 'unitone-slider', {
							'unitone-slider--hide-outside': hideOutSide,
							'unitone-slider--has-pagination': pagination,
						} ),
						'data-unitone-layout': classnames( {
							[ `-gap:${ attributes?.unitone?.gap }` ]:
								null != attributes?.unitone?.gap,
						} ),
						style: {
							'--unitone--slide-width': slideWidth,
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
							data-unitone-swiper-autoplay-delay={
								autoplay ? autoplayDelay * 1000 : undefined
							}
							data-unitone-swiper-speed={
								0 < speed ? speed * 1000 : undefined
							}
							data-unitone-swiper-loop={
								loop ? 'true' : undefined
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

					{ isDisplayPagination &&
						'bottom' === paginationAlignment && (
							<Pagination
								alignment={ paginationAlignment }
								justification={ paginationJustification }
							/>
						) }
				</div>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { arrows, hideOutSide, pagination, slideWidth } = attributes;

			return (
				<div
					{ ...useBlockProps.save( {
						className: classnames( 'unitone-slider', {
							'unitone-slider--hide-outside': hideOutSide,
							'unitone-slider--has-pagination': pagination,
						} ),
						style: {
							'--unitone--slide-width': slideWidth,
						},
					} ) }
				>
					<div className="unitone-slider__canvas-wrapper">
						<div className="unitone-slider__canvas">
							<div
								{ ...useInnerBlocksProps.save( {
									className: classnames(
										'unitone-slider__wrapper',
										'swiper-wrapper'
									),
								} ) }
							/>
						</div>

						{ arrows && (
							<div className="swiper-buttons">
								<div className="swiper-button swiper-button-prev"></div>
								<div className="swiper-button swiper-button-next"></div>
							</div>
						) }
					</div>

					{ pagination && <div className="swiper-pagination"></div> }
				</div>
			);
		},
	},
	{
		attributes: {
			...metadata.attributes,
		},

		supports: {
			...metadata.supports,
		},

		save( { attributes } ) {
			const { arrows, hideOutSide, pagination, slideWidth } = attributes;

			return (
				<div
					{ ...useBlockProps.save( {
						className: classnames( 'unitone-slider', {
							'unitone-slider--hide-outside': hideOutSide,
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
					</div>

					{ pagination && <div className="swiper-pagination"></div> }

					{ arrows && (
						<>
							<div className="swiper-button-prev"></div>
							<div className="swiper-button-next"></div>
						</>
					) }
				</div>
			);
		},
	},
];
