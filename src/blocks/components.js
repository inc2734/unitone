import clsx from 'clsx';

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from '@wordpress/element';

const parsePlacement = ( placement = 'bottom' ) => {
	const [ side = 'bottom', align = 'center' ] = placement.split( '-' );
	return {
		side,
		align,
	};
};

const roundPosition = ( value ) => Math.round( value * 100 ) / 100;

const getPopoverPosition = ( {
	anchorRect,
	popoverRect,
	placement = 'bottom',
	offset = 0,
} ) => {
	const { side, align } = parsePlacement( placement );
	const actualOffset = Number( offset ) || 0;

	let left = anchorRect.left;
	let top = anchorRect.top;

	if ( 'overlay' === side ) {
		return {
			left: roundPosition( anchorRect.left ),
			top: roundPosition( anchorRect.top ),
		};
	}

	if ( 'top' === side || 'bottom' === side ) {
		if ( 'start' === align ) {
			left = anchorRect.left;
		} else if ( 'end' === align ) {
			left = anchorRect.right - popoverRect.width;
		} else {
			left =
				anchorRect.left + ( anchorRect.width - popoverRect.width ) / 2;
		}

		top =
			'top' === side
				? anchorRect.top - popoverRect.height - actualOffset
				: anchorRect.bottom + actualOffset;
	} else {
		if ( 'start' === align ) {
			top = anchorRect.top;
		} else if ( 'end' === align ) {
			top = anchorRect.bottom - popoverRect.height;
		} else {
			top =
				anchorRect.top + ( anchorRect.height - popoverRect.height ) / 2;
		}

		left =
			'left' === side
				? anchorRect.left - popoverRect.width - actualOffset
				: anchorRect.right + actualOffset;
	}

	return {
		left: roundPosition( left ),
		top: roundPosition( top ),
	};
};

export const EditorPopover = ( {
	anchor,
	children,
	className,
	offset = 0,
	placement = 'bottom',
	style,
} ) => {
	const ref = useRef( null );
	const rafIdRef = useRef( null );
	const rafViewRef = useRef( null );
	const lastPositionRef = useRef( null );
	const [ position, setPosition ] = useState( null );

	const cancelScheduledUpdate = useCallback( () => {
		if ( rafIdRef.current && rafViewRef.current ) {
			rafViewRef.current.cancelAnimationFrame( rafIdRef.current );
			rafIdRef.current = null;
			rafViewRef.current = null;
		}
	}, [] );

	const updatePosition = useCallback( () => {
		const element = ref.current;
		if ( ! anchor || ! element || ! anchor.isConnected ) {
			return;
		}

		const anchorRect = anchor.getBoundingClientRect();
		const popoverRect = element.getBoundingClientRect();

		const nextPosition = getPopoverPosition( {
			anchorRect,
			popoverRect,
			placement,
			offset,
		} );

		if (
			lastPositionRef.current?.left === nextPosition.left &&
			lastPositionRef.current?.top === nextPosition.top
		) {
			return;
		}

		lastPositionRef.current = nextPosition;
		setPosition( nextPosition );
	}, [ anchor, offset, placement ] );

	const schedulePositionUpdate = useCallback( () => {
		const defaultView = anchor?.ownerDocument?.defaultView;
		if ( rafIdRef.current || ! defaultView ) {
			return;
		}

		rafViewRef.current = defaultView;
		rafIdRef.current = defaultView.requestAnimationFrame( () => {
			rafIdRef.current = null;
			rafViewRef.current = null;
			updatePosition();
		} );
	}, [ anchor, updatePosition ] );

	useLayoutEffect( () => {
		schedulePositionUpdate();
	}, [ children, placement, offset, schedulePositionUpdate ] );

	useEffect( () => {
		if ( ! anchor || ! anchor.isConnected ) {
			setPosition( null );
			return;
		}

		const ownerDocument = anchor.ownerDocument;
		const defaultView = ownerDocument?.defaultView;
		const element = ref.current;
		if ( ! defaultView || ! element ) {
			return;
		}

		const resizeObserver = new defaultView.ResizeObserver( () => {
			schedulePositionUpdate();
		} );
		resizeObserver.observe( anchor );
		resizeObserver.observe( element );

		const mutationObserver = new defaultView.MutationObserver( () => {
			schedulePositionUpdate();
		} );
		mutationObserver.observe( anchor, {
			attributes: true,
			childList: true,
			subtree: true,
			characterData: true,
		} );

		ownerDocument.addEventListener(
			'scroll',
			schedulePositionUpdate,
			true
		);
		defaultView.addEventListener( 'resize', schedulePositionUpdate );

		schedulePositionUpdate();

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			ownerDocument.removeEventListener(
				'scroll',
				schedulePositionUpdate,
				true
			);
			defaultView.removeEventListener( 'resize', schedulePositionUpdate );
			cancelScheduledUpdate();
		};
	}, [ anchor, cancelScheduledUpdate, schedulePositionUpdate ] );

	if ( ! anchor ) {
		return null;
	}

	return (
		<div
			ref={ ref }
			className={ clsx( 'unitone-editor-popover', className ) }
			style={ {
				position: 'fixed',
				inset: 'auto auto auto auto',
				left: position?.left ?? 0,
				top: position?.top ?? 0,
				zIndex: 10000,
				visibility: position ? 'visible' : 'hidden',
				...style,
			} }
		>
			<div
				style={ {
					position: 'absolute',
					inset: '-1rem -1rem 0 -1rem',
					zIndex: -1,
				} }
			></div>
			{ children }
		</div>
	);
};
