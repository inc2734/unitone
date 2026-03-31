import { Popover } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as editPostStore } from '@wordpress/edit-post';

import {
	useRef,
	useEffect,
	useState,
	useCallback,
	forwardRef,
	memo,
} from '@wordpress/element';

import { debounce } from '@inc2734/unitone-css/library';

/**
 * Check if the value is object.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is object.
 */
export function isObject( value ) {
	return null != value && 'object' === typeof value;
}

/**
 * Removed falsy values from nested object.
 *
 * @see https://github.com/WordPress/gutenberg/blob/857356c1602a42f342a61976ba67eb41284050ca/packages/block-editor/src/hooks/utils.js
 *
 * @param {*} object
 * @return {*} Object cleaned from falsy values
 */
export const cleanEmptyObject = ( object ) => {
	if (
		! isObject( object ) ||
		Array.isArray( object ) ||
		( object.$$typeof && 'symbol' === typeof object.$$typeof )
	) {
		return object;
	}

	const cleanedNestedObjects = Object.entries( object )
		.map( ( [ key, value ] ) => [ key, cleanEmptyObject( value ) ] )
		.filter( ( [ , value ] ) => value !== undefined && value !== null );
	return ! cleanedNestedObjects.length
		? undefined
		: Object.fromEntries( cleanedNestedObjects );
};

/**
 * Check if the value is number or string type number.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is number.
 */
export function isNumber( value ) {
	if ( typeof value === 'number' ) {
		return ! isNaN( value );
	}
	if ( typeof value === 'string' ) {
		const trimmed = value.trim();
		return trimmed !== '' && ! isNaN( trimmed );
	}
	return false;
}

/**
 * Check if the value is string.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is string.
 */
export function isString( value ) {
	return typeof value === 'string' || value instanceof String;
}

/**
 * Normalize value from text-like controls.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export function normalizeForStringControl( value ) {
	if ( null == value ) {
		return '';
	}

	return String( value );
}

/**
 * Alias of normalizeForStringControl for TextControl.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export const normalizeForTextControl = normalizeForStringControl;

/**
 * Alias of normalizeForStringControl for TextareaControl.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export const normalizeForTextareaControl = normalizeForStringControl;

/**
 * Alias of normalizeForStringControl for SelectControl.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export const normalizeForSelectControl = normalizeForStringControl;

/**
 * Alias of normalizeForStringControl for ToggleGroupControl.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export const normalizeForToggleGroupControl = normalizeForStringControl;

/**
 * Alias of normalizeForStringControl for UnitControl.
 *
 * @param {*} value Raw value from control.
 * @return {string} Normalized value.
 */
export const normalizeForUnitControl = normalizeForStringControl;

/**
 * Normalize value from RangeControl.
 *
 * @param {*} value Raw value from control.
 * @return {number|string} Normalized value.
 */
export function normalizeForRangeControl( value ) {
	if ( '' === value || null == value ) {
		return undefined;
	}

	const normalizedValue = Number( value );
	return Number.isNaN( normalizedValue ) ? undefined : normalizedValue;
}

/**
 * Normalize value from ToggleControl.
 *
 * @param {*} value Raw value from control.
 * @return {boolean} Normalized value.
 */
export function normalizeForToggleControl( value ) {
	return Boolean( value );
}

/**
 * Converts a global style into a custom value.
 *
 * @param {string} value Value to convert.
 * @return {string | undefined} CSS var string for given global style value.
 */
export function getGlobalStyleCssVar( value ) {
	if ( null == value ) {
		return undefined;
	}

	const slug = value.match( /var:style\|global\|(.+)/ );
	if ( ! slug ) {
		return value;
	}

	return `var(--wp--style--global--${ slug[ 1 ] })`;
}

/**
 * Converts a custom value to global style value if one can be found.
 *
 * Returns value as-is if no match is found.
 *
 * @param {string} value Value to convert
 * @return {string} The global style value if it can be found.
 */
