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
	RangeControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
} from '@wordpress/icons';

import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	alignBottom,
	alignCenter,
	alignTop,
} from '../../js/editor/hooks/icons';

import { Arrows, Pagination } from './components';

const alignmentOptions = [
	{
		value: 'top',
		icon: alignTop,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'bottom',
		icon: alignBottom,
		label: __( 'Align items bottom', 'unitone' ),
	},
];

const justificationOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
];

export default function ( {
	attributes,
	setAttributes,
	isSelected,
	clientId,
} ) {
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

	const isDisplayArrows = arrows && ! ( autoplay && 0 === autoplayDelay );
	const isDisplayPagination =
		pagination && ! ( autoplay && 0 === autoplayDelay );

	const blockProps = useBlockProps( {
		className: classnames( 'unitone-slider', {
			'unitone-slider--hide-outside': hideOutSide,
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
			template: [ [ 'unitone/slide' ], [ 'unitone/slide' ] ],
			renderAppender: false,
		}
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'General', 'unitone' ) }>
					<TextControl
						label={
							<>
								{ __( 'Each items width', 'unitone' ) }:
								<code>width</code>
							</>
						}
						value={ slideWidth }
						onChange={ ( newAttribute ) => {
							setAttributes( { slideWidth: newAttribute } );
						} }
					/>

					<ToggleControl
						label={ __(
							'Hide parts that extend beyond the canvas',
							'unitone'
						) }
						checked={ hideOutSide }
						onChange={ ( newAttribute ) => {
							setAttributes( { hideOutSide: newAttribute } );
						} }
					/>

					<RangeControl
						label={ __( 'Speed (s)', 'unitone' ) }
						value={ speed || 0.3 }
						onChange={ ( newAttribute ) => {
							setAttributes( {
								speed: parseFloat( newAttribute ),
							} );
						} }
						min={ 0 }
						max={ 10 }
						step={ 0.1 }
					/>

					<ToggleControl
						label={ __( 'Loop', 'unitone' ) }
						checked={ loop }
						onChange={ ( newAttribute ) => {
							setAttributes( { loop: newAttribute } );
						} }
					/>
				</PanelBody>

				<PanelBody title={ __( 'The prev/next buttons', 'unitone' ) }>
					<ToggleControl
						label={ __( 'Using the prev/next buttons', 'unitone' ) }
						checked={ arrows }
						onChange={ ( newAttribute ) => {
							setAttributes( { arrows: newAttribute } );
						} }
					/>

					{ arrows && (
						<>
							<fieldset className="block-editor-hooks__flex-layout-justification-controls">
								<legend>
									{ __( 'Arrows alignment', 'unitone' ) }
								</legend>
								<div>
									{ alignmentOptions.map(
										( { value, icon, label } ) => {
											return (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														arrowsAlignment ===
														value
													}
													onClick={ () => {
														setAttributes( {
															arrowsAlignment:
																value,
														} );
													} }
												/>
											);
										}
									) }
								</div>
							</fieldset>

							<fieldset className="block-editor-hooks__flex-layout-justification-controls">
								<legend>
									{ __( 'Arrows justification', 'unitone' ) }
								</legend>
								<div>
									{ justificationOptions.map(
										( { value, icon, label } ) => {
											return (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														arrowsJustification ===
														value
													}
													onClick={ () => {
														setAttributes( {
															arrowsJustification:
																value,
														} );
													} }
												/>
											);
										}
									) }
								</div>
							</fieldset>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'The pagination', 'unitone' ) }>
					<ToggleControl
						label={ __( 'Using the pagination', 'unitone' ) }
						checked={ pagination }
						onChange={ ( newAttribute ) => {
							setAttributes( { pagination: newAttribute } );
						} }
					/>

					{ pagination && (
						<>
							<fieldset className="block-editor-hooks__flex-layout-justification-controls">
								<legend>
									{ __( 'Pagination alignment', 'unitone' ) }
								</legend>
								<div>
									{ alignmentOptions
										.filter(
											( { value } ) => 'center' !== value
										)
										.map( ( { value, icon, label } ) => {
											return (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														paginationAlignment ===
														value
													}
													onClick={ () => {
														setAttributes( {
															paginationAlignment:
																value,
														} );
													} }
												/>
											);
										} ) }
								</div>
							</fieldset>

							<fieldset className="block-editor-hooks__flex-layout-justification-controls">
								<legend>
									{ __(
										'Pagination justification',
										'unitone'
									) }
								</legend>
								<div>
									{ justificationOptions
										.filter(
											( { value } ) =>
												'space-between' !== value
										)
										.map( ( { value, icon, label } ) => {
											return (
												<Button
													key={ value }
													label={ label }
													icon={ icon }
													isPressed={
														paginationJustification ===
														value
													}
													onClick={ () => {
														setAttributes( {
															paginationJustification:
																value,
														} );
													} }
												/>
											);
										} ) }
								</div>
							</fieldset>
						</>
					) }
				</PanelBody>

				<PanelBody title={ __( 'Autoplay', 'unitone' ) }>
					<ToggleControl
						label={ __( 'Using the autoplay', 'unitone' ) }
						checked={ autoplay }
						onChange={ ( newAttribute ) => {
							setAttributes( { autoplay: newAttribute } );
						} }
					/>

					{ autoplay && (
						<RangeControl
							label={ __( 'Delay (s)', 'unitone' ) }
							value={ autoplayDelay }
							help={ __(
								'When 0, the prev/next buttons and the pagination will not be displayed.',
								'unitone'
							) }
							onChange={ ( newAttribute ) => {
								setAttributes( {
									autoplayDelay: parseFloat( newAttribute ),
								} );
							} }
							min={ 0 }
							max={ 10 }
							step={ 0.1 }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ isDisplayPagination && 'top' === paginationAlignment && (
					<Pagination
						slides={ slides }
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

					<div className="unitone-slider__canvas">
						<div { ...innerBlocksProps } />
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
						slides={ slides }
						alignment={ paginationAlignment }
						justification={ paginationJustification }
					/>
				) }

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
