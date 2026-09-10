import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { createBlock } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { memo, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

import {
	DuplicateSwiperPart,
	useIsDuplicateSwiperPart,
} from '../swiper/editor-parts';

import {
	isSingleSlideEffect,
	resolveResponsiveSettings,
	resolveSettings,
} from '../swiper/config';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );
const EMPTY_ARRAY = [];

const getOwnedSlideElements = ( track ) =>
	Array.from( track.querySelectorAll( '.unitone-swiper__slide' ) ).filter(
		( slide ) => slide.closest( '.unitone-swiper-track' ) === track
	);

const getEditorSlideOffset = ( wrapper, slide, settings ) => {
	if ( settings.centeredSlides ) {
		return (
			slide.offsetLeft - ( wrapper.clientWidth - slide.offsetWidth ) / 2
		);
	}

	const maxOffset = Math.max( 0, wrapper.scrollWidth - wrapper.clientWidth );
	return Math.min( maxOffset, Math.max( 0, slide.offsetLeft ) );
};

const getNearestEditorSlideClientId = ( track, slideClientId, settings ) => {
	const slides = getOwnedSlideElements( track );
	const wrapper = slides[ 0 ]?.closest( '.unitone-swiper-track__wrapper' );
	const defaultView = track.ownerDocument?.defaultView;
	if (
		! wrapper ||
		! defaultView ||
		isSingleSlideEffect( settings.effect )
	) {
		return slideClientId;
	}

	// Use the rendered position, including during transitions, rather than the
	// destination specified by the inline transform.
	const transform = defaultView.getComputedStyle( wrapper ).transform;
	const currentOffset =
		'none' === transform
			? 0
			: -new defaultView.DOMMatrixReadOnly( transform ).m41;
	const getDistance = ( slide ) =>
		Math.abs(
			getEditorSlideOffset( wrapper, slide, settings ) - currentOffset
		);
	// Preserve the active slide when destinations coincide, such as at the end.
	const currentSlide = slides.find(
		( slide ) => `block-${ slideClientId }` === slide.id
	);
	const nearestSlide = slides.reduce(
		( nearest, slide ) =>
			getDistance( slide ) < getDistance( nearest ) ? slide : nearest,
		currentSlide || slides[ 0 ]
	);

	return nearestSlide.id.replace( /^block-/, '' );
};

const moveToEditorSlide = ( track, slideClientId, settings ) => {
	const slides = getOwnedSlideElements( track );
	const activeSlide = slides.find(
		( slide ) => `block-${ slideClientId }` === slide.id
	);
	const wrapper = activeSlide?.closest( '.unitone-swiper-track__wrapper' );
	const viewport = activeSlide?.closest( '.unitone-swiper-track__viewport' );

	slides.forEach( ( slide ) => {
		slide.classList.toggle(
			'is-unitone-swiper-editor-active',
			slide === activeSlide
		);
	} );

	track.classList.toggle(
		'has-unitone-swiper-editor-active-slide',
		!! activeSlide
	);

	if ( ! activeSlide || ! wrapper || ! viewport ) {
		return;
	}

	if ( isSingleSlideEffect( settings.effect ) ) {
		wrapper.style.transform = '';
		return;
	}

	const offset = getEditorSlideOffset( wrapper, activeSlide, settings );

	wrapper.style.transform = `translate3d(${ -offset }px, 0, 0)`;
};

export default function SwiperTrackEdit( props ) {
	const blockName = 'unitone/swiper-track';
	const isDuplicate = useIsDuplicateSwiperPart( props.clientId, blockName );

	return isDuplicate ? (
		<DuplicateSwiperPart blockName={ blockName } />
	) : (
		<SwiperTrackContent { ...props } />
	);
}

