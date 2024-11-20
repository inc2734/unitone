import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as editPostStore } from '@wordpress/edit-post';
import { useEffect, useMemo, useState } from '@wordpress/element';

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
		Array.isArray( object )
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
 * Check if the value is number.
 *
 * @param {*} value The value to check.
 * @return {boolean} Return true if the value is number.
 */
export function isNumber( value ) {
	return ! isNaN( value ) && '' !== value;
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
 *
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
 *
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
 *
 * @return {boolean} Return true if value is string in format var:style|global|.
 */
export function isValueGlobalStyle( value ) {
	if ( ! value?.includes ) {
		return false;
	}

	return value.includes( 'var:style|global|' );
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

/**
 * Display Grid (responsive supported) Visualizer.
 *
 * @param {Object}  props               options.
 * @param {Object}  props.ref           The target ref.
 * @param {Object}  props.attributes    Attributes of the target block.
 * @param {Object}  props.styles        Styles of the target block.
 * @param {string}  props.unitoneLayout `data-unitone-layout` attribute.
 * @param {string}  props.clientId      clientId of the target block.
 * @param {boolean} props.isSelected    isSelected of the target block.
 */
export function useResponsiveGridVisualizer( {
	ref,
	attributes,
	styles,
	unitoneLayout,
	clientId,
	isSelected,
} ) {
	const {
		__unstableUnitoneBlockOutline,
		columnsOption,
		columns,
		mdColumnsOption,
		mdColumns,
		smColumnsOption,
		smColumns,
		rowsOption,
		rows,
		mdRowsOption,
		mdRows,
		smRowsOption,
		smRows,
	} = attributes;

	const [ documentWidth, setDocumentWidth ] = useState( null );

	const innerBlocksCount = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const { currentColumns, currentRows } = useMemo( () => {
		const isTablet = !! documentWidth && 960 > documentWidth;
		const isMobile = !! documentWidth && 600 > documentWidth;

		let newCurrentColumns =
			'columns' === columnsOption ? columns : undefined;
		let newCurrentRows = 'rows' === rowsOption ? rows : undefined;

		if ( isTablet ) {
			if ( unitoneLayout.match( '-columns:md:' ) ) {
				if ( 'columns' === mdColumnsOption ) {
					if ( '' !== mdColumns ) {
						newCurrentColumns = mdColumns;
					}
				} else {
					newCurrentColumns = undefined;
				}
			}

			if ( unitoneLayout.match( '-rows:md:' ) ) {
				if ( 'rows' === mdRowsOption ) {
					if ( '' !== mdRows ) {
						newCurrentRows = mdRows;
					}
				} else {
					newCurrentRows = undefined;
				}
			}
		}

		if ( isMobile ) {
			if ( unitoneLayout.match( '-columns:sm:' ) ) {
				if ( 'columns' === smColumnsOption ) {
					if ( '' !== smColumns ) {
						newCurrentColumns = smColumns;
					}
				} else {
					newCurrentColumns = undefined;
				}
			}

			if ( unitoneLayout.match( '-rows:sm:' ) ) {
				if ( 'rows' === smRowsOption ) {
					if ( '' !== smRows ) {
						newCurrentRows = smRows;
					}
				} else {
					newCurrentRows = undefined;
				}
			}
		}

		return {
			currentColumns: newCurrentColumns,
			currentRows: newCurrentRows,
		};
	}, [
		documentWidth,
		columnsOption,
		columns,
		rowsOption,
		rows,
		unitoneLayout,
		mdColumnsOption,
		mdColumns,
		mdRowsOption,
		mdRows,
		smColumnsOption,
		smColumns,
		smRowsOption,
		smRows,
	] );

	const gridCells = useMemo( () => {
		const ownerDocument = ref?.current?.ownerDocument;
		if ( ! ownerDocument ) {
			return null;
		}

		const newGridCells = ownerDocument.createElement( 'div' );

		newGridCells.classList.add( 'unitone-grid-cells' );
		Object.keys( styles ).forEach( ( property ) => {
			if ( null != styles[ property ] ) {
				newGridCells.style.setProperty( property, styles[ property ] );
			}
		} );

		for ( let ri = 1; ri <= currentRows; ri++ ) {
			for ( let ci = 1; ci <= currentColumns; ci++ ) {
				const gridCell = ownerDocument.createElement( 'div' );
				gridCell.classList.add( 'unitone-grid-cell' );
				gridCell.style.setProperty( '--unitone--grid-column', ci );
				gridCell.style.setProperty( '--unitone--grid-row', ri );
				newGridCells.append( gridCell );
			}
		}

		return newGridCells;
	}, [
		ref?.current?.ownerDocument,
		JSON.stringify( styles ),
		currentRows,
		currentColumns,
	] );

	useEffect( () => {
		const ownerDocument = ref.current.ownerDocument;
		const defaultView = ownerDocument.defaultView;

		const resizeObserver = new defaultView.ResizeObserver( ( entries ) => {
			const width = entries[ 0 ]?.borderBoxSize?.[ 0 ]?.inlineSize;
			if ( width !== documentWidth ) {
				setDocumentWidth( width );
			}
		} );
		resizeObserver.observe( ownerDocument.body, { box: 'border-box' } );

		return () => {
			if ( !! resizeObserver ) {
				resizeObserver.disconnect();
			}
		};
	}, [] );

	useEffect( () => {
		if ( 0 < innerBlocksCount || isSelected ) {
			ref.current
				.querySelector( ':scope > .unitone-grid-cells' )
				?.remove();
		}

		if ( ! __unstableUnitoneBlockOutline ) {
			return;
		}

		if ( null != currentColumns && null != currentRows ) {
			ref.current.append( gridCells );
		}
	}, [
		__unstableUnitoneBlockOutline,
		currentColumns,
		currentRows,
		gridCells,
		innerBlocksCount,
		isSelected,
	] );
}

/**
 * Display Grid Visualizer.
 *
 * @param {Object}  props            options.
 * @param {Object}  props.ref        The target ref.
 * @param {Object}  props.attributes Attributes of the target block.
 * @param {Object}  props.styles     Styles of the target block.
 * @param {string}  props.clientId   clientId of the target block.
 * @param {boolean} props.isSelected isSelected of the target block.
 */
export function useGridVisualizer( {
	ref,
	attributes,
	styles,
	clientId,
	isSelected,
} ) {
	const { __unstableUnitoneBlockOutline, columns, rows } = attributes;

	const innerBlocksCount = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const gridCells = useMemo( () => {
		const ownerDocument = ref?.current?.ownerDocument;
		if ( ! ownerDocument ) {
			return null;
		}

		const newGridCells = ownerDocument.createElement( 'div' );

		newGridCells.classList.add( 'unitone-grid-cells' );
		Object.keys( styles ).forEach( ( property ) => {
			if ( null != styles[ property ] ) {
				newGridCells.style.setProperty( property, styles[ property ] );
			}
		} );

		for ( let ri = 1; ri <= rows; ri++ ) {
			for ( let ci = 1; ci <= columns; ci++ ) {
				const gridCell =
					ref.current.ownerDocument.createElement( 'div' );
				gridCell.classList.add( 'unitone-grid-cell' );
				gridCell.style.setProperty( '--unitone--grid-column', ci );
				gridCell.style.setProperty( '--unitone--grid-row', ri );
				newGridCells.append( gridCell );
			}
		}

		return newGridCells;
	}, [
		ref?.current?.ownerDocument,
		JSON.stringify( styles ),
		rows,
		columns,
	] );

	useEffect( () => {
		if ( 0 < innerBlocksCount || isSelected ) {
			ref.current
				.querySelector( ':scope > .unitone-grid-cells' )
				?.remove();
		}

		if ( ! __unstableUnitoneBlockOutline ) {
			return;
		}

		if ( null != columns && null != rows ) {
			ref.current.append( gridCells );
		}
	}, [
		__unstableUnitoneBlockOutline,
		columns,
		rows,
		gridCells,
		innerBlocksCount,
		isSelected,
	] );
}
