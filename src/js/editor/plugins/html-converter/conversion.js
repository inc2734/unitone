import {
	createBlock,
	getBlockAttributes,
	getBlockType,
	getSaveContent,
} from '@wordpress/blocks';

import { analyzeHTML } from './source';
import { normalizeText } from './labels';
import { applyStyles, getDeclaredStyleProperties } from './styles';
import { hasUnsupportedContent, sanitizeElement } from './security';

export { analyzeHTML } from './source';

const getElement = ( html ) => {
	const template = document.createElement( 'template' );
	template.innerHTML = html;
	return template.content.firstElementChild;
};

const tokens = ( value ) => ( value ?? '' ).split( /\s+/ ).filter( Boolean );

const copyRootAttributes = ( element, attributes ) => {
	if ( element.hasAttribute( 'class' ) ) {
		attributes.className = element.getAttribute( 'class' );
	}
	if ( element.id ) {
		attributes.anchor = element.id;
	}
};

const hasOnlyImageContent = ( element ) =>
	Array.from( element.childNodes ).every(
		( node ) =>
			( node.nodeType === 3 && ! node.textContent.trim() ) ||
			( node.nodeType === 1 && node.tagName === 'IMG' )
	);

function createImage( element ) {
	let image;
	let link;
	let caption;
	if ( element.tagName === 'IMG' ) {
		image = element;
	} else if ( element.tagName === 'A' && hasOnlyImageContent( element ) ) {
		link = element;
		image = element.querySelector( 'img' );
	} else if ( element.tagName === 'FIGURE' ) {
		const children = Array.from( element.children );

		const media = children.filter(
			( child ) => child.tagName !== 'FIGCAPTION'
		);

		const captions = children.filter(
			( child ) => child.tagName === 'FIGCAPTION'
		);

		const hasExtraContent = Array.from( element.childNodes ).some(
			( node ) =>
				node.nodeType !== 1 &&
				( node.nodeType !== 3 || node.textContent.trim() )
		);

		if ( media.length !== 1 || captions.length > 1 || hasExtraContent ) {
			return { error: 'complex-image' };
		}

		if ( media[ 0 ].tagName === 'IMG' ) {
			image = media[ 0 ];
		} else if (
			media[ 0 ].tagName === 'A' &&
			hasOnlyImageContent( media[ 0 ] )
		) {
			link = media[ 0 ];
			image = link.querySelector( 'img' );
		}
		caption = captions[ 0 ];
	}

	if ( ! image || element.querySelectorAll( 'img' ).length > 1 ) {
		return { error: 'complex-image' };
	}

	if ( ! image.getAttribute( 'src' )?.trim() ) {
		return { error: 'missing-image-url' };
	}

	if (
		caption?.querySelector( 'p, div, img, figure, script, style, iframe' )
	) {
		return { error: 'complex-image' };
	}

	const attributes = {
		url: image.getAttribute( 'src' ),
		alt: image.getAttribute( 'alt' ) ?? '',
		title: image.getAttribute( 'title' ) ?? undefined,
	};

	copyRootAttributes( element, attributes );

	const classes = tokens( image.getAttribute( 'class' ) );
	const idClass = classes.find( ( name ) => /^wp-image-\d+$/.test( name ) );

	if ( idClass ) {
		attributes.id = Number( idClass.slice( 9 ) );
	}

	attributes.className =
		Array.from(
			new Set(
				[ ...tokens( attributes.className ), ...classes ].filter(
					( name ) =>
						! /^wp-image-\d+$/.test( name ) &&
						name !== 'wp-block-image'
				)
			)
		).join( ' ' ) || undefined;

	attributes.anchor ||= image.id || undefined;

	if ( image.getAttribute( 'role' ) === 'none' ) {
		attributes.isDecorative = true;
	}

	const width = image.getAttribute( 'width' );
	const height = image.getAttribute( 'height' );

	if ( /^\d+$/.test( width ) && Number( width ) > 0 ) {
		attributes.width = `${ width }px`;
		attributes.height = 'auto';

		if ( /^\d+$/.test( height ) && Number( height ) > 0 ) {
			attributes.aspectRatio = `${ width } / ${ height }`;
		}
	} else if ( /^\d+$/.test( height ) && Number( height ) > 0 ) {
		attributes.height = `${ height }px`;
		attributes.width = 'auto';
	}

	if ( link ) {
		attributes.href = link.getAttribute( 'href' ) ?? undefined;
		attributes.linkDestination = attributes.href ? 'custom' : undefined;
		attributes.linkTarget = link.getAttribute( 'target' ) ?? undefined;
		attributes.rel = link.getAttribute( 'rel' ) ?? undefined;
		attributes.linkClass = link.getAttribute( 'class' ) ?? undefined;
	}

	const markup = document.createElement( 'figure' );

	markup.append( ( link ?? image ).cloneNode( true ) );
	if ( caption ) {
		markup.append( caption.cloneNode( true ) );
	}

	applyStyles( element, 'core/image', attributes );
	if ( image !== element ) {
		applyStyles( image, 'core/image', attributes );
	}

	return {
		block: createBlock(
			'core/image',
			getBlockAttributes( 'core/image', markup.outerHTML, attributes )
		),
	};
}

