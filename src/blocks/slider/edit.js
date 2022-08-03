import './editor.scss';

import classnames from 'classnames';

import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import {
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
	const { arrows, pagination, slideWidth } = attributes;

	const { selectBlock } = useDispatch( 'core/block-editor' );

	const { slides, selectedSlides, hasChildSelected } = useSelect(
		( select ) => {
			const _slides =
				select( 'core/block-editor' ).getBlock( clientId ).innerBlocks;

			return {
				slides: _slides,
				selectedSlides: _slides.filter(
					( slide ) =>
						slide.clientId ===
						select( 'core/block-editor' ).getSelectedBlockClientId()
				),
				hasChildSelected: select(
					'core/block-editor'
				).hasSelectedInnerBlock( clientId, true ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		if ( 0 < selectedSlides.length ) {
			const slide = document.querySelector(
				`.wp-block[data-block="${ selectedSlides[ 0 ].clientId }"]`
			);
			const wrapper = slide.parentNode;
			const slider = document.querySelector(
				`.wp-block[data-block="${ clientId }"]`
			);
			let x =
				wrapper.getBoundingClientRect().left -
				slide.getBoundingClientRect().left;

			wrapper.style.transform = `translateX(${ x }px)`;

			const lastSlide = document.querySelector(
				`.wp-block[data-block="${
					slides[ slides.length - 1 ].clientId
				}"]`
			);

			const lastSlideRight =
				lastSlide.getBoundingClientRect().left + lastSlide.offsetWidth;

			const sliderRight =
				slider.getBoundingClientRect().left + slider.offsetWidth;

			if ( lastSlideRight < sliderRight ) {
				x = x + sliderRight - lastSlideRight;
				wrapper.style.transform = `translateX(${ x }px)`;
			}
		}
	} );

	const blockProps = useBlockProps( {
		className: classnames( 'unitone-slider', {
			'unitone-slider--has-pagination': pagination,
		} ),
		style: {
			'--unitone--slide-width': slideWidth,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: classnames(
				'unitone-slider__wrapper',
				'swiper-wrapper'
			),
		},
		{
			templateLock: false,
			allowedBlocks: [ 'unitone/slide' ],
			renderAppender: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<TextControl
						label={ __( 'Each items width', 'unitone' ) }
						value={ slideWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( { slideWidth: newAttribute } );
						} }
					/>

					<ToggleControl
						label={ __( 'Using prev/next buttons', 'unitone' ) }
						checked={ arrows }
						onChange={ ( newAttribute ) => {
							setAttributes( { arrows: newAttribute } );
						} }
					/>

					<ToggleControl
						label={ __( 'Using pagination', 'unitone' ) }
						checked={ pagination }
						onChange={ ( newAttribute ) => {
							setAttributes( { pagination: newAttribute } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="unitone-slider__canvas">
					<div { ...innerBlocksProps } />

					{ pagination && (
						<div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
							{ slides.map( ( slide, index ) => (
								<span
									className="swiper-pagination-bullet"
									key={ index }
								></span>
							) ) }
						</div>
					) }

					{ arrows && (
						<>
							<div className="swiper-button-prev"></div>
							<div className="swiper-button-next"></div>
						</>
					) }
				</div>

				{ ( isSelected || hasChildSelected ) && (
					<div className="unitone-slider-pagination">
						{ slides.map( ( slide, index ) => {
							const sliderClientId = slide.clientId;
							const isActive =
								sliderClientId ===
								selectedSlides[ 0 ]?.clientId;

							return (
								<Button
									isPrimary={ isActive }
									isSecondary={ ! isActive }
									className="block-editor-button-block-appender"
									onClick={ () => {
										selectBlock( sliderClientId );
									} }
									key={ index }
								>
									<span>{ index + 1 }</span>
								</Button>
							);
						} ) }

						<InnerBlocks.ButtonBlockAppender />
					</div>
				) }
			</div>
		</>
	);
}
