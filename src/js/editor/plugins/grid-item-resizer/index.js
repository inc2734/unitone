import {
	createPortal,
	useEffect,
	useMemo,
	useState,
	useCallback,
} from '@wordpress/element';

import { store as blockEditorStore } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useSelect, useDispatch } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

import { cleanEmptyObject } from '../../hooks/utils';

const GRID_BLOCK_TYPE_NAME = 'unitone/grid';
const LAYERS_BLOCK_TYPE_NAME = 'unitone/layers';

const getComputedCSS = ( element, property ) =>
	element.ownerDocument.defaultView
		.getComputedStyle( element )
		.getPropertyValue( property );

const getTracks = ( template, gap ) => {
	const tracks = [];

	for ( const size of template.split( ' ' ) ) {
		const parsedSize = parseFloat( size );
		if ( Number.isNaN( parsedSize ) ) {
			continue;
		}

		const previousTrack = tracks[ tracks.length - 1 ];
		const start = previousTrack ? previousTrack.end + gap : 0;
		const end = start + parsedSize;
		tracks.push( { start, end } );
	}

	return tracks;
};

const getTrackLines = ( tracks, offset ) => {
	if ( ! tracks.length ) {
		return {
			startLines: [],
			endLines: [],
		};
	}

	return {
		startLines: [
			...tracks.map( ( track ) => offset + track.start ),
			offset + tracks[ tracks.length - 1 ].end,
		],
		endLines: [
			offset + tracks[ 0 ].start,
			...tracks.map( ( track ) => offset + track.end ),
		],
	};
};

const getClosestLine = ( lines, position ) =>
	lines.reduce(
		( closestIndex, line, index ) =>
			Math.abs( line - position ) <
			Math.abs( lines[ closestIndex ] - position )
				? index
				: closestIndex,
		0
	) + 1;

const clamp = ( value, min, max ) => Math.min( Math.max( value, min ), max );

const getBoxLength = ( element, rect, axis ) => {
	const borderStart = parseFloat(
		getComputedCSS(
			element,
			'column' === axis ? 'border-left-width' : 'border-top-width'
		)
	);
	const borderEnd = parseFloat(
		getComputedCSS(
			element,
			'column' === axis ? 'border-right-width' : 'border-bottom-width'
		)
	);
	const paddingStart = parseFloat(
		getComputedCSS(
			element,
			'column' === axis ? 'padding-left' : 'padding-top'
		)
	);
	const paddingEnd = parseFloat(
		getComputedCSS(
			element,
			'column' === axis ? 'padding-right' : 'padding-bottom'
		)
	);

	return (
		( 'column' === axis ? rect.width : rect.height ) -
		( Number.isNaN( borderStart ) ? 0 : borderStart ) -
		( Number.isNaN( borderEnd ) ? 0 : borderEnd ) -
		( Number.isNaN( paddingStart ) ? 0 : paddingStart ) -
		( Number.isNaN( paddingEnd ) ? 0 : paddingEnd )
	);
};

const resolveCSSLength = ( value, basis ) => {
	if ( ! value || 'normal' === value ) {
		return 0;
	}

	const trimmedValue = value.trim();

	if ( trimmedValue.startsWith( 'min(' ) && trimmedValue.endsWith( ')' ) ) {
		const values = trimmedValue
			.slice( 4, -1 )
			.split( ',' )
			.map( ( item ) => resolveCSSLength( item, basis ) );

		return Math.min( ...values );
	}

	if ( trimmedValue.endsWith( '%' ) ) {
		const percentage = parseFloat( trimmedValue );

		return Number.isNaN( percentage ) ? 0 : ( basis * percentage ) / 100;
	}

	const parsedValue = parseFloat( trimmedValue );

	return Number.isNaN( parsedValue ) ? 0 : parsedValue;
};

