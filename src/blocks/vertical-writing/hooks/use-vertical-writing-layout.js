import { useRef, useEffect, useLayoutEffect } from '@wordpress/element';
import { useResizeObserver } from '@wordpress/compose';

import {
	setColumnCountForVertical,
	debounce,
} from '@inc2734/unitone-css/library';

export function useVerticalWritingLayout() {
	const ref = useRef( null );
	const listenerAttachedRef = useRef( false );
	const previousWidthRef = useRef( null );

	const updateColumnLayout = ( element ) => {
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
	};

	const debouncedHandler = debounce( () => {
		const element = ref.current;
		if ( element ) {
			updateColumnLayout( element );
		}
	}, 250 );

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
			doc.addEventListener( 'click', debouncedHandler );
			win.addEventListener( 'keydown', debouncedHandler );
			listenerAttachedRef.current = true;
		} else if ( ! isIntersecting && listenerAttachedRef.current ) {
			doc.removeEventListener( 'click', debouncedHandler );
			win.removeEventListener( 'keydown', debouncedHandler );
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

			if ( listenerAttachedRef.current ) {
				const doc = ref.current?.ownerDocument;
				const win = doc?.defaultView;

				if ( !! doc && !! win ) {
					doc.removeEventListener( 'click', debouncedHandler );
					win.removeEventListener( 'keydown', debouncedHandler );
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

	return ref;
}
