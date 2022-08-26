import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { Arrows, Pagination } from './components';

export default function ( { attributes } ) {
	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		hideOutSide,
		pagination,
		paginationAlignment,
		paginationJustification,
		slideWidth,
	} = attributes;

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
			{ pagination && 'top' === paginationAlignment && (
				<Pagination
					alignment={ paginationAlignment }
					justification={ paginationJustification }
				/>
			) }

			<div className="unitone-slider__canvas-wrapper">
				{ arrows && 'top' === arrowsAlignment && (
					<Arrows
						alignment={ arrowsAlignment }
						justification={ arrowsJustification }
					/>
				) }

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

				{ arrows &&
					( 'bottom' === arrowsAlignment ||
						'center' === arrowsAlignment ) && (
						<Arrows
							alignment={ arrowsAlignment }
							justification={ arrowsJustification }
						/>
					) }
			</div>

			{ pagination && 'bottom' === paginationAlignment && (
				<Pagination
					alignment={ paginationAlignment }
					justification={ paginationJustification }
				/>
			) }
		</div>
	);
}