export function getGlobalStyleValueFromCustomValue( value ) {
	if ( null == value ) {
		return undefined;
	}

	const slug = value.match( /^var\(--wp--style--global--(.+)\)$/ );
	if ( ! slug ) {
		return value;
	}

	return `var:style|global|${ slug[ 1 ] }`;
}

/**
 * Checks is given value is a global style.
 *
 * @param {string} value Value to check
 * @return {boolean} Return true if value is string in format var:style|global|.
 */
export function isValueGlobalStyle( value ) {
	if ( ! value?.includes ) {
		return false;
	}

	return value.includes( 'var:style|global|' );
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 *
 * @param {Function} fn    The function to throttle.
 * @param {number}   delay The number of milliseconds to throttle invocations to.
 * @return {Function} Returns the new throttled function.
 */
export function throttle( fn, delay ) {
	let runTime = Date.now() - delay;

	return ( ...args ) => {
		if ( runTime + delay < Date.now() ) {
			runTime = Date.now();
			fn.apply( this, args );
		}
	};
}

/**
 * Return the device type.
 *
 * @return {string} The divice type.
 */
export function useDeviceType() {
	return useSelect( ( select ) => {
		const { getDeviceType } = select( editorStore );
		if ( null != getDeviceType ) {
			return getDeviceType()?.toLowerCase();
		}

		const { __experimentalGetPreviewDeviceType } = select( editPostStore );
		return __experimentalGetPreviewDeviceType()?.toLowerCase();
	}, [] );
}

const GridCells = memo(
	( {
		width,
		height,
		gridTemplateColumns,
		gridTemplateRows,
		gap,
		cellsCount,
		border,
		padding,
	} ) => {
		return (
			<div
				className="unitone-grid-visualizer__cells"
				style={ {
					width,
					height,
					gridTemplateColumns,
					gridTemplateRows,
					gap,
					border,
					padding,
				} }
			>
				{ Array( cellsCount )
					.fill( 0 )
					.map( ( v, i ) => (
						<div key={ i } className="unitone-grid-cell" />
					) ) }
			</div>
		);
	}
);

/**
 * Display grid visualizer.
 *
 * @return {React.JSX.Element}
 */
export const GridVisualizer = forwardRef( ( { attributes }, ref ) => {
	const [ gridInfo, setGridInfo ] = useState( {} );

	const getGridInfo = ( gridElement ) => {
		const ownerDocument = gridElement.ownerDocument;
		const defaultView = ownerDocument.defaultView;
		const cssStyleDeclaration = defaultView.getComputedStyle( gridElement );

		const gridTemplateColumns = cssStyleDeclaration.getPropertyValue(
			'grid-template-columns'
		);
		const gridTemplateRows =
			cssStyleDeclaration.getPropertyValue( 'grid-template-rows' );
		const gap = cssStyleDeclaration.getPropertyValue( 'gap' );
		const border = cssStyleDeclaration.getPropertyValue( 'border' );
		const padding = cssStyleDeclaration.getPropertyValue( 'padding' );

		return {
			gridTemplateColumns,
			gridTemplateRows,
			gap,
			rect: gridElement.getBoundingClientRect(),
			cellsCount:
				( gridTemplateColumns?.split( ' ' )?.length ?? 0 ) *
				( gridTemplateRows?.split( ' ' )?.length ?? 0 ),
			border,
			padding,
		};
	};

	useEffect( () => {
		const gridElement = ref.current;
		const ownerDocument = gridElement.ownerDocument;
		const defaultView = ownerDocument.defaultView;

		const observers = [];
		for ( const element of [ gridElement, ...gridElement.children ] ) {
			const observer = new defaultView.ResizeObserver( () => {
				setGridInfo( getGridInfo( gridElement ) );
			} );
			observer.observe( element );
			observers.push( observer );
		}

		return () => {
			for ( const observer of observers ) {
				observer.disconnect();
			}
		};
	}, [ ref.current ] );

	useEffect( () => {
		const gridElement = ref.current;
		setGridInfo( getGridInfo( gridElement ) );
	}, [ attributes?.unitone?.gap ] );

	if ( ! gridInfo?.cellsCount ) {
		return null;
	}

	return (
		<Popover
			anchor={ ref.current }
			variant="unstyled"
			placement="overlay"
			className="unitone-grid-visualizer"
			__unstableSlotName="__unstable-block-tools-after"
			animate={ false }
			focusOnMount={ false }
			resize={ false }
			flip={ false }
		>
			<GridCells
				width={ gridInfo?.rect?.width }
				height={ gridInfo?.rect?.height }
				gridTemplateColumns={ gridInfo?.gridTemplateColumns }
				gridTemplateRows={ gridInfo?.gridTemplateRows }
				gap={ gridInfo?.gap }
				cellsCount={ gridInfo?.cellsCount }
				border={ gridInfo?.border }
				padding={ gridInfo?.padding }
			/>
		</Popover>
	);
} );

/**
 * @see https://github.com/WordPress/gutenberg/blob/9122cc34fb1d972cdfc59614bf6f140a9b6f7d94/packages/block-library/src/utils/hooks.js
 */
export function useToolsPanelDropdownMenuProps() {
	const isMobile = useViewportMatch( 'medium', '<' );
	return ! isMobile
		? {
				popoverProps: {
					placement: 'left-start',
					// For non-mobile, inner sidebar width (248px) - button width (24px) - border (1px) + padding (16px) + spacing (20px)
					offset: 259,
				},
		  }
		: {};
}

export function useVisibleResizeObserver( onResize, deps = [] ) {
	const ref = useRef( null );
	const onResizeRef = useRef( onResize );
	const observedTargetRef = useRef( null );
	const intersectionObserverRef = useRef( null );
	const resizeObserverRef = useRef( null );

	onResizeRef.current = onResize;

	const disconnectObservers = useCallback( () => {
		const target = observedTargetRef.current;

		if ( intersectionObserverRef.current ) {
			intersectionObserverRef.current.disconnect();
			intersectionObserverRef.current = null;
		}

		if ( resizeObserverRef.current ) {
			if ( target ) {
				resizeObserverRef.current.unobserve( target );
			}
			resizeObserverRef.current.disconnect();
			resizeObserverRef.current = null;
		}

		observedTargetRef.current = null;
	}, [] );

	const refreshTarget = useCallback( ( target ) => {
		if ( target ) {
			onResizeRef.current( target );
		}
	}, [] );

	useEffect( () => {
		const node = ref.current;

		if ( observedTargetRef.current === node ) {
			return;
		}

		disconnectObservers();

		if ( ! node ) {
			return;
		}

		observedTargetRef.current = node;

		const defaultView = node.ownerDocument?.defaultView;
		if (
			! defaultView?.IntersectionObserver ||
			! defaultView?.ResizeObserver
		) {
			refreshTarget( node );
			return;
		}

		const resizeObserver = new defaultView.ResizeObserver(
			debounce( ( [ entry ] ) => {
				refreshTarget( entry?.target ?? observedTargetRef.current );
			}, 250 )
		);

		const intersectionObserver = new defaultView.IntersectionObserver(
			( [ entry ] ) => {
				if ( entry?.rootBounds === null ) {
					return;
				}

				refreshTarget( entry.target );

				if ( entry.isIntersecting ) {
					resizeObserver.observe( entry.target );
				} else {
					resizeObserver.unobserve( entry.target );
				}
			},
			{
				rootMargin: '200px 0px',
			}
		);

		resizeObserverRef.current = resizeObserver;
		intersectionObserverRef.current = intersectionObserver;
		intersectionObserver.observe( node );

		return () => {
			if ( observedTargetRef.current === node ) {
				disconnectObservers();
			}
		};
	}, [ disconnectObservers, refreshTarget, ref.current ] );

	useEffect( () => {
		refreshTarget( ref.current );
	}, [ refreshTarget, ...deps ] );

	useEffect( () => {
		return () => {
			disconnectObservers();
		};
	}, [ disconnectObservers ] );

	return ref;
}
