import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import {
	Arrows,
	Pagination,
	arrowsIconTypes,
	paginationIconTypes,
} from './components';

import metadata from './block.json';

export default [
	{
		attributes: {
			...metadata.attributes,
			arrowsIcon: {
				...metadata.attributes.arrowsIcon,
				default: {
					...metadata.attributes.arrowsIcon.default,
					type: '',
				},
			},
			arrowsIconColor: {
				type: 'string',
			},
			customArrowsIconColor: {
				type: 'string',
			},
			paginationIconColor: {
				type: 'string',
			},
			customPaginationIconColor: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( attributes, innerBlocks ) {
			return [
				{
					...{
						...attributes,
						arrowsIcon: {
							...attributes.arrowsIcon,
							type: attributes?.arrowsIcon?.type || 'chevron',
							color: attributes?.arrowsIconColor,
							customColor: attributes?.customArrowsIconColor,
						},
						paginationIcon: {
							...attributes.paginationIcon,
							color: attributes?.paginationIconColor,
							customColor: attributes?.customPaginationIconColor,
						},
					},
					innerBlocks,
				},
			];
		},

		save( { attributes } ) {
			const {
				arrows,
				arrowsAlignment,
				arrowsJustification,
				arrowsIcon,
				arrowsIconColor,
				customArrowsIconColor,
				hideOutside,
				pagination,
				paginationAlignment,
				paginationJustification,
				paginationIcon,
				paginationIconColor,
				customPaginationIconColor,
				slideWidth,
				autoplay,
				autoplayDelay,
				speed,
				loop,
				centeredSlides,
				effect,
			} = attributes;

			const isDisplayArrows =
				arrows && ! ( autoplay && 0 === autoplayDelay );
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
					{ isDisplayPagination && 'top' === paginationAlignment && (
						<Pagination
							icon={
								paginationIconTypes.filter(
									( paginationIconType ) =>
										paginationIconType.name ===
										paginationIcon?.type
								)?.[ 0 ]?.name
							}
							iconColor={ paginationIconColor }
							iconCustomColor={ customPaginationIconColor }
							alignment={ paginationAlignment }
							justification={ paginationJustification }
						/>
					) }

					<div className="unitone-slider__canvas-wrapper">
						{ isDisplayArrows && 'top' === arrowsAlignment && (
							<Arrows
								icons={
									arrowsIconTypes.filter(
										( arrowsIconType ) =>
											arrowsIconType.name ===
											arrowsIcon?.type
									)?.[ 0 ]?.icons
								}
								iconStroke={ arrowsIcon?.stroke }
								iconSize={ arrowsIcon?.size }
								iconColor={ arrowsIconColor }
								iconCustomColor={ customArrowsIconColor }
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
							data-unitone-swiper-loop={
								loop ? 'true' : undefined
							}
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
								'center' === arrowsAlignment ) && (
								<Arrows
									icons={
										arrowsIconTypes.filter(
											( arrowsIconType ) =>
												arrowsIconType.name ===
												arrowsIcon?.type
										)?.[ 0 ]?.icons
									}
									iconStroke={ arrowsIcon?.stroke }
									iconSize={ arrowsIcon?.size }
									iconColor={ arrowsIconColor }
									iconCustomColor={ customArrowsIconColor }
									alignment={ arrowsAlignment }
									justification={ arrowsJustification }
								/>
							) }
					</div>

					{ isDisplayPagination &&
						'bottom' === paginationAlignment && (
							<Pagination
								icon={
									paginationIconTypes.filter(
										( paginationIconType ) =>
											paginationIconType.name ===
											paginationIcon?.type
									)?.[ 0 ]?.name
								}
								iconColor={ paginationIconColor }
								iconCustomColor={ customPaginationIconColor }
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
			arrowsIcon: {
				...metadata.attributes.arrowsIcon,
				default: {
					...metadata.attributes.arrowsIcon.default,
					type: '',
				},
			},
			arrowsIconColor: {
				type: 'string',
			},
			customArrowsIconColor: {
				type: 'string',
			},
			paginationIconColor: {
				type: 'string',
			},
			customPaginationIconColor: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( attributes, innerBlocks ) {
			return [
				{
					...{
						...attributes,
						arrowsIcon: {
							...attributes.arrowsIcon,
							type: attributes?.arrowsIcon?.type || 'chevron',
							color: attributes?.arrowsIconColor,
							customColor: attributes?.customArrowsIconColor,
						},
						paginationIcon: {
							...attributes.paginationIcon,
							color: attributes?.paginationIconColor,
							customColor: attributes?.customPaginationIconColor,
						},
					},
					innerBlocks,
				},
			];
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
						className: clsx( 'unitone-slider', {
							'unitone-slider--hide-outside': hideOutSide,
							'unitone-slider--has-pagination': pagination,
						} ),
						'data-unitone-layout': clsx( {
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
									className: clsx(
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
			arrowsIcon: {
				...metadata.attributes.arrowsIcon,
				default: {
					...metadata.attributes.arrowsIcon.default,
					type: '',
				},
			},
			arrowsIconColor: {
				type: 'string',
			},
			customArrowsIconColor: {
				type: 'string',
			},
			paginationIconColor: {
				type: 'string',
			},
			customPaginationIconColor: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( attributes, innerBlocks ) {
			return [
				{
					...{
						...attributes,
						arrowsIcon: {
							...attributes.arrowsIcon,
							type: attributes?.arrowsIcon?.type || 'chevron',
							color: attributes?.arrowsIconColor,
							customColor: attributes?.customArrowsIconColor,
						},
						paginationIcon: {
							...attributes.paginationIcon,
							color: attributes?.paginationIconColor,
							customColor: attributes?.customPaginationIconColor,
						},
					},
					innerBlocks,
				},
			];
		},

		save( { attributes } ) {
			const { arrows, hideOutSide, pagination, slideWidth } = attributes;

			return (
				<div
					{ ...useBlockProps.save( {
						className: clsx( 'unitone-slider', {
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
									className: clsx(
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
			arrowsIcon: {
				...metadata.attributes.arrowsIcon,
				default: {
					...metadata.attributes.arrowsIcon.default,
					type: '',
				},
			},
			arrowsIconColor: {
				type: 'string',
			},
			customArrowsIconColor: {
				type: 'string',
			},
			paginationIconColor: {
				type: 'string',
			},
			customPaginationIconColor: {
				type: 'string',
			},
		},

		supports: {
			...metadata.supports,
		},

		migrate( attributes, innerBlocks ) {
			return [
				{
					...{
						...attributes,
						arrowsIcon: {
							...attributes.arrowsIcon,
							type: attributes?.arrowsIcon?.type || 'chevron',
							color: attributes?.arrowsIconColor,
							customColor: attributes?.customArrowsIconColor,
						},
						paginationIcon: {
							...attributes.paginationIcon,
							color: attributes?.paginationIconColor,
							customColor: attributes?.customPaginationIconColor,
						},
					},
					innerBlocks,
				},
			];
		},

		save( { attributes } ) {
			const { arrows, hideOutSide, pagination, slideWidth } = attributes;

			return (
				<div
					{ ...useBlockProps.save( {
						className: clsx( 'unitone-slider', {
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
								className: clsx(
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