function compareElement( source, target, alternatives = [] ) {
	const notes = [];
	const removed = [];
	const changed = [];
	const removedStyles = [];
	const changedStyles = [];
	const movedStyles = [];

	for ( const attribute of Array.from( source.attributes ) ) {
		const { name, value } = attribute;

		if ( name === 'style' ) {
			const properties = getDeclaredStyleProperties( value );

			if ( ! properties.length && value.trim() ) {
				removed.push( 'style' );
			}

			for ( const property of properties ) {
				const original = source.style.getPropertyValue( property );

				const matches = ( element ) => {
					if ( /^(?:margin|padding)$/.test( property ) ) {
						return [ 'top', 'right', 'bottom', 'left' ].every(
							( side ) => {
								const sideProperty = `${ property }-${ side }`;
								return (
									source.style.getPropertyValue(
										sideProperty
									) &&
									source.style.getPropertyValue(
										sideProperty
									) ===
										element?.style.getPropertyValue(
											sideProperty
										)
								);
							}
						);
					}

					return (
						original &&
						element?.style.getPropertyValue( property ) === original
					);
				};

				if ( matches( target ) ) {
					if (
						source.style.getPropertyPriority( property ) !==
						target.style.getPropertyPriority( property )
					) {
						changedStyles.push( property );
					}
				} else if ( alternatives.some( matches ) ) {
					movedStyles.push( property );
				} else if ( target?.style.getPropertyValue( property ) ) {
					changedStyles.push( property );
				} else {
					removedStyles.push( property );
				}
			}
			continue;
		}

		// Image dimensions are represented by sizing styles, not HTML attributes.
		if (
			source.tagName === 'IMG' &&
			[ 'width', 'height' ].includes( name ) &&
			/^\d+$/.test( value ) &&
			Number( value ) > 0
		) {
			if ( target?.style.getPropertyValue( name ) ) {
				notes.push( {
					code: 'attribute-to-style',
					tag: 'img',
					names: [ name ],
				} );
				continue;
			}
		}

		if ( name === 'class' ) {
			const missing = tokens( value ).filter(
				( token ) => ! target?.classList.contains( token )
			);

			if ( ! missing.length ) {
				continue;
			}

			const destination = alternatives.find( ( other ) =>
				missing.every( ( token ) => other?.classList.contains( token ) )
			);

			if ( destination ) {
				notes.push( {
					code: 'attribute-moved',
					tag: source.tagName.toLowerCase(),
					to: destination.tagName.toLowerCase(),
					names: [ name ],
				} );
			} else if ( target?.hasAttribute( name ) ) {
				changed.push( name );
			} else {
				removed.push( name );
			}
			continue;
		}

		if ( target?.getAttribute( name ) === value ) {
			continue;
		}

		const destination = alternatives.find(
			( other ) => other?.getAttribute( name ) === value
		);

		if ( destination ) {
			notes.push( {
				code: 'attribute-moved',
				tag: source.tagName.toLowerCase(),
				to: destination.tagName.toLowerCase(),
				names: [ name ],
			} );
		} else if ( target?.hasAttribute( name ) ) {
			changed.push( name );
		} else {
			removed.push( name );
		}
	}

	for ( const [ code, names ] of [
		[ 'attributes-removed', removed ],
		[ 'attributes-changed', changed ],
		[ 'styles-removed', removedStyles ],
		[ 'styles-changed', changedStyles ],
		[ 'styles-moved', movedStyles ],
	] ) {
		if ( names.length ) {
			notes.push( { code, tag: source.tagName.toLowerCase(), names } );
		}
	}

	return notes;
}

