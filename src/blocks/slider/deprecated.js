import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

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
