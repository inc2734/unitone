import { Popover } from '@wordpress/components';
import { useViewportMatch } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as editPostStore } from '@wordpress/edit-post';
import { useEffect, useState, forwardRef, memo } from '@wordpress/element';

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
		object === null ||
		typeof object !== 'object' ||
		Array.isArray( object ) ||
		( object.$$typeof && typeof object.$$typeof === 'symbol' )
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
 * @return {JSX.Element}
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
	}, [] );

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