const getGridMetrics = ( gridElement ) => {
	if ( ! gridElement ) {
		return null;
	}

	const rect = gridElement.getBoundingClientRect();
	const columnGap = resolveCSSLength(
		getComputedCSS( gridElement, 'column-gap' ),
		getBoxLength( gridElement, rect, 'column' )
	);
	const rowGap = resolveCSSLength(
		getComputedCSS( gridElement, 'row-gap' ),
		getBoxLength( gridElement, rect, 'row' )
	);
	const paddingTop = parseFloat(
		getComputedCSS( gridElement, 'padding-top' )
	);
	const paddingLeft = parseFloat(
		getComputedCSS( gridElement, 'padding-left' )
	);
	const borderTop = parseFloat(
		getComputedCSS( gridElement, 'border-top-width' )
	);
	const borderLeft = parseFloat(
		getComputedCSS( gridElement, 'border-left-width' )
	);

	const columnTracks = getTracks(
		getComputedCSS( gridElement, 'grid-template-columns' ),
		columnGap
	);
	const rowTracks = getTracks(
		getComputedCSS( gridElement, 'grid-template-rows' ),
		rowGap
	);

	const columnLines = getTrackLines(
		columnTracks,
		rect.left +
			( Number.isNaN( borderLeft ) ? 0 : borderLeft ) +
			( Number.isNaN( paddingLeft ) ? 0 : paddingLeft )
	);
	const rowLines = getTrackLines(
		rowTracks,
		rect.top +
			( Number.isNaN( borderTop ) ? 0 : borderTop ) +
			( Number.isNaN( paddingTop ) ? 0 : paddingTop )
	);

	return {
		columnStartLines: columnLines.startLines,
		columnEndLines: columnLines.endLines,
		rowStartLines: rowLines.startLines,
		rowEndLines: rowLines.endLines,
	};
};

const getPreviewRect = ( {
	state,
	metrics,
	fallbackRect,
	useColumns,
	useRows,
} ) => {
	const columnStartLine = metrics.columnStartLines[ state.columnStart - 1 ];
	const columnEndLine = metrics.columnEndLines[ state.columnEnd - 1 ];
	const rowStartLine = metrics.rowStartLines[ state.rowStart - 1 ];
	const rowEndLine = metrics.rowEndLines[ state.rowEnd - 1 ];

	return {
		left:
			useColumns &&
			undefined !== columnStartLine &&
			undefined !== columnEndLine
				? columnStartLine
				: fallbackRect.left,
		top:
			useRows && undefined !== rowStartLine && undefined !== rowEndLine
				? rowStartLine
				: fallbackRect.top,
		width:
			useColumns &&
			undefined !== columnStartLine &&
			undefined !== columnEndLine
				? columnEndLine - columnStartLine
				: fallbackRect.width,
		height:
			useRows && undefined !== rowStartLine && undefined !== rowEndLine
				? rowEndLine - rowStartLine
				: fallbackRect.height,
	};
};

const getItemGridRect = ( itemElement, metrics ) => {
	const rect = itemElement.getBoundingClientRect();
	const columnStart = metrics.columnStartLines.length
		? getClosestLine( metrics.columnStartLines, rect.left )
		: 1;
	const columnEnd = metrics.columnEndLines.length
		? getClosestLine( metrics.columnEndLines, rect.right )
		: columnStart + 1;
	const rowStart = metrics.rowStartLines.length
		? getClosestLine( metrics.rowStartLines, rect.top )
		: 1;
	const rowEnd = metrics.rowEndLines.length
		? getClosestLine( metrics.rowEndLines, rect.bottom )
		: rowStart + 1;

	return {
		columnStart,
		columnEnd,
		rowStart,
		rowEnd,
	};
};

const normalizeLine = ( value, maxLine ) => {
	const line = parseInt( value, 10 );

	if ( Number.isNaN( line ) || 0 === line ) {
		return undefined;
	}

	return 0 > line ? maxLine + line + 1 : line;
};

const parsePlacement = ( value, maxLine ) => {
	if ( 'string' !== typeof value ) {
		return null;
	}

	const parts = value
		.split( '/' )
		.map( ( part ) => part.trim() )
		.filter( Boolean );

	if ( ! parts.length ) {
		return null;
	}

	const startPart = parts[ 0 ];
	const endPart = parts[ 1 ];
	const start = normalizeLine( startPart, maxLine );

	if ( ! start || ! endPart ) {
		return null;
	}

	const spanMatch = endPart.match( /^span\s+(-?\d+)$/ );
	if ( spanMatch ) {
		const span = parseInt( spanMatch[ 1 ], 10 );

		return 0 < span ? { start, end: start + span } : null;
	}

	const end = normalizeLine( endPart, maxLine );
	if ( ! end || end <= start ) {
		return null;
	}

	return { start, end };
};

const getCurrentUnitoneValue = ( { attributes, property, settings } ) => {
	const value = attributes?.unitone?.[ property ];

	if ( ! settings.isResponsive || 'object' !== typeof value ) {
		return value;
	}

	if ( 'sm' === settings.activeViewport ) {
		return value.sm ?? value.md ?? value.lg;
	}

	if ( 'md' === settings.activeViewport ) {
		return value.md ?? value.lg;
	}

	return value.lg;
};

