import { isSafeURL } from './urls';

const INLINE_TAGS = new Set( [
	'A',
	'ABBR',
	'B',
	'BDI',
	'BDO',
	'BR',
	'CITE',
	'CODE',
	'DEL',
	'DFN',
	'EM',
	'FONT',
	'I',
	'INS',
	'KBD',
	'MARK',
	'Q',
	'RB',
	'RP',
	'RT',
	'RTC',
	'RUBY',
	'S',
	'SAMP',
	'SMALL',
	'SPAN',
	'STRONG',
	'SUB',
	'SUP',
	'TIME',
	'TT',
	'U',
	'VAR',
	'WBR',
] );

const IMAGE_TAGS = new Set( [ 'FIGURE', 'FIGCAPTION', 'IMG' ] );

const URL_ATTRIBUTES = new Set( [
	'href',
	'src',
	'cite',
	'action',
	'formaction',
	'background',
	'poster',
	'xlink:href',
] );

export function hasUnsupportedContent( element, kind ) {
	return Array.from( element.querySelectorAll( '*' ) ).some(
		( child ) =>
			child.namespaceURI !== 'http://www.w3.org/1999/xhtml' ||
			( ! INLINE_TAGS.has( child.tagName ) &&
				! ( kind === 'image' && IMAGE_TAGS.has( child.tagName ) ) )
	);
}

/**
 * RichText restores its disabled-event attributes when text is edited. Remove
 * those reserved attributes before parsing, even though they begin with data-.
 * Only conversion candidates are sanitized; the surrounding shell is untouched.
 *
 * @param {Element} source Original candidate element.
 * @return {Object} Detached sanitized element and removal diagnostics.
 */
export function sanitizeElement( source ) {
	let element = source.cloneNode( true );
	const notes = [];
	let unsafeImageURL = false;

	for ( const node of [ element, ...element.querySelectorAll( '*' ) ] ) {
		const customized = node.hasAttribute( 'is' );
		const attributes = [];
		const urls = [];

		for ( const attribute of Array.from( node.attributes ) ) {
			const name = attribute.name.toLowerCase();

			if (
				/^on|^data-(?:disable-)?rich-text-/.test( name ) ||
				name === 'is' ||
				name === 'srcdoc'
			) {
				node.removeAttribute( attribute.name );
				attributes.push( attribute.name );
			} else if ( URL_ATTRIBUTES.has( name ) ) {
				let context = 'preview';

				if ( name === 'src' && node.tagName === 'IMG' ) {
					context = 'image';
				} else if ( name === 'href' || name === 'xlink:href' ) {
					context = 'link';
				}

				if ( ! isSafeURL( attribute.value, context ) ) {
					node.removeAttribute( attribute.name );
					urls.push( attribute.name );

					unsafeImageURL ||=
						context === 'image' && !! attribute.value.trim();
				}
			}
		}

		for ( const [ code, names ] of [
			[ 'unsafe-attributes-removed', attributes ],
			[ 'unsafe-urls-removed', urls ],
		] ) {
			if ( names.length ) {
				notes.push( { code, tag: node.tagName.toLowerCase(), names } );
			}
		}

		if ( customized ) {
			// Removing the attribute alone leaves the internal "is" value, which
			// HTML serialization can restore. Recreate it without that value.
			const replacement = node.ownerDocument.createElementNS(
				node.namespaceURI,
				node.localName
			);

			for ( const { name, value } of Array.from( node.attributes ) ) {
				replacement.setAttribute( name, value );
			}

			replacement.append( ...node.childNodes );

			if ( node === element ) {
				element = replacement;
			} else {
				node.replaceWith( replacement );
			}
		}
	}

	return { element, notes, unsafeImageURL };
}
