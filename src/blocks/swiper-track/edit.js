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

import { isSingleSlideEffect, resolveSettings } from '../swiper/config';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );
const EMPTY_ARRAY = [];

const getOwnedSlideElements = ( track ) =>
	Array.from( track.querySelectorAll( '.unitone-swiper__slide' ) ).filter(
		( slide ) => slide.closest( '.unitone-swiper-track' ) === track
	);

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

	const centeredOffset = settings.centeredSlides
		? ( wrapper.clientWidth - activeSlide.offsetWidth ) / 2
		: 0;
	const maxOffset = Math.max( 0, wrapper.scrollWidth - wrapper.clientWidth );
	const offset = settings.centeredSlides
		? activeSlide.offsetLeft - centeredOffset
		: Math.min( maxOffset, Math.max( 0, activeSlide.offsetLeft ) );

	wrapper.style.transform = `translate3d(${ -offset }px, 0, 0)`;
};

export default function SwiperTrackEdit( {
	attributes,
	clientId,
	context,
	isSelected,
} ) {
	const { templateLock } = attributes;
	const rawSettings = context?.[ 'unitone/swiper/settings' ];
	const resolvedSettings = resolveSettings( rawSettings );
	const rootRef = useRef();
	const isRestoringSlide = useRef( false );
	const [ activeSlideClientId, setActiveSlideClientId ] = useState();

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
			const blockParents = selector.getBlockParents( clientId );
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
		if ( ! track || ! activeSlideClientId ) {
			return;
		}

		const editorSettings = {
			centeredSlides: resolvedSettings.centeredSlides,
			effect: resolvedSettings.effect,
		};
		const updatePosition = () =>
			moveToEditorSlide( track, activeSlideClientId, editorSettings );

		updatePosition();

		const defaultView = track.ownerDocument?.defaultView;
		if ( ! defaultView?.ResizeObserver ) {
			return;
		}

		const resizeObserver = new defaultView.ResizeObserver( updatePosition );
		resizeObserver.observe( track );

		return () => resizeObserver.disconnect();
	}, [
		activeSlideClientId,
		resolvedSettings.centeredSlides,
		resolvedSettings.breakpointsBase,
		resolvedSettings.effect,
		resolvedSettings.mdBreakpoint,
		resolvedSettings.smBreakpoint,
		resolvedSettings.slidesOffsetAfter,
		resolvedSettings.slidesOffsetBefore,
		resolvedSettings.slidesPerView,
		resolvedSettings.spaceBetween,
		rawSettings?.responsive,
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