const applyInitialPlacement = ( { state, attributes, settings, metrics } ) => {
	const columnPlacement = parsePlacement(
		getCurrentUnitoneValue( {
			attributes,
			property: 'gridColumn',
			settings,
		} ),
		metrics.columnStartLines.length
	);
	const rowPlacement = parsePlacement(
		getCurrentUnitoneValue( {
			attributes,
			property: 'gridRow',
			settings,
		} ),
		metrics.rowStartLines.length
	);

	if ( columnPlacement ) {
		state.columnStart = columnPlacement.start;
		state.columnEnd = columnPlacement.end;
	}

	if ( rowPlacement ) {
		state.rowStart = rowPlacement.start;
		state.rowEnd = rowPlacement.end;
	}
};

const getBreakpointPixels = ( value, win ) => {
	if ( ! value ) {
		return undefined;
	}

	const parsed = parseFloat( value );
	if ( Number.isNaN( parsed ) ) {
		return undefined;
	}

	if ( value.endsWith( 'em' ) || value.endsWith( 'rem' ) ) {
		const fontSize = parseFloat(
			win.getComputedStyle( win.document.documentElement ).fontSize
		);
		return parsed * ( Number.isNaN( fontSize ) ? 16 : fontSize );
	}

	return parsed;
};

const isMediaBreakpointActive = ( breakpoint, win ) => {
	if ( ! breakpoint ) {
		return false;
	}

	if ( win.matchMedia ) {
		return win.matchMedia( `not all and (min-width: ${ breakpoint })` )
			.matches;
	}

	const breakpointPixels = getBreakpointPixels( breakpoint, win );

	return undefined !== breakpointPixels && win.innerWidth < breakpointPixels;
};

const hasGridColumnsOverride = ( attributes, size ) => {
	const option = attributes?.[ `${ size }ColumnsOption` ];

	return (
		( 'columns' === option && !! attributes?.[ `${ size }Columns` ] ) ||
		( 'min' === option && !! attributes?.[ `${ size }ColumnMinWidth` ] ) ||
		( 'free' === option &&
			!! attributes?.[ `${ size }GridTemplateColumns` ] )
	);
};

const hasGridRowsOverride = ( attributes, size ) => {
	const option = attributes?.[ `${ size }RowsOption` ];

	return (
		( 'rows' === option && !! attributes?.[ `${ size }Rows` ] ) ||
		( 'free' === option && !! attributes?.[ `${ size }GridTemplateRows` ] )
	);
};

const getActiveViewport = ( attributes, win ) => {
	const smActive = isMediaBreakpointActive( attributes?.smBreakpoint, win );
	if ( smActive ) {
		return 'sm';
	}

	const mdActive = isMediaBreakpointActive( attributes?.mdBreakpoint, win );
	return mdActive ? 'md' : 'lg';
};

const getEffectiveGridSize = ( attributes, axis, activeSize ) => {
	const hasOverride =
		'column' === axis ? hasGridColumnsOverride : hasGridRowsOverride;

	if ( 'sm' === activeSize && hasOverride( attributes, 'sm' ) ) {
		return 'sm';
	}

	if (
		( 'sm' === activeSize || 'md' === activeSize ) &&
		hasOverride( attributes, 'md' )
	) {
		return 'md';
	}

	return 'lg';
};

const getGridOption = ( attributes, axis, size ) => {
	if ( 'lg' === size ) {
		return 'column' === axis
			? attributes?.columnsOption
			: attributes?.rowsOption;
	}

	return attributes?.[
		`${ size }${ 'column' === axis ? 'Columns' : 'Rows' }Option`
	];
};

const getResizeSettings = ( parentBlock, blockElement ) => {
	if ( ! parentBlock || ! blockElement ) {
		return null;
	}

	if ( LAYERS_BLOCK_TYPE_NAME === parentBlock.name ) {
		return {
			canResizeColumns: true,
			canResizeRows: true,
			activeViewport: null,
			isResponsive: false,
		};
	}

	if ( GRID_BLOCK_TYPE_NAME === parentBlock.name ) {
		const win = blockElement.ownerDocument.defaultView;
		const activeViewport = getActiveViewport( parentBlock.attributes, win );
		const effectiveColumnSize = getEffectiveGridSize(
			parentBlock.attributes,
			'column',
			activeViewport
		);
		const effectiveRowSize = getEffectiveGridSize(
			parentBlock.attributes,
			'row',
			activeViewport
		);

		return {
			canResizeColumns:
				'columns' ===
				getGridOption(
					parentBlock.attributes,
					'column',
					effectiveColumnSize
				),
			canResizeRows:
				'rows' ===
				getGridOption(
					parentBlock.attributes,
					'row',
					effectiveRowSize
				),
			activeViewport,
			isResponsive: true,
		};
	}

	return null;
};