function SwiperTrackContent( { attributes, clientId, context, isSelected } ) {
	const { templateLock } = attributes;
	const rawSettings = context?.[ 'unitone/swiper/settings' ];
	const resolvedSettings = resolveSettings( rawSettings );
	const rootRef = useRef();
	const previousLayoutKey = useRef();
	const isRestoringSlide = useRef( false );
	const [ activeSlideClientId, setActiveSlideClientId ] = useState();

	// Include any new settings that affect editor slide dimensions, positions,
	// or alignment so changing them triggers correction to the nearest slide.
	const layoutKey = JSON.stringify( {
		responsive: resolveResponsiveSettings( rawSettings, resolvedSettings ),
		centeredSlides: resolvedSettings.centeredSlides,
		effect: resolvedSettings.effect,
		breakpointsBase: resolvedSettings.breakpointsBase,
		mdBreakpoint: resolvedSettings.mdBreakpoint,
		smBreakpoint: resolvedSettings.smBreakpoint,
		slidesOffsetBefore: resolvedSettings.slidesOffsetBefore,
		slidesOffsetAfter: resolvedSettings.slidesOffsetAfter,
	} );

	const {
		hasChildSelected,
		isSwiperSelected,
		selectedBlockClientId,
		selectedBlockParents,
		slides,
	} = useSelect(
		( select ) => {
			const selector = select( blockEditorStore );
			const currentSelectedBlockClientId =
				selector.getSelectedBlockClientId();
			const blockParents = selector.getBlockParents( clientId, true );
			const swiperClientId = blockParents.find(
				( parentClientId ) =>
					'unitone/swiper' ===
					selector.getBlock( parentClientId )?.name
			);

			return {
				hasChildSelected: selector.hasSelectedInnerBlock(
					clientId,
					true
				),
				isSwiperSelected:
					swiperClientId === currentSelectedBlockClientId,
				selectedBlockClientId: currentSelectedBlockClientId,
				selectedBlockParents: currentSelectedBlockClientId
					? selector.getBlockParents( currentSelectedBlockClientId )
					: EMPTY_ARRAY,
				slides: selector.getBlocks( clientId ),
			};
		},
		[ clientId ]
	);

	const { replaceInnerBlocks, selectBlock } = useDispatch( blockEditorStore );

	const slideClientIds = useMemo(
		() => slides.map( ( slide ) => slide.clientId ),
		[ slides ]
	);

	const selectedSlideClientId = useMemo( () => {
		if ( ! selectedBlockClientId ) {
			return undefined;
		}

		return slideClientIds.find(
			( slideClientId ) =>
				slideClientId === selectedBlockClientId ||
				selectedBlockParents.includes( slideClientId )
		);
	}, [ selectedBlockClientId, selectedBlockParents, slideClientIds ] );

	useEffect( () => {
		if ( slides.length ) {
			isRestoringSlide.current = false;
			return;
		}

		if ( isRestoringSlide.current ) {
			return;
		}

		isRestoringSlide.current = true;
		replaceInnerBlocks(
			clientId,
			[ createBlock( 'unitone/swiper-slide' ) ],
			false
		);
	}, [ clientId, replaceInnerBlocks, slides.length ] );

	useEffect( () => {
		if ( selectedSlideClientId ) {
			setActiveSlideClientId( selectedSlideClientId );
		}
	}, [ selectedSlideClientId ] );

	useEffect( () => {
		if (
			activeSlideClientId &&
			slideClientIds.includes( activeSlideClientId )
		) {
			return;
		}

		setActiveSlideClientId( slideClientIds[ 0 ] );
	}, [ activeSlideClientId, slideClientIds ] );

	useEffect( () => {
		const track = rootRef.current;
		const defaultView = track?.ownerDocument?.defaultView;
		if ( ! track || ! activeSlideClientId || ! defaultView ) {
			return;
		}

		const editorSettings = {
			centeredSlides: resolvedSettings.centeredSlides,
			effect: resolvedSettings.effect,
		};

		let frameId;
		let targetSlideClientId = activeSlideClientId;

		const updatePosition = () => {
			if (
				undefined !== previousLayoutKey.current &&
				previousLayoutKey.current !== layoutKey
			) {
				targetSlideClientId = getNearestEditorSlideClientId(
					track,
					targetSlideClientId,
					editorSettings
				);
				setActiveSlideClientId( targetSlideClientId );
			}
			previousLayoutKey.current = layoutKey;

			// Recalculate with the new dimensions even if the active slide is unchanged.
			moveToEditorSlide( track, targetSlideClientId, editorSettings );
		};

		const scheduleUpdatePosition = () => {
			defaultView.cancelAnimationFrame( frameId );
			frameId = defaultView.requestAnimationFrame( updatePosition );
		};

		// Wait for the parent block's CSS and child block's settings before measuring.
		scheduleUpdatePosition();

		let resizeObserver;
		if ( defaultView.ResizeObserver ) {
			resizeObserver = new defaultView.ResizeObserver(
				scheduleUpdatePosition
			);
			resizeObserver.observe( track );
			const slideElements = getOwnedSlideElements( track );
			const wrapper = slideElements[ 0 ]?.closest(
				'.unitone-swiper-track__wrapper'
			);
			if ( wrapper ) {
				resizeObserver.observe( wrapper );
			}
			slideElements.forEach( ( slide ) =>
				resizeObserver.observe( slide )
			);
		}

		return () => {
			defaultView.cancelAnimationFrame( frameId );
			resizeObserver?.disconnect();
		};
	}, [
		activeSlideClientId,
		layoutKey,
		resolvedSettings.centeredSlides,
		resolvedSettings.effect,
		slideClientIds,
	] );

	const blockProps = useBlockProps( {
		ref: rootRef,
		className: 'unitone-swiper-track',
		'data-unitone-swiper-editor-single-slide': isSingleSlideEffect(
			resolvedSettings.effect
		)
			? 'true'
			: undefined,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-swiper-track__wrapper swiper-wrapper',
		},
		{
			allowedBlocks: [ 'unitone/swiper-slide' ],
			templateLock,
			renderAppender: false,
		}
	);

	return (
		<div { ...blockProps }>
			<div className="unitone-swiper-track__viewport swiper">
				<div { ...innerBlocksProps } />
			</div>

			{ ( isSelected || hasChildSelected || isSwiperSelected ) &&
				0 < slides.length && (
					<div className="unitone-swiper-editor-pagination">
						{ slides.map( ( slide, index ) => {
							const isActive =
								slide.clientId === activeSlideClientId;

							return (
								<Button
									className="unitone-swiper-editor-pagination__button"
									key={ slide.clientId }
									variant={
										isActive ? 'primary' : 'secondary'
									}
									aria-label={ sprintf(
										/* translators: %d: slide number. */
										__( 'Go to slide %d', 'unitone' ),
										index + 1
									) }
									aria-pressed={ isActive }
									onClick={ () => {
										setActiveSlideClientId(
											slide.clientId
										);
										selectBlock( slide.clientId );
									} }
								>
									{ index + 1 }
								</Button>
							);
						} ) }

						<MemoizedButtonBlockAppender
							rootClientId={ clientId }
						/>
					</div>
				) }
		</div>
	);
}
