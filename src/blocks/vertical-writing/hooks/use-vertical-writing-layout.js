import {
	useCallback,
	useRef,
	useEffect,
	useLayoutEffect,
} from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';

import {
	setColumnCountForVertical,
	debounce,
} from '@inc2734/unitone-css/library';

export function useVerticalWritingLayout( innerBlocksLength ) {
	const ref = useRef( null );
	const listenerAttachedRef = useRef( false );
	const previousWidthRef = useRef( null );
	const previousInnerBlocksLengthRef = useRef( innerBlocksLength );
	const isComposingRef = useRef( false );
	const childResizeObserverRef = useRef( null );
	const layoutFrameIdRef = useRef( null );
	const layoutFrameViewRef = useRef( null );

	const isInputting = ( doc ) => {
		const activeElement = doc?.activeElement;
		if ( ! activeElement ) {
			return false;
		}

		return (
			activeElement.isContentEditable ||
			[ 'INPUT', 'TEXTAREA' ].includes( activeElement.tagName )
		);
	};

	const updateColumnLayout = useCallback( ( element ) => {
		if ( ! element?.lastElementChild ) {
			return;
		}

		const lastRect = element.lastElementChild.getBoundingClientRect();
		const parentRect = element.parentNode.getBoundingClientRect();

		const lastEnd = lastRect.top + lastRect.height;
		const parentEnd = parentRect.top + parentRect.height;

		const isSafariMatch = parentRect.left > lastRect.left;
		const heightMismatch = Math.abs( parentEnd - lastEnd ) > 1;

		if ( isSafariMatch || heightMismatch ) {
			setColumnCountForVertical( element );
		}
	}, [] );

	const cancelScheduledLayout = useCallback( () => {
		if ( layoutFrameIdRef.current && layoutFrameViewRef.current ) {
			layoutFrameViewRef.current.cancelAnimationFrame(
				layoutFrameIdRef.current
			);
		}

		layoutFrameIdRef.current = null;
		layoutFrameViewRef.current = null;
	}, [] );

	const scheduleColumnLayout = useCallback(
		( element ) => {
			const win = element?.ownerDocument?.defaultView;
			if ( ! element || ! win || layoutFrameIdRef.current ) {
				return;
			}

			layoutFrameViewRef.current = win;
			layoutFrameIdRef.current = win.requestAnimationFrame( () => {
				layoutFrameIdRef.current = null;
				layoutFrameViewRef.current = null;

				if ( element.isConnected ) {
					updateColumnLayout( element );
				}
			} );
		},
		[ updateColumnLayout ]
	);

	const disconnectChildResizeObserver = useCallback( () => {
		if ( childResizeObserverRef.current ) {
			childResizeObserverRef.current.disconnect();
			childResizeObserverRef.current = null;
		}
	}, [] );

	const observeDirectChildrenResize = useCallback(
		( element ) => {
			disconnectChildResizeObserver();

			const win = element?.ownerDocument?.defaultView;
			if ( ! element || ! win?.ResizeObserver ) {
				return;
			}

			const children = [ ...element.children ].filter( ( child ) => {
				const style = win.getComputedStyle( child );
				return (
					! [ 'absolute', 'fixed' ].includes( style.position ) &&
					'none' !== style.display
				);
			} );
			if ( ! children.length ) {
				return;
			}

			const observer = new win.ResizeObserver( () => {
				scheduleColumnLayout( element );
			} );
			children.forEach( ( child ) => observer.observe( child ) );
			childResizeObserverRef.current = observer;
		},
		[ disconnectChildResizeObserver, scheduleColumnLayout ]
	);

	const debouncedHandler = debounce( () => {
		const element = ref.current;
		if ( element ) {
			updateColumnLayout( element );
		}
	}, 250 );

	const onKeydown = ( event ) => {
		const doc = event?.target?.ownerDocument;
		if (
			event?.isComposing ||
			isComposingRef.current ||
			isInputting( doc )
		) {
			return;
		}

		debouncedHandler();
	};

	const onCompositionStart = () => {
		isComposingRef.current = true;
	};

	const onCompositionEnd = () => {
		isComposingRef.current = false;
		debouncedHandler();
	};

	const onIntersection = ( [ entry ] ) => {
		const { isIntersecting, target } = entry;
		const doc = target?.ownerDocument;
		const win = doc?.defaultView;

		if (
			!! doc &&
			!! win &&
			isIntersecting &&
			! listenerAttachedRef.current
		) {
			updateColumnLayout( ref.current );
			observeDirectChildrenResize( ref.current );
			doc.addEventListener( 'click', debouncedHandler );
			win.addEventListener( 'keydown', onKeydown );
			doc.addEventListener( 'compositionstart', onCompositionStart );
			doc.addEventListener( 'compositionend', onCompositionEnd );
			listenerAttachedRef.current = true;
		} else if ( ! isIntersecting && listenerAttachedRef.current ) {
			doc.removeEventListener( 'click', debouncedHandler );
			win.removeEventListener( 'keydown', onKeydown );
			doc.removeEventListener( 'compositionstart', onCompositionStart );
			doc.removeEventListener( 'compositionend', onCompositionEnd );
			disconnectChildResizeObserver();
			cancelScheduledLayout();
			listenerAttachedRef.current = false;
		}
	};

	useEffect( () => {
		if ( ! ref.current ) {
			return;
		}

		const observer = new IntersectionObserver( onIntersection, {
			rootMargin: '200px 0px',
		} );
		observer.observe( ref.current.parentNode );

		return () => {
			observer.disconnect();
			disconnectChildResizeObserver();
			cancelScheduledLayout();

			if ( listenerAttachedRef.current ) {
				const doc = ref.current?.ownerDocument;
				const win = doc?.defaultView;

				if ( !! doc && !! win ) {
					doc.removeEventListener( 'click', debouncedHandler );
					win.removeEventListener( 'keydown', onKeydown );
					doc.removeEventListener(
						'compositionstart',
						onCompositionStart
					);
					doc.removeEventListener(
						'compositionend',
						onCompositionEnd
					);
					listenerAttachedRef.current = false;
				}
			}
		};
	}, [] );

	const resizeObserve = useResizeObserver(
		debounce( ( [ entry ] ) => {
			const width = entry.target.offsetWidth;
			if ( width !== previousWidthRef.current ) {
				previousWidthRef.current = width;
				setColumnCountForVertical( ref.current );
			}
		}, 250 )
	);

	useLayoutEffect( () => {
		if ( ref.current ) {
			previousWidthRef.current = ref.current.offsetWidth;
			resizeObserve( ref.current.parentNode );
		}
	}, [ ref.current ] );

	useLayoutEffect( () => {
		if ( previousInnerBlocksLengthRef.current === innerBlocksLength ) {
			return;
		}

		previousInnerBlocksLengthRef.current = innerBlocksLength;

		const element = ref.current;
		if ( ! element ) {
			return;
		}

		if ( listenerAttachedRef.current ) {
			observeDirectChildrenResize( element );
		}
		scheduleColumnLayout( element );
	}, [
		innerBlocksLength,
		observeDirectChildrenResize,
		scheduleColumnLayout,
	] );

	return ref;
}