function getNotes( source, saved, kind ) {
	const notes = [];

	if ( kind === 'image' ) {
		if ( source.tagName !== 'FIGURE' ) {
			notes.push( { code: 'image-wrapper' } );
		}

		const elements = [ source, ...source.querySelectorAll( '*' ) ];

		for ( const element of elements ) {
			if (
				[ 'IMG', 'A', 'FIGCAPTION', 'FIGURE' ].includes(
					element.tagName
				)
			) {
				const target =
					element.tagName === 'FIGURE'
						? saved
						: saved.querySelector( element.tagName.toLowerCase() );

				notes.push(
					...compareElement(
						element,
						target,
						[ saved, saved.querySelector( 'img' ) ].filter(
							( other ) => other !== target
						)
					)
				);
			}
		}
	} else {
		notes.push( ...compareElement( source, saved ) );
	}

	const originalContent =
		kind === 'image' ? source.querySelector( 'figcaption' ) : source;
	const savedContent =
		kind === 'image' ? saved.querySelector( 'figcaption' ) : saved;

	if ( originalContent && savedContent ) {
		const originals = Array.from( originalContent.querySelectorAll( '*' ) );
		const targets = Array.from( savedContent.querySelectorAll( '*' ) );

		if (
			originals.length !== targets.length ||
			originals.some(
				( element, index ) =>
					element.tagName !== targets[ index ]?.tagName
			)
		) {
			notes.push( { code: 'inline-markup-changed' } );
		} else {
			originals.forEach( ( element, index ) =>
				notes.push( ...compareElement( element, targets[ index ] ) )
			);
		}

		if (
			normalizeText( originalContent.textContent ) !==
			normalizeText( savedContent.textContent )
		) {
			notes.push( { code: 'text-changed' } );
		}
	}

	return notes;
}

/**
 * Convert selected elements, keeping the shell and existing children intact.
 * Reports remain editor state; original HTML is not duplicated in block data.
 *
 * @param {Object} block    Custom HTML block.
 * @param {Object} selected Selected conversion kinds.
 * @return {Object} Updated content, children, counts, and diagnostic entries.
 */
export function convertHTML( block, selected ) {
	const source = analyzeHTML( block );
	const replacements = [ ...source.slots ];
	const entries = [];
	const counts = { heading: 0, paragraph: 0, image: 0 };
	let convertedEnd = -1;

	for ( const candidate of source.candidates ) {
		if ( ! selected[ candidate.kind ] || candidate.start < convertedEnd ) {
			continue;
		}

		const entry = { ...candidate, notes: [], status: 'failed' };
		const fail = ( code ) => {
			entry.notes.push( { code } );
			entries.push( entry );
		};

		if (
			source.slots.some(
				( slot ) =>
					slot.start < candidate.end && slot.end > candidate.start
			)
		) {
			fail( 'contains-blocks' );
			continue;
		}

		const blockName = `core/${ candidate.kind }`;

		if ( ! getBlockType( blockName ) ) {
			fail( 'unavailable-block' );
			continue;
		}

		try {
			const original = getElement( candidate.html );

			if ( hasUnsupportedContent( original, candidate.kind ) ) {
				fail(
					candidate.kind === 'image' ? 'complex-image' : 'mixed-text'
				);
				continue;
			}

			const sanitized = sanitizeElement( original );
			const { element } = sanitized;

			let nextBlock;

			if ( candidate.kind === 'image' ) {
				if ( candidate.inlineImage ) {
					fail( 'inline-image' );
					continue;
				}

				if ( sanitized.unsafeImageURL ) {
					fail( 'unsafe-image-url' );
					continue;
				}

				const result = createImage( element );
				if ( result.error ) {
					fail( result.error );
					continue;
				}

				nextBlock = result.block;
			} else {
				const attributes = {};
				copyRootAttributes( element, attributes );

				if ( candidate.kind === 'heading' ) {
					attributes.level = Number( element.tagName.slice( 1 ) );
				} else if (
					[ 'ltr', 'rtl' ].includes( element.getAttribute( 'dir' ) )
				) {
					attributes.direction = element.getAttribute( 'dir' );
				}

				applyStyles( element, blockName, attributes );
				nextBlock = createBlock(
					blockName,
					getBlockAttributes(
						blockName,
						element.outerHTML,
						attributes
					)
				);
			}

			const saved = getElement(
				getSaveContent( nextBlock.name, nextBlock.attributes )
			);

			if ( ! saved ) {
				fail( 'conversion-error' );
				continue;
			}

			entry.notes = [
				...sanitized.notes,
				...getNotes( element, saved, candidate.kind ),
			];

			if ( candidate.markupNormalized ) {
				entry.notes.push( { code: 'markup-normalized' } );
			}

			entry.blockId = nextBlock.clientId;
			entry.status = 'converted';
			entries.push( entry );
			replacements.push( {
				start: candidate.start,
				end: candidate.end,
				block: nextBlock,
			} );
			counts[ candidate.kind ]++;
			convertedEnd = candidate.end;
		} catch {
			fail( 'conversion-error' );
		}
	}

	replacements.sort( ( first, second ) => first.start - second.start );

	const innerContent = [];
	const innerBlocks = [];
	let offset = 0;

	for ( const replacement of replacements ) {
		innerContent.push(
			source.html.slice( offset, replacement.start ),
			null
		);

		innerBlocks.push( replacement.block );
		offset = replacement.end;
	}

	innerContent.push( source.html.slice( offset ) );

	return { innerContent, innerBlocks, counts, entries };
}
