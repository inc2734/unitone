import deepmerge from 'deepmerge';

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
 * Check if the value is a plain mergeable object.
 *
 * Arrays and React elements are excluded.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value can be merged recursively.
 */
function isMergeableObject( value ) {
	return (
		isObject( value ) &&
		! Array.isArray( value ) &&
		( ! value.$$typeof || 'symbol' !== typeof value.$$typeof )
	);
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
	if ( ! isMergeableObject( object ) ) {
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
 * Reset unitone attributes from resetAllFilter without dropping unrelated
 * unitone values missing from the filtered block attributes.
 *
 * @param {Object}   args
 * @param {Object}   args.unitone         Current unitone attribute.
 * @param {Object}   args.blockAttributes Attributes passed from resetAllFilter.
 * @param {Object[]} args.resetFilters    Unitone reset filters to apply.
 * @return {Object|undefined} Reset unitone attribute.
 */
export function resetUnitoneWithBlockAttributes( {
	unitone,
	blockAttributes,
	resetFilters,
} ) {
	return cleanEmptyObject(
		deepmerge.all( [
			{ ...unitone },
			{ ...blockAttributes?.unitone },
			...resetFilters,
		] )
	);
}

/**
 * Merge an object with its default value recursively.
 *
 * If a property in value is null or undefined, the property from defaultValue is used.
 *
 * @param {*} value        The current value.
 * @param {*} defaultValue The default value.
 * @return {*} Merged value.
 */
export function mergeObjectWithDefaultValue( value, defaultValue ) {
	if ( null == value ) {
		return defaultValue;
	}

	if ( null == defaultValue ) {
		return value;
	}

	if ( ! isMergeableObject( value ) || ! isMergeableObject( defaultValue ) ) {
		return value;
	}

	return cleanEmptyObject(
		Object.fromEntries(
			[
				...new Set( [
					...Object.keys( defaultValue ),
					...Object.keys( value ),
				] ),
			].map( ( key ) => [
				key,
				mergeObjectWithDefaultValue(
					value?.[ key ],
					defaultValue?.[ key ]
				),
			] )
		)
	);
}

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
 * Normalize value from ToggleGroupControl.
 *
 * @param {*} value Raw value from control.
 * @return {string|undefined} Normalized value.
 */
export function normalizeForToggleGroupControl( value ) {
	if ( '' === value || null == value ) {
		return undefined;
	}

	return String( value );
}

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
 * Checks is given value is a preset value.
 *
 * @param {string} value Value to check
 * @return {boolean} Return true if value is string in format var:preset|.
 */
export function isPresetValue( value ) {
	if ( ! value?.includes ) {
		return false;
	}

	return value.includes( 'var:preset|' );
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

const hasSameGridInfo = ( prevGridInfo, nextGridInfo ) => {
	if ( ! prevGridInfo || ! nextGridInfo ) {
		return false;
	}

	return (
		prevGridInfo.width === nextGridInfo.width &&
		prevGridInfo.height === nextGridInfo.height &&
		prevGridInfo.gridTemplateColumns === nextGridInfo.gridTemplateColumns &&
		prevGridInfo.gridTemplateRows === nextGridInfo.gridTemplateRows &&
		prevGridInfo.gap === nextGridInfo.gap &&
		prevGridInfo.cellsCount === nextGridInfo.cellsCount &&
		prevGridInfo.border === nextGridInfo.border &&
		prevGridInfo.padding === nextGridInfo.padding
	);
};

/**
 * Display grid visualizer.
 *
 * @return {React.JSX.Element}
 */
export const GridVisualizer = forwardRef( ( { attributes }, ref ) => {
	const [ gridInfo, setGridInfo ] = useState( {} );
	const gridInfoRef = useRef( null );
	const rafIdRef = useRef( null );
	const rafViewRef = useRef( null );

	const getGridInfo = ( gridElement ) => {
		if ( ! gridElement ) {
			return null;
		}

		const ownerDocument = gridElement.ownerDocument;
		const defaultView = ownerDocument.defaultView;
		const cssStyleDeclaration = defaultView.getComputedStyle( gridElement );
		const rect = gridElement.getBoundingClientRect();

		const gridTemplateColumns = cssStyleDeclaration.getPropertyValue(
			'grid-template-columns'
		);
		const gridTemplateRows =
			cssStyleDeclaration.getPropertyValue( 'grid-template-rows' );
		const gap = cssStyleDeclaration.getPropertyValue( 'gap' );
		const border = cssStyleDeclaration.getPropertyValue( 'border' );
		const padding = cssStyleDeclaration.getPropertyValue( 'padding' );

		return {
			width: rect.width,
			height: rect.height,
			gridTemplateColumns,
			gridTemplateRows,
			gap,
			cellsCount:
				( gridTemplateColumns?.split( ' ' )?.length ?? 0 ) *
				( gridTemplateRows?.split( ' ' )?.length ?? 0 ),
			border,
			padding,
		};
	};

	const cancelScheduledUpdate = useCallback( () => {
		if ( rafIdRef.current && rafViewRef.current ) {
			rafViewRef.current.cancelAnimationFrame( rafIdRef.current );
		}

		rafIdRef.current = null;
		rafViewRef.current = null;
	}, [] );

	const updateGridInfo = useCallback( ( gridElement ) => {
		const nextGridInfo = getGridInfo( gridElement );
		if ( ! nextGridInfo ) {
			return;
		}

		if ( hasSameGridInfo( gridInfoRef.current, nextGridInfo ) ) {
			return;
		}

		gridInfoRef.current = nextGridInfo;
		setGridInfo( nextGridInfo );
	}, [] );

	const scheduleGridInfoUpdate = useCallback(
		( gridElement = ref.current ) => {
			if ( ! gridElement ) {
				return;
			}

			const defaultView = gridElement.ownerDocument?.defaultView;
			if ( ! defaultView ) {
				updateGridInfo( gridElement );
				return;
			}

			if ( rafIdRef.current ) {
				return;
			}

			rafViewRef.current = defaultView;
			rafIdRef.current = defaultView.requestAnimationFrame( () => {
				rafIdRef.current = null;
				rafViewRef.current = null;
				updateGridInfo(
					gridElement.isConnected ? gridElement : ref.current
				);
			} );
		},
		[ ref, updateGridInfo ]
	);

	useEffect( () => {
		const gridElement = ref.current;
		if ( ! gridElement ) {
			return;
		}

		const ownerDocument = gridElement.ownerDocument;
		const defaultView = ownerDocument.defaultView;

		const resizeObserver = new defaultView.ResizeObserver( () => {
			scheduleGridInfoUpdate( gridElement );
		} );
		resizeObserver.observe( gridElement );

		const mutationObserver = new defaultView.MutationObserver( () => {
			scheduleGridInfoUpdate( gridElement );
		} );
		mutationObserver.observe( gridElement, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: true,
			attributeFilter: [ 'style', 'class', 'data-unitone-layout' ],
		} );

		scheduleGridInfoUpdate( gridElement );

		return () => {
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			cancelScheduledUpdate();
		};
	}, [ ref, scheduleGridInfoUpdate, cancelScheduledUpdate ] );

	useEffect( () => {
		scheduleGridInfoUpdate();
	}, [ attributes, scheduleGridInfoUpdate ] );

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
				width={ gridInfo?.width }
				height={ gridInfo?.height }
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

const OBSERVED_LAYOUT_ATTRIBUTE_FILTER = [
	'style',
	'class',
	'data-unitone-layout',
];

const IGNORED_LAYOUT_TOKENS = [
	'divider:initialized',
	'-stack',
	'-bol',
	'-linewrap',
	'stairs:initialized',
];

const IGNORED_STYLE_PROPERTIES = [
	'--unitone--stairs-step-overflow-volume',
	'--unitone--max-stairs-step',
	'--unitone--stairs-step',
];

const normalizeObservedLayoutTokens = ( value ) =>
	( value ?? '' )
		.split( /\s+/ )
		.filter(
			( token ) => token && ! IGNORED_LAYOUT_TOKENS.includes( token )
		)
		.join( ' ' );

const normalizeObservedStyleAttribute = ( value ) =>
	( value ?? '' )
		.split( ';' )
		.map( ( declaration ) => declaration.trim() )
		.filter( Boolean )
		.filter( ( declaration ) => {
			const [ property ] = declaration.split( ':' );
			return (
				property &&
				! IGNORED_STYLE_PROPERTIES.includes( property.trim() )
			);
		} )
		.join( ';' );

const shouldRefreshForAttributeMutation = ( entry ) => {
	if ( 'attributes' !== entry.type ) {
		return false;
	}

	if ( 'class' === entry.attributeName ) {
		return (
			( entry.target.getAttribute( 'class' ) ?? '' ) !==
			( entry.oldValue ?? '' )
		);
	}

	if ( 'style' === entry.attributeName ) {
		return (
			normalizeObservedStyleAttribute(
				entry.target.getAttribute( 'style' )
			) !== normalizeObservedStyleAttribute( entry.oldValue )
		);
	}

	if ( 'data-unitone-layout' === entry.attributeName ) {
		return (
			normalizeObservedLayoutTokens(
				entry.target.getAttribute( 'data-unitone-layout' )
			) !== normalizeObservedLayoutTokens( entry.oldValue )
		);
	}

	return false;
};

export function useVisibleLayoutObserver( onLayout ) {
	const ref = useRef( null );
	const onLayoutRef = useRef( onLayout );
	const observedTargetRef = useRef( null );
	const intersectionObserverRef = useRef( null );
	const targetResizeObserverRef = useRef( null );
	const childResizeObserverRef = useRef( null );
	const targetMutationObserverRef = useRef( null );
	const childMutationObserverRef = useRef( null );
	const rafViewRef = useRef( null );
	const rafIdRef = useRef( null );
	const activeObserversRef = useRef( false );

	onLayoutRef.current = onLayout;

	const refreshTarget = useCallback( ( target ) => {
		if ( target ) {
			onLayoutRef.current( target );
		}
	}, [] );

	const cancelScheduledRefresh = useCallback( () => {
		if ( rafIdRef.current && rafViewRef.current ) {
			rafViewRef.current.cancelAnimationFrame( rafIdRef.current );
		}

		rafIdRef.current = null;
		rafViewRef.current = null;
	}, [] );

	const scheduleRefresh = useCallback(
		( target = observedTargetRef.current ) => {
			if ( ! target ) {
				return;
			}

			const defaultView = target.ownerDocument?.defaultView;
			if ( ! defaultView ) {
				refreshTarget( target );
				return;
			}

			if ( rafIdRef.current ) {
				return;
			}

			rafViewRef.current = defaultView;
			rafIdRef.current = defaultView.requestAnimationFrame( () => {
				rafIdRef.current = null;
				rafViewRef.current = null;

				const currentTarget = target.isConnected
					? target
					: observedTargetRef.current;
				if ( currentTarget?.isConnected ) {
					refreshTarget( currentTarget );
				}
			} );
		},
		[ refreshTarget ]
	);

	const disconnectChildObservers = useCallback( () => {
		if ( childResizeObserverRef.current ) {
			childResizeObserverRef.current.disconnect();
			childResizeObserverRef.current = null;
		}

		if ( childMutationObserverRef.current ) {
			childMutationObserverRef.current.disconnect();
			childMutationObserverRef.current = null;
		}
	}, [] );

	const observeChildren = useCallback(
		( target ) => {
			disconnectChildObservers();

			const children = [ ...( target?.children ?? [] ) ];
			if ( ! children.length ) {
				return;
			}

			const defaultView = target.ownerDocument?.defaultView;
			if (
				! defaultView?.ResizeObserver ||
				! defaultView?.MutationObserver
			) {
				return;
			}

			const childResizeObserver = new defaultView.ResizeObserver( () => {
				scheduleRefresh( target );
			} );
			const childMutationObserver = new defaultView.MutationObserver(
				( entries ) => {
					if (
						entries.some( ( entry ) =>
							shouldRefreshForAttributeMutation( entry )
						)
					) {
						scheduleRefresh( target );
					}
				}
			);

			children.forEach( ( child ) => {
				childResizeObserver.observe( child );
				childMutationObserver.observe( child, {
					attributes: true,
					attributeFilter: OBSERVED_LAYOUT_ATTRIBUTE_FILTER,
					attributeOldValue: true,
				} );
			} );

			childResizeObserverRef.current = childResizeObserver;
			childMutationObserverRef.current = childMutationObserver;
		},
		[ disconnectChildObservers, scheduleRefresh ]
	);

	const disconnectActiveObservers = useCallback( () => {
		activeObserversRef.current = false;

		if ( targetResizeObserverRef.current ) {
			if ( observedTargetRef.current ) {
				targetResizeObserverRef.current.unobserve(
					observedTargetRef.current
				);
			}
			targetResizeObserverRef.current.disconnect();
			targetResizeObserverRef.current = null;
		}

		if ( targetMutationObserverRef.current ) {
			targetMutationObserverRef.current.disconnect();
			targetMutationObserverRef.current = null;
		}

		disconnectChildObservers();
		cancelScheduledRefresh();
	}, [ cancelScheduledRefresh, disconnectChildObservers ] );

	const disconnectObservers = useCallback( () => {
		if ( intersectionObserverRef.current ) {
			intersectionObserverRef.current.disconnect();
			intersectionObserverRef.current = null;
		}

		disconnectActiveObservers();
		observedTargetRef.current = null;
	}, [ disconnectActiveObservers ] );

	const activateObservers = useCallback(
		( target ) => {
			if ( activeObserversRef.current ) {
				return;
			}

			const defaultView = target.ownerDocument?.defaultView;
			if (
				! defaultView?.ResizeObserver ||
				! defaultView?.MutationObserver
			) {
				refreshTarget( target );
				return;
			}

			activeObserversRef.current = true;

			targetResizeObserverRef.current = new defaultView.ResizeObserver(
				() => {
					scheduleRefresh( target );
				}
			);
			targetResizeObserverRef.current.observe( target );

			targetMutationObserverRef.current =
				new defaultView.MutationObserver( ( entries ) => {
					let shouldRefresh = false;
					let shouldSyncChildren = false;

					entries.forEach( ( entry ) => {
						if ( 'childList' === entry.type ) {
							shouldRefresh = true;
							shouldSyncChildren = true;
							return;
						}

						if ( shouldRefreshForAttributeMutation( entry ) ) {
							shouldRefresh = true;
						}
					} );

					if ( shouldSyncChildren ) {
						observeChildren( target );
					}

					if ( shouldRefresh ) {
						scheduleRefresh( target );
					}
				} );
			targetMutationObserverRef.current.observe( target, {
				childList: true,
				attributes: true,
				attributeFilter: OBSERVED_LAYOUT_ATTRIBUTE_FILTER,
				attributeOldValue: true,
			} );

			observeChildren( target );
		},
		[ observeChildren, refreshTarget, scheduleRefresh ]
	);

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
		if ( ! defaultView ) {
			refreshTarget( node );
			return;
		}

		if ( ! defaultView.IntersectionObserver ) {
			activateObservers( node );
			scheduleRefresh( node );
			return;
		}

		const intersectionObserver = new defaultView.IntersectionObserver(
			( [ entry ] ) => {
				if ( entry?.rootBounds === null ) {
					activateObservers( entry.target );
					scheduleRefresh( entry.target );
					return;
				}

				scheduleRefresh( entry.target );

				if ( entry.isIntersecting ) {
					activateObservers( entry.target );
				} else {
					disconnectActiveObservers();
				}
			},
			{
				rootMargin: '200px 0px',
			}
		);

		intersectionObserverRef.current = intersectionObserver;
		intersectionObserver.observe( node );
	} );

	useEffect( () => {
		return () => {
			disconnectObservers();
		};
	}, [ disconnectObservers ] );

	return ref;
}