const isStretchAlignment = ( value ) =>
	! value || [ 'auto', 'normal', 'stretch' ].includes( value );

const getConstrainedResizeSettings = (
	settings,
	blockElement,
	gridElement
) => {
	if ( ! settings || ! blockElement || ! gridElement ) {
		return settings;
	}

	const blockStyle =
		blockElement.ownerDocument.defaultView.getComputedStyle( blockElement );
	const gridStyle =
		gridElement.ownerDocument.defaultView.getComputedStyle( gridElement );
	const isConstrained =
		'none' !== blockStyle.maxWidth ||
		'none' !== blockStyle.maxHeight ||
		! isStretchAlignment( blockStyle.justifySelf ) ||
		! isStretchAlignment( blockStyle.alignSelf ) ||
		! isStretchAlignment( gridStyle.justifyItems ) ||
		! isStretchAlignment( gridStyle.alignItems );

	return {
		...settings,
		canResizeColumns: ! isConstrained && settings.canResizeColumns,
		canResizeRows: ! isConstrained && settings.canResizeRows,
	};
};

const getDocumentCandidates = ( baseDocument = document ) => {
	const documents = [ baseDocument ];

	for ( const iframe of baseDocument.querySelectorAll( 'iframe' ) ) {
		if ( iframe.contentDocument ) {
			documents.push( iframe.contentDocument );
		}
	}

	return documents;
};

