import {
	createBlock,
	getBlockAttributes,
	getBlockType,
} from '@wordpress/blocks';

import { copyRootAttributes } from './attributes';
import { normalizeText } from './labels';
import { hasUnsupportedContent, sanitizeElement } from './security';
import { applyStyles } from './styles';

const LIST_STYLES = {
	A: 'upper-alpha',
	a: 'lower-alpha',
	I: 'upper-roman',
	i: 'lower-roman',
};

const isList = ( element ) => [ 'UL', 'OL' ].includes( element.tagName );
const isEmptyNode = ( node ) =>
	node.nodeType === 8 || ( node.nodeType === 3 && ! node.textContent.trim() );

export function getListItemContent( element ) {
	const own = element.cloneNode( true );
	for ( const child of Array.from( own.children ) ) {
		if ( isList( child ) ) {
			child.remove();
		}
	}
	return own;
}

const getItemText = ( element ) => {
	const content = getListItemContent( element );
	for ( const lineBreak of content.querySelectorAll( 'br' ) ) {
		lineBreak.replaceWith( ' ' );
	}
	return normalizeText( content.textContent );
};

function isSupportedList( element ) {
	return Array.from( element.childNodes ).every( ( node ) => {
		if ( isEmptyNode( node ) ) {
			return true;
		}
		if ( node.nodeType !== 1 || node.tagName !== 'LI' ) {
			return false;
		}
		let nested = false;
		for ( const child of node.childNodes ) {
			if ( child.nodeType === 1 && isList( child ) ) {
				// Multiple child lists accumulate RichText separator whitespace on
				// each save/reload in WordPress 7.1. Retain that structure as HTML.
				if ( nested ) {
					return false;
				}
				nested = true;
				if ( ! isSupportedList( child ) ) {
					return false;
				}
			} else if ( nested && ! isEmptyNode( child ) ) {
				// Core saves nested lists after the item's RichText content.
				return false;
			}
		}
		return ! hasUnsupportedContent(
			getListItemContent( node ),
			'paragraph'
		);
	} );
}

export function createList( element ) {
	if ( ! isSupportedList( element ) ) {
		return { error: 'complex-list' };
	}
	if ( ! getBlockType( 'core/list-item' ) ) {
		return { error: 'unavailable-block' };
	}
	const records = [];

	const build = ( source, kind ) => {
		const name = `core/${ kind }`;
		// Sanitize each block's own markup so removal notes identify its item.
		const sanitized = sanitizeElement(
			kind === 'list'
				? source.cloneNode( false )
				: getListItemContent( source )
		);
		const own = sanitized.element;
		const attributes = {};
		copyRootAttributes( own, attributes );
		if ( getBlockType( name ).supports?.className === false ) {
			delete attributes.className;
		}
		applyStyles( own, name, attributes );

		if ( kind === 'list' ) {
			attributes.ordered = source.tagName === 'OL';
			if ( attributes.ordered ) {
				const start = own.getAttribute( 'start' )?.trim();
				if (
					/^[+-]?\d+$/.test( start ) &&
					Number.isSafeInteger( Number( start ) )
				) {
					attributes.start = Number( start );
				}
				if ( own.hasAttribute( 'reversed' ) ) {
					attributes.reversed = true;
				}
				const styleType =
					own.style.getPropertyValue( 'list-style-type' );
				const type = own.getAttribute( 'type' );
				const mappedType = Object.hasOwn( LIST_STYLES, type )
					? LIST_STYLES[ type ]
					: undefined;
				attributes.type = /^[a-z][a-z-]*$/i.test( styleType )
					? styleType
					: mappedType;
				if ( mappedType && attributes.type === mappedType ) {
					own.removeAttribute( 'type' );
					sanitized.notes.push( {
						code: 'attribute-to-style',
						tag: 'ol',
						names: [ 'type' ],
					} );
				}
			}
		}

		const record = {
			kind,
			source: own,
			notes: sanitized.notes,
			text:
				kind === 'list'
					? Array.from( source.children, getItemText ).join( ' ' )
					: getItemText( own ),
		};
		records.push( record );
		const children = Array.from( source.children ).filter( ( child ) =>
			kind === 'list' ? child.tagName === 'LI' : isList( child )
		);
		const innerBlocks = children.map( ( child ) =>
			build( child, kind === 'list' ? 'list-item' : 'list' )
		);
		record.block = createBlock(
			name,
			kind === 'list'
				? attributes
				: getBlockAttributes( name, own.outerHTML, attributes ),
			innerBlocks
		);
		return record.block;
	};

	const block = build( element, 'list' );
	return { block, records };
}
