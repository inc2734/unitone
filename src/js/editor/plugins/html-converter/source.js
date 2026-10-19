import { parseFragment } from 'parse5';
import { normalizeText } from './labels';

const EXCLUDED_TAGS = new Set( [
	'script',
	'style',
	'template',
	'noscript',
	'textarea',
	'pre',
	'code',
	'svg',
	'math',
	'button',
	'select',
] );

const getElements = ( node ) =>
	( node.childNodes ?? [] ).filter( ( child ) => child.tagName );

const findImage = ( node ) => {
	if ( node.tagName === 'img' ) {
		return node;
	}

	for ( const child of getElements( node ) ) {
		const image = findImage( child );
		if ( image ) {
			return image;
		}
	}

	return undefined;
};

const getText = ( node ) => {
	if ( node.nodeName === '#text' ) {
		return node.value;
	}

	if ( node.tagName === 'br' ) {
		return '\n';
	}

	return ( node.childNodes ?? [] ).map( getText ).join( '' );
};

/**
 * Parse the complete shell, since individual innerContent fragments may contain
 * unmatched opening or closing tags. Source offsets keep untouched HTML exact.
 * Existing inner blocks are opaque markers and retain their object identities.
 *
 * @param {Object} block Custom HTML block.
 * @return {Object} Source HTML, existing slots, and conversion candidates.
 */
export function analyzeHTML( block ) {
	const fragments = block.innerContent ?? [ block.attributes?.content ?? '' ];

	let marker = 'unitone-html-inner-block';
	while ( fragments.some( ( part ) => part?.includes( marker ) ) ) {
		marker += '-';
	}

	let html = '';
	let index = 0;
	const slots = [];

	const appendSlot = () => {
		const child = block.innerBlocks?.[ index++ ];
		if ( ! child ) {
			return;
		}

		const start = html.length;
		html += `<!--${ marker }:${ slots.length }-->`;
		slots.push( { start, end: html.length, block: child } );
	};

	fragments.forEach( ( part ) => {
		if ( part === null ) {
			appendSlot();
		} else {
			html += part;
		}
	} );

	while ( index < ( block.innerBlocks?.length ?? 0 ) ) {
		appendSlot();
	}

	const errors = [];

	const root = parseFragment( html, {
		sourceCodeLocationInfo: true,
		onParseError: ( error ) => errors.push( error ),
	} );

	const candidates = [];

	const visit = ( node ) => {
		if ( EXCLUDED_TAGS.has( node.tagName ) ) {
			return;
		}

		const image = [ 'img', 'figure', 'picture', 'a' ].includes(
			node.tagName
		)
			? findImage( node )
			: undefined;
		const elements = getElements( node );
		const isImageContainer =
			image &&
			( [ 'figure', 'picture' ].includes( node.tagName ) ||
				( node.tagName === 'a' &&
					elements.length === 1 &&
					elements[ 0 ].tagName === 'img' &&
					! normalizeText( getText( node ) ) ) );

		let kind;

		if ( /^h[1-6]$/.test( node.tagName ) ) {
			kind = 'heading';
		} else if ( node.tagName === 'p' ) {
			kind = 'paragraph';
		} else if ( node.tagName === 'img' || isImageContainer ) {
			kind = 'image';
		}

		const location = node.sourceCodeLocation;

		if ( kind && location ) {
			let parent = node.parentNode;
			let inlineImage = false;

			while ( parent ) {
				if ( /^(?:p|h[1-6]|a)$/.test( parent.tagName ) ) {
					inlineImage = true;
				}

				parent = parent.parentNode;
			}

			const imageAttributes = Object.fromEntries(
				( image?.attrs ?? [] ).map( ( attribute ) => [
					attribute.name,
					attribute.value,
				] )
			);

			candidates.push( {
				kind,
				start: location.startOffset,
				end: location.endOffset,
				html: html.slice( location.startOffset, location.endOffset ),
				text: normalizeText( getText( node ) ),
				imageUrl: imageAttributes.src ?? '',
				imageAlt: imageAttributes.alt ?? '',
				inlineImage,
				markupNormalized:
					( kind !== 'image' && ! location.endTag ) ||
					errors.some(
						( error ) =>
							error.startOffset >= location.startOffset &&
							error.startOffset < location.endOffset
					),
			} );
		}

		if ( isImageContainer ) {
			return;
		}

		( node.childNodes ?? [] ).forEach( visit );
	};

	visit( root );
	candidates.sort( ( first, second ) => first.start - second.start );
	return { html, slots, candidates };
}