const getBlockElement = ( clientId, baseDocument = document ) => {
	if ( ! clientId ) {
		return null;
	}

	const escapedClientId = clientId.replace( /"/g, '\\"' );

	for ( const currentDocument of getDocumentCandidates( baseDocument ) ) {
		const element = currentDocument.querySelector(
			`[data-block="${ escapedClientId }"]`
		);

		if ( element ) {
			return element;
		}
	}

	return null;
};

const getGridElement = ( blockElement, rootClientId ) => {
	if ( ! blockElement || ! rootClientId ) {
		return blockElement?.parentElement;
	}

	const escapedClientId = rootClientId.replace( /"/g, '\\"' );

	return (
		blockElement.ownerDocument.querySelector(
			`[data-unitone-client-id="${ escapedClientId }"]`
		) ||
		blockElement.ownerDocument.querySelector(
			`[data-block="${ escapedClientId }"]`
		) ||
		getBlockElement( rootClientId, blockElement.ownerDocument ) ||
		blockElement.parentElement
	);
};

const buildPlacementValue = ( start, end, maxLine ) =>
	`${ start } / ${ end > maxLine / 2 ? end - maxLine - 1 : end }`;

const getNextUnitone = ( {
	unitone,
	value,
	property,
	activeViewport,
	isResponsive,
} ) => {
	if ( ! isResponsive ) {
		return cleanEmptyObject( {
			...unitone,
			[ property ]: value,
		} );
	}

	const currentValue = unitone?.[ property ];
	const currentObject =
		'object' === typeof currentValue && null !== currentValue
			? currentValue
			: {};
	const nextValue = {
		...currentObject,
		[ activeViewport ]: value,
	};

	if ( 'lg' !== activeViewport && 'string' === typeof currentValue ) {
		nextValue.lg = currentValue;
	}

	return cleanEmptyObject( {
		...unitone,
		[ property ]: nextValue,
	} );
};

function ResizeHandle( { direction, onPointerDown } ) {
	return (
		<button
			type="button"
			className={ `unitone-grid-item-resizer__handle -${ direction }` }
			aria-hidden="true"
			tabIndex="-1"
			onPointerDown={ ( event ) => onPointerDown( event, direction ) }
		/>
	);
}

function UnitoneGridItemResizer( { clientId, rootClientId, attributes } ) {
	const { isSelected, parentBlock } = useSelect(
		( select ) => {
			const { getBlock, getBlockRootClientId, isBlockSelected } =
				select( blockEditorStore );
			const parentClientId =
				rootClientId || getBlockRootClientId( clientId );

			return {
				isSelected: isBlockSelected( clientId ),
				parentBlock: parentClientId ? getBlock( parentClientId ) : null,
			};
		},
		[ clientId, rootClientId ]
	);

	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const [ resolvedBlockElement, setResolvedBlockElement ] = useState( null );
	const [ rect, setRect ] = useState( null );
	const [ previewRect, setPreviewRect ] = useState( null );
	const [ isResizing, setIsResizing ] = useState( false );
	const [ settings, setSettings ] = useState( null );
	const [ gridElement, setGridElement ] = useState( null );

	useEffect( () => {
		const nextBlockElement = getBlockElement( clientId );
		if ( nextBlockElement ) {
			setResolvedBlockElement( nextBlockElement );
			return;
		}

		const win = document.defaultView;
		const rafId = win.requestAnimationFrame( () => {
			setResolvedBlockElement( getBlockElement( clientId ) );
		} );

		return () => win.cancelAnimationFrame( rafId );
	}, [ clientId ] );

	const refresh = useCallback( () => {
		if ( ! resolvedBlockElement ) {
			setRect( null );
			setPreviewRect( null );
			setSettings( null );
			setGridElement( null );
			return;
		}

		const nextSettings = getResizeSettings(
			parentBlock,
			resolvedBlockElement
		);
		const nextGridElement = getGridElement(
			resolvedBlockElement,
			rootClientId
		);

		setSettings(
			getConstrainedResizeSettings(
				nextSettings,
				resolvedBlockElement,
				nextGridElement
			)
		);

		setGridElement( nextGridElement );
		setRect( resolvedBlockElement.getBoundingClientRect() );
	}, [ parentBlock, resolvedBlockElement, rootClientId ] );

	useEffect( () => {
		refresh();
	}, [ refresh ] );

	useEffect( () => {
		if ( ! resolvedBlockElement ) {
			return;
		}

		const win = resolvedBlockElement.ownerDocument.defaultView;
		const doc = resolvedBlockElement.ownerDocument;
		const resizeObserver = new win.ResizeObserver( refresh );
		resizeObserver.observe( resolvedBlockElement );

		const observedGridElement = getGridElement(
			resolvedBlockElement,
			rootClientId
		);
		if ( observedGridElement ) {
			resizeObserver.observe( observedGridElement );
		}

		win.addEventListener( 'resize', refresh );
		win.addEventListener( 'scroll', refresh, true );
		doc.addEventListener( 'scroll', refresh, true );

		return () => {
			resizeObserver.disconnect();
			win.removeEventListener( 'resize', refresh );
			win.removeEventListener( 'scroll', refresh, true );
			doc.removeEventListener( 'scroll', refresh, true );
		};
	}, [ refresh, resolvedBlockElement, rootClientId ] );

	const isVisible = useMemo(
		() =>
			isSelected &&
			resolvedBlockElement &&
			settings &&
			( settings.canResizeColumns || settings.canResizeRows ) &&
			rect?.width &&
			rect?.height,
		[ isSelected, rect, resolvedBlockElement, settings ]
	);

	const onPointerDown = useCallback(
		( event, direction ) => {
			if ( ! settings || ! gridElement ) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			const win = resolvedBlockElement.ownerDocument.defaultView;
			const metrics = getGridMetrics( gridElement );
			const isColumnResize =
				( 'left' === direction || 'right' === direction ) &&
				settings.canResizeColumns;
			const isRowResize =
				( 'top' === direction || 'bottom' === direction ) &&
				settings.canResizeRows;

			if (
				! metrics ||
				( isColumnResize && metrics.columnStartLines.length < 2 ) ||
				( isColumnResize && metrics.columnEndLines.length < 2 ) ||
				( isRowResize && metrics.rowStartLines.length < 2 ) ||
				( isRowResize && metrics.rowEndLines.length < 2 )
			) {
				return;
			}

			const initialRect = getItemGridRect(
				resolvedBlockElement,
				metrics
			);
			const state = { ...initialRect };

			applyInitialPlacement( {
				state,
				attributes,
				settings,
				metrics,
			} );

			const maxColumnLine = metrics.columnStartLines.length;
			const maxRowLine = metrics.rowStartLines.length;
			const fallbackRect = resolvedBlockElement.getBoundingClientRect();

			setIsResizing( true );
			setPreviewRect(
				getPreviewRect( {
					state,
					metrics,
					fallbackRect,
					useColumns: settings.canResizeColumns,
					useRows: settings.canResizeRows,
				} )
			);

			const commit = () => {
				const nextAttributes = { unitone: { ...attributes?.unitone } };

				if ( isColumnResize ) {
					nextAttributes.unitone = getNextUnitone( {
						unitone: nextAttributes.unitone,
						value: buildPlacementValue(
							state.columnStart,
							state.columnEnd,
							maxColumnLine
						),
						property: 'gridColumn',
						activeViewport: settings.activeViewport,
						isResponsive: settings.isResponsive,
					} );
				}

				if ( isRowResize ) {
					nextAttributes.unitone = getNextUnitone( {
						unitone: nextAttributes.unitone,
						value: buildPlacementValue(
							state.rowStart,
							state.rowEnd,
							maxRowLine
						),
						property: 'gridRow',
						activeViewport: settings.activeViewport,
						isResponsive: settings.isResponsive,
					} );
				}

				updateBlockAttributes( clientId, nextAttributes );
			};

			const onPointerMove = ( pointerMoveEvent ) => {
				if ( 'right' === direction && settings.canResizeColumns ) {
					state.columnEnd = clamp(
						getClosestLine(
							metrics.columnEndLines,
							pointerMoveEvent.clientX
						),
						state.columnStart + 1,
						maxColumnLine
					);
				}

				if ( 'left' === direction && settings.canResizeColumns ) {
					state.columnStart = clamp(
						getClosestLine(
							metrics.columnStartLines,
							pointerMoveEvent.clientX
						),
						1,
						state.columnEnd - 1
					);
				}

				if ( 'bottom' === direction && settings.canResizeRows ) {
					state.rowEnd = clamp(
						getClosestLine(
							metrics.rowEndLines,
							pointerMoveEvent.clientY
						),
						state.rowStart + 1,
						maxRowLine
					);
				}

				if ( 'top' === direction && settings.canResizeRows ) {
					state.rowStart = clamp(
						getClosestLine(
							metrics.rowStartLines,
							pointerMoveEvent.clientY
						),
						1,
						state.rowEnd - 1
					);
				}

				setPreviewRect(
					getPreviewRect( {
						state,
						metrics,
						fallbackRect,
						useColumns: settings.canResizeColumns,
						useRows: settings.canResizeRows,
					} )
				);
			};

			const onPointerEnd = () => {
				win.removeEventListener( 'pointermove', onPointerMove );
				win.removeEventListener( 'pointerup', onPointerEnd );
				win.removeEventListener( 'pointercancel', onPointerEnd );
				setIsResizing( false );
				commit();
				win.requestAnimationFrame( () => {
					setPreviewRect( null );
					refresh();
				} );
			};

			win.addEventListener( 'pointermove', onPointerMove );
			win.addEventListener( 'pointerup', onPointerEnd );
			win.addEventListener( 'pointercancel', onPointerEnd );
		},
		[
			attributes,
			clientId,
			gridElement,
			refresh,
			resolvedBlockElement,
			settings,
			updateBlockAttributes,
		]
	);

	if ( ! isVisible ) {
		return null;
	}

	const frameRect = previewRect ?? rect;

	return createPortal(
		<div
			className={ `unitone-grid-item-resizer${
				isResizing ? ' -is-resizing' : ''
			}` }
			style={ {
				top: frameRect.top,
				left: frameRect.left,
				width: frameRect.width,
				height: frameRect.height,
			} }
		>
			{ settings.canResizeColumns && (
				<>
					<ResizeHandle
						direction="left"
						onPointerDown={ onPointerDown }
					/>
					<ResizeHandle
						direction="right"
						onPointerDown={ onPointerDown }
					/>
				</>
			) }
			{ settings.canResizeRows && (
				<>
					<ResizeHandle
						direction="top"
						onPointerDown={ onPointerDown }
					/>
					<ResizeHandle
						direction="bottom"
						onPointerDown={ onPointerDown }
					/>
				</>
			) }
		</div>,
		resolvedBlockElement.ownerDocument.body
	);
}

const withGridItemResizer = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		return (
			<>
				<BlockListBlock { ...props } />

				{ props.clientId && (
					<UnitoneGridItemResizer
						clientId={ props.clientId }
						rootClientId={ props.rootClientId }
						attributes={ props.attributes }
					/>
				) }
			</>
		);
	};
}, 'withGridItemResizer' );

addFilter(
	'editor.BlockListBlock',
	'unitone/with-grid-item-resizer',
	withGridItemResizer
);
