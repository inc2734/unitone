import clsx from 'clsx';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	withColors,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useRef, useEffect, useState } from '@wordpress/element';

import { arrowsIconTypes, Arrows, Pagination } from './components';

import {
	SettingsInspectorControls,
	ColorsInspectorControls,
} from './inspector-controls';

const moveToCurrentSlide = ( slide ) => {
	if ( ! slide ) {
		return;
	}

	const canvas = slide.closest( '.unitone-slider__canvas' );
	const wrapper = slide.closest( '.unitone-slider__wrapper' );
	const slider = wrapper.closest( '.unitone-slider' );
	const lastSlide = slide.parentNode.lastChild;
	const canCenterdSlides =
		'true' === canvas.getAttribute( 'data-unitone-swiper-centered-slides' );

	let x =
		wrapper.getBoundingClientRect().left -
		slide.getBoundingClientRect().left;

	if ( canCenterdSlides ) {
		x =
			x +
			( canvas.getBoundingClientRect().width -
				slide.getBoundingClientRect().width ) /
				2;
	}

	wrapper.style.transform = `translateX(${ x }px)`;

	if ( ! canCenterdSlides ) {
		const lastSlideRight =
			lastSlide.getBoundingClientRect().left + lastSlide.offsetWidth;

		const sliderRight =
			slider.getBoundingClientRect().left + slider.offsetWidth;

		if ( lastSlideRight < sliderRight ) {
			x = x + sliderRight - lastSlideRight;
			wrapper.style.transform = `translateX(${ x }px)`;
		}
	}
};

function Edit( props ) {
	const { attributes, isSelected, clientId, arrowsIconColor } = props;

	const {
		arrows,
		arrowsAlignment,
		arrowsJustification,
		arrowsIcon,
		hideOutside,
		pagination,
		paginationAlignment,
		paginationJustification,
		slideWidth,
		autoplay,
		autoplayDelay,
		loop,
		centeredSlides,
		effect,
		templateLock,
	} = attributes;

	const isDisplayArrowsSettings = ! autoplay || 0 < autoplayDelay;
	const isDisplayPaginationSettings = ! autoplay || 0 < autoplayDelay;

	const isDisplayArrows = arrows && isDisplayArrowsSettings;
	const isDisplayPagination = pagination && isDisplayPaginationSettings;
	const canMultiSlides = 'slide' === effect;
	const canCenterdSlides = canMultiSlides && centeredSlides;

	const [ canvasWidth, setCanvasWidth ] = useState( 0 );
	const ref = useRef();

	const { getSelectedBlockClientId, getBlockParents, hasSelectedInnerBlock } =
		useSelect( blockEditorStore );

	const { slides, selectedBlockClientId } = useSelect(
		( select ) => {
			return {
				slides: select( blockEditorStore ).getBlock( clientId )
					.innerBlocks,
				selectedBlockClientId: getSelectedBlockClientId(),
			};
		},
		[ clientId ]
	);

	const hasChildSelected = hasSelectedInnerBlock( clientId, true );
	const selectedSlideClientId = slides
		.filter(
			( slide ) =>
				slide.clientId === selectedBlockClientId ||
				getBlockParents( selectedBlockClientId ).some(
					( ansestorClientId ) => slide.clientId === ansestorClientId
				)
		)
		.map( ( v ) => v.clientId )?.[ 0 ];

	const { selectBlock } = useDispatch( blockEditorStore );

	/**
	 * Set ResizeObserver.
	 */
	useEffect( () => {
		const wrapper = ref.current;
		const canvas = wrapper.parentNode;
		const defaultView = ref.current.ownerDocument?.defaultView;

		const resizeObserver = new defaultView.ResizeObserver( () => {
			const currentCanvasWidth = canvas.getBoundingClientRect().width;
			setCanvasWidth( currentCanvasWidth );
		} );
		resizeObserver.observe( canvas );

		return () => {
			resizeObserver.disconnect();
		};
	}, [] );

	/**
	 * Reset position.
	 */
	useEffect( () => {
		const wrapper = ref.current;

		if ( ! canMultiSlides ) {
			wrapper.style.transform = '';
			return;
		}

		const currentSlideClientId =
			selectedSlideClientId || slides?.[ 0 ]?.clientId;

		if ( !! currentSlideClientId ) {
			moveToCurrentSlide(
				wrapper.ownerDocument.getElementById(
					`block-${ currentSlideClientId }`
				)
			);
		} else {
			wrapper.style.transform = '';
		}
	}, [ canvasWidth, centeredSlides, slideWidth, effect ] );

	/**
	 * Slide with each slides selected.
	 */
	useEffect( () => {
		if ( ! canMultiSlides ) {
			return;
		}

		if ( ! selectedSlideClientId ) {
			return;
		}

		const ownerDocument = ref.current.ownerDocument;

		moveToCurrentSlide(
			ownerDocument.getElementById( `block-${ selectedSlideClientId }` )
		);
	}, [ selectedSlideClientId, JSON.stringify( slides ) ] );

	const blockProps = useBlockProps( {
		className: clsx( 'unitone-slider', {
			'unitone-slider--hide-outside': canMultiSlides && hideOutside,
			'unitone-slider--has-pagination': pagination,
		} ),
		style: {
			'--unitone--slide-width':
				canMultiSlides && !! slideWidth ? slideWidth : undefined,
		},
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			ref,
			className: clsx( 'unitone-slider__wrapper', 'swiper-wrapper' ),
		},
		{
			templateLock,
			allowedBlocks: [ 'unitone/slide' ],
			template: [ [ 'unitone/slide' ], [ 'unitone/slide' ] ],
			renderAppender: false,
		}
	);

	return (
		<>
			<SettingsInspectorControls
				{ ...props }
				isDisplayArrowsSettings={ isDisplayArrowsSettings }
				isDisplayPaginationSettings={ isDisplayPaginationSettings }
				canMultiSlides={ canMultiSlides }
			/>

			<ColorsInspectorControls { ...props } />

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
							icons={
								arrowsIconTypes.filter(
									( arrowsIconType ) =>
										arrowsIconType.name === arrowsIcon?.type
								)?.[ 0 ]?.icons
							}
							iconStroke={ arrowsIcon?.stroke }
							iconSize={ arrowsIcon?.size }
							iconColor={ arrowsIconColor?.slug }
							iconCustomColor={ arrowsIconColor?.color }
							alignment={ arrowsAlignment }
							justification={ arrowsJustification }
						/>
					) }

					<div
						className={ clsx( 'unitone-slider__canvas', {
							'swiper-fade': 'fade' === effect,
						} ) }
						data-unitone-swiper-centered-slides={
							canCenterdSlides ? true : undefined
						}
						data-unitone-swiper-loop={ loop ? 'true' : undefined }
					>
						<div { ...innerBlocksProps } />
					</div>

					{ isDisplayArrows &&
						( 'bottom' === arrowsAlignment ||
							'center' === arrowsAlignment ) && (
							<Arrows
								icons={
									arrowsIconTypes.filter(
										( arrowsIconType ) =>
											arrowsIconType.name ===
											arrowsIcon.type
									)?.[ 0 ]?.icons
								}
								iconStroke={ arrowsIcon?.stroke }
								iconSize={ arrowsIcon?.size }
								iconColor={ arrowsIconColor?.slug }
								iconCustomColor={ arrowsIconColor?.color }
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
								sliderClientId === selectedSlideClientId;

							return (
								<Button
									variant={
										isActive ? 'primary' : 'secondary'
									}
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

export default withColors( { arrowsIconColor: 'color' } )( Edit );
