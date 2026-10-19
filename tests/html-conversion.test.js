import { getBlockType, getSaveContent } from '@wordpress/blocks';
import { convertHTML } from '../src/js/editor/plugins/html-converter/conversion';
import { analyzeHTML } from '../src/js/editor/plugins/html-converter/source';

import {
	getImageFilename,
	shortenText,
} from '../src/js/editor/plugins/html-converter/labels';

import { getDeclaredStyleProperties } from '../src/js/editor/plugins/html-converter/styles';
import {
	getPreviewURL,
	isSafeURL,
} from '../src/js/editor/plugins/html-converter/urls';

jest.mock(
	'@wordpress/blocks',
	() => {
		const { compileCSS } = require( '@wordpress/style-engine' );
		const { document } = globalThis;
		let nextId = 0;
		const getElement = ( html ) => {
			const template = document.createElement( 'template' );
			template.innerHTML = html;
			return template.content.firstElementChild;
		};
		return {
			getBlockType: jest.fn( () => ( {} ) ),
			hasBlockSupport: ( name, support, fallback = false ) => {
				if ( name === 'core/image' ) {
					return [
						'spacing.margin',
						'shadow',
						'__experimentalBorder.radius',
					].includes( support );
				}
				return (
					fallback ||
					support === 'color' ||
					support.startsWith( 'typography.' ) ||
					support.startsWith( 'spacing.' )
				);
			},
			createBlock: ( name, attributes ) => ( {
				name,
				attributes,
				clientId: `converted-${ ++nextId }`,
				innerBlocks: [],
			} ),
			getBlockAttributes: ( name, html, attributes ) => {
				const element = getElement( html );
				if ( name === 'core/image' ) {
					const caption = element.querySelector( 'figcaption' );
					return { ...attributes, caption: caption?.innerHTML };
				}
				return { ...attributes, content: element.innerHTML };
			},
			// The unit tests exercise source preservation and diagnostics with a small
			// block adapter. Core serialization is also checked against WordPress 7.1.
			getSaveContent: jest.fn( ( name, attributes ) => {
				let tagName = 'p';
				if ( name === 'core/image' ) {
					tagName = 'figure';
				} else if ( name === 'core/heading' ) {
					tagName = `h${ attributes.level }`;
				}
				const root = document.createElement( tagName );
				root.className = attributes.className || '';
				if ( attributes.anchor ) {
					root.id = attributes.anchor;
				}
				root.style.cssText = compileCSS( attributes.style ?? {} );
				if ( name !== 'core/image' ) {
					root.innerHTML = attributes.content;
					if ( attributes.direction ) {
						root.dir = attributes.direction;
					}
					return root.outerHTML;
				}
				const image = document.createElement( 'img' );
				image.setAttribute( 'src', attributes.url );
				image.alt = attributes.alt;
				if ( attributes.title ) {
					image.title = attributes.title;
				}
				if ( attributes.id ) {
					image.className = `wp-image-${ attributes.id }`;
				}
				for ( const [ property, key ] of Object.entries( {
					width: 'width',
					height: 'height',
					'aspect-ratio': 'aspectRatio',
					'object-fit': 'scale',
				} ) ) {
					if ( attributes[ key ] ) {
						image.style.setProperty( property, attributes[ key ] );
					}
				}
				if ( attributes.href ) {
					const link = document.createElement( 'a' );
					link.setAttribute( 'href', attributes.href );
					for ( const [ property, key ] of Object.entries( {
						target: 'linkTarget',
						rel: 'rel',
						class: 'linkClass',
					} ) ) {
						if ( attributes[ key ] ) {
							link.setAttribute( property, attributes[ key ] );
						}
					}
					link.append( image );
					root.append( link );
				} else {
					root.append( image );
				}
				if ( attributes.caption ) {
					const caption = document.createElement( 'figcaption' );
					caption.innerHTML = attributes.caption;
					root.append( caption );
				}
				return root.outerHTML;
			} ),
		};
	},
	{ virtual: true }
);

const htmlBlock = ( html ) => ( {
	name: 'core/html',
	attributes: {},
	innerContent: [ html ],
	innerBlocks: [],
} );
const all = { heading: true, paragraph: true, image: true };

describe( 'HTML conversion', () => {
	afterEach( () => jest.clearAllMocks() );

	it( 'preserves the shell, comments, whitespace, and unselected HTML exactly', () => {
		const before =
			'<SECTION data-layout="a" style="display:grid">\n<!-- note -->\n';
		const after =
			'\n<p data-note="keep">Not selected &amp; exact</p>\n<img src="keep.jpg" />\n</SECTION>';
		const result = convertHTML(
			htmlBlock(
				before +
					'<h3 class="title" id="intro">Hello <em>world</em></h3>' +
					after
			),
			{ heading: true }
		);
		expect( result.innerContent ).toEqual( [ before, null, after ] );
		expect( result.innerBlocks[ 0 ].attributes ).toMatchObject( {
			level: 3,
			className: 'title',
			anchor: 'intro',
			content: 'Hello <em>world</em>',
		} );
		expect( result.entries[ 0 ].text ).toBe( 'Hello world' );
	} );

	it( 'keeps existing child objects and their positions between unmatched fragments', () => {
		const existing = {
			clientId: 'existing',
			name: 'core/paragraph',
			attributes: { content: 'Existing' },
		};
		const block = {
			...htmlBlock( '' ),
			innerContent: [ '<div><h2>First</h2>', null, '<p>Last</p></div>' ],
			innerBlocks: [ existing ],
		};
		const result = convertHTML( block, all );
		expect( result.innerBlocks[ 1 ] ).toBe( existing );
		expect( result.innerContent ).toEqual( [
			'<div>',
			null,
			'',
			null,
			'',
			null,
			'</div>',
		] );
		expect( convertHTML( { ...block, ...result }, all ).counts ).toEqual( {
			heading: 0,
			paragraph: 0,
			image: 0,
		} );
	} );

	it( 'does not wrap an element around existing editable blocks', () => {
		const block = {
			...htmlBlock( '' ),
			innerContent: [ '<p>Before ', null, ' after</p>' ],
			innerBlocks: [ { clientId: 'existing' } ],
		};
		const result = convertHTML( block, all );
		expect( result.counts.paragraph ).toBe( 0 );
		expect( result.entries[ 0 ].notes ).toEqual( [
			{ code: 'contains-blocks' },
		] );
		expect( result.innerContent ).toEqual( block.innerContent );
	} );

	it( 'converts despite attribute loss and reports unsupported and invalid styles', () => {
		const result = convertHTML(
			htmlBlock(
				'<p class="lead" id="copy" data-label="test" style="color: red; font-size:18px; margin: 1px 2px; display:flex; unknown-property:x">Hello</p>'
			),
			all
		);
		expect( result.counts.paragraph ).toBe( 1 );
		expect( result.innerBlocks[ 0 ].attributes ).toMatchObject( {
			className: 'lead',
			anchor: 'copy',
			style: {
				color: { text: 'red' },
				typography: { fontSize: '18px' },
				spacing: {
					margin: {
						top: '1px',
						right: '2px',
						bottom: '1px',
						left: '2px',
					},
				},
			},
		} );
		expect( result.entries[ 0 ].notes ).toEqual(
			expect.arrayContaining( [
				{
					code: 'attributes-removed',
					tag: 'p',
					names: [ 'data-label' ],
				},
				{
					code: 'styles-removed',
					tag: 'p',
					names: [ 'display', 'unknown-property' ],
				},
			] )
		);
	} );

	it( 'reports lost important priorities even when the value is retained', () => {
		const result = convertHTML(
			htmlBlock( '<p style="font-size: 20px !important">Text</p>' ),
			all
		);
		expect( result.entries[ 0 ].notes ).toContainEqual( {
			code: 'styles-changed',
			tag: 'p',
			names: [ 'font-size' ],
		} );
	} );

	it( 'retains inline formatting and custom inline attributes', () => {
		const result = convertHTML(
			htmlBlock(
				'<p dir="rtl"><a href="/about" data-info="a">About</a><br><strong class="emphasis">Us</strong></p>'
			),
			all
		);
		expect( result.innerBlocks[ 0 ].attributes.direction ).toBe( 'rtl' );
		expect( result.innerBlocks[ 0 ].attributes.content ).toContain(
			'data-info="a"'
		);
		expect( result.entries[ 0 ].notes ).toEqual( [] );
		expect( result.entries[ 0 ].text ).toBe( 'About Us' );
	} );

	it( 'removes event and reserved RichText attributes while retaining safe formatting', () => {
		const result = convertHTML(
			htmlBlock(
				'<h2 onmouseover="run()"><span class="emphasis" style="color:red" data-info="keep" ONCLICK="run()" data-disable-rich-text-onclick="run()" data-rich-text-script="run()" is="custom-span">Heading</span></h2>'
			),
			all
		);
		expect( result.counts.heading ).toBe( 1 );
		expect( result.innerBlocks[ 0 ].attributes.content ).toBe(
			'<span class="emphasis" style="color:red" data-info="keep">Heading</span>'
		);
		expect( result.entries[ 0 ].notes ).toEqual(
			expect.arrayContaining( [
				{
					code: 'unsafe-attributes-removed',
					tag: 'h2',
					names: [ 'onmouseover' ],
				},
				{
					code: 'unsafe-attributes-removed',
					tag: 'span',
					names: [
						'onclick',
						'data-disable-rich-text-onclick',
						'data-rich-text-script',
						'is',
					],
				},
			] )
		);
	} );

	it.each( [
		'javascript:run()',
		'&#x6a;avascript:run()',
		'java&#10;script:run()',
		'data:text/html;base64,PHNjcmlwdD4=',
		'vbscript:run()',
	] )(
		'removes unsafe inline links after HTML entity decoding: %s',
		( url ) => {
			const result = convertHTML(
				htmlBlock(
					`<p><a href="${ url }" data-info="keep">Link</a></p>`
				),
				all
			);
			expect( result.counts.paragraph ).toBe( 1 );
			expect( result.innerBlocks[ 0 ].attributes.content ).toBe(
				'<a data-info="keep">Link</a>'
			);
			expect( result.entries[ 0 ].notes ).toContainEqual( {
				code: 'unsafe-urls-removed',
				tag: 'a',
				names: [ 'href' ],
			} );
		}
	);

	it( 'sanitizes image links, image events, and caption descendants before creating a block', () => {
		const result = convertHTML(
			htmlBlock(
				'<figure><a href="javascript:run()"><img src="photo.jpg" onerror="run()"></a><figcaption><em data-disable-rich-text-onmouseover="run()" onclick="run()">Caption</em><a href="data:text/html,test">Link</a></figcaption></figure>'
			),
			all
		);
		expect( result.counts.image ).toBe( 1 );
		expect( result.innerBlocks[ 0 ].attributes.href ).toBeUndefined();
		expect( result.innerBlocks[ 0 ].attributes.caption ).toBe(
			'<em>Caption</em><a>Link</a>'
		);
		expect( result.entries[ 0 ].notes ).toEqual(
			expect.arrayContaining( [
				{
					code: 'unsafe-attributes-removed',
					tag: 'img',
					names: [ 'onerror' ],
				},
				{
					code: 'unsafe-attributes-removed',
					tag: 'em',
					names: [ 'data-disable-rich-text-onmouseover', 'onclick' ],
				},
			] )
		);
		expect(
			getSaveContent( 'core/image', result.innerBlocks[ 0 ].attributes )
		).not.toMatch(
			/javascript:|data:|onerror|onclick|data-disable-rich-text-/
		);
	} );

	it.each( [ 'javascript:run()', 'data:text/html,test' ] )(
		'does not create an image block with an unsafe source URL: %s',
		( url ) => {
			const html = `<img src="${ url }"><p>Good</p>`;
			const result = convertHTML( htmlBlock( html ), all );
			expect( result.counts ).toEqual( {
				heading: 0,
				paragraph: 1,
				image: 0,
			} );
			expect( result.innerContent[ 0 ] ).toBe( `<img src="${ url }">` );
			expect( result.entries[ 0 ].notes ).toEqual( [
				{ code: 'unsafe-image-url' },
			] );
		}
	);

	it( 'does not sanitize unselected HTML, the shell, or existing blocks', () => {
		const existing = {
			clientId: 'existing',
			name: 'core/paragraph',
			attributes: { content: '<span data-label="keep">Existing</span>' },
		};
		const block = {
			...htmlBlock( '' ),
			innerContent: [
				'<div onclick="keep()"><p onclick="keep()">Unselected</p>',
				null,
				'<h2 onclick="remove()">Selected</h2></div>',
			],
			innerBlocks: [ existing ],
		};
		const result = convertHTML( block, { heading: true } );
		expect( result.innerContent ).toEqual( [
			block.innerContent[ 0 ],
			null,
			'',
			null,
			'</div>',
		] );
		expect( result.innerBlocks[ 0 ] ).toBe( existing );
		expect( result.innerBlocks[ 1 ].attributes.content ).toBe( 'Selected' );
	} );

	it.each( [
		'<p>Text<object data="payload.html"></object></p>',
		'<p>Text<custom-element></custom-element></p>',
		'<figure><img src="photo.jpg"><figcaption><input autofocus>Caption</figcaption></figure>',
		'<figure><img src="photo.jpg"><figcaption><svg><a href="payload">Caption</a></svg></figcaption></figure>',
	] )(
		'does not activate unsupported elements as editable text: %s',
		( html ) => {
			const result = convertHTML( htmlBlock( html ), all );
			expect( result.innerContent ).toEqual( [ html ] );
			expect( result.innerBlocks ).toEqual( [] );
			expect( result.entries[ 0 ].status ).toBe( 'failed' );
		}
	);

	it( 'creates linked images, preserves URLs, and reports moved and removed attributes', () => {
		const result = convertHTML(
			htmlBlock(
				'<div><a href="/large" class="link" target="_blank" rel="nofollow"><img src="/hero.jpg?size=2" alt="Hero" class="hero wp-image-42" id="photo" width="600" height="300" loading="eager" srcset="other.jpg 2x"></a></div>'
			),
			all
		);
		expect( result.innerContent ).toEqual( [ '<div>', null, '</div>' ] );
		expect( result.innerBlocks[ 0 ].attributes ).toMatchObject( {
			url: '/hero.jpg?size=2',
			alt: 'Hero',
			id: 42,
			href: '/large',
			linkClass: 'link',
			linkTarget: '_blank',
			rel: 'nofollow',
			anchor: 'photo',
			width: '600px',
			height: 'auto',
			aspectRatio: '600 / 300',
		} );
		expect( result.entries[ 0 ].notes ).toEqual(
			expect.arrayContaining( [
				{ code: 'image-wrapper' },
				{
					code: 'attribute-moved',
					tag: 'img',
					to: 'figure',
					names: [ 'class' ],
				},
				{
					code: 'attribute-moved',
					tag: 'img',
					to: 'figure',
					names: [ 'id' ],
				},
				{
					code: 'attributes-removed',
					tag: 'img',
					names: [ 'loading', 'srcset' ],
				},
			] )
		);
	} );

	it( 'replaces a figure as a whole and keeps its caption and root attributes', () => {
		const result = convertHTML(
			htmlBlock(
				'<figure class="photo" id="picture"><img src="photo.jpg" alt="Photo"><figcaption class="custom" data-x="a">A <em>caption</em></figcaption></figure>'
			),
			all
		);
		expect( result.innerBlocks ).toHaveLength( 1 );
		expect( result.innerBlocks[ 0 ].attributes ).toMatchObject( {
			className: 'photo',
			anchor: 'picture',
			caption: 'A <em>caption</em>',
		} );
		expect( result.entries[ 0 ].notes ).not.toContainEqual( {
			code: 'image-wrapper',
		} );
		expect( result.entries[ 0 ].notes ).toContainEqual( {
			code: 'attributes-removed',
			tag: 'figcaption',
			names: [ 'class', 'data-x' ],
		} );
	} );

	it( 'reports preserved image margin shorthand as moved rather than removed', () => {
		const result = convertHTML(
			htmlBlock( '<img src="photo.jpg" style="margin:4px 8px">' ),
			all
		);
		expect( result.entries[ 0 ].notes ).toContainEqual( {
			code: 'styles-moved',
			tag: 'img',
			names: [ 'margin' ],
		} );
		expect( result.entries[ 0 ].notes ).not.toContainEqual(
			expect.objectContaining( { code: 'styles-removed' } )
		);
	} );

	it( 'leaves mixed paragraphs, inline images, and complex pictures intact with reasons', () => {
		const html =
			'<p>Text<img src="inline.jpg"></p><picture><source srcset="large.jpg"><img src="small.jpg"></picture>';
		const result = convertHTML( htmlBlock( html ), all );
		expect( result.innerContent ).toEqual( [ html ] );
		expect( result.innerBlocks ).toEqual( [] );
		expect(
			result.entries.map( ( entry ) => entry.notes[ 0 ].code )
		).toEqual( [ 'mixed-text', 'inline-image', 'complex-image' ] );
	} );

	it( 'retains failed elements while converting the other selected elements', () => {
		const result = convertHTML(
			htmlBlock( '<h2>Good</h2><img alt="Missing"><p>Also good</p>' ),
			all
		);
		expect( result.counts ).toEqual( {
			heading: 1,
			paragraph: 1,
			image: 0,
		} );
		expect( result.innerContent ).toEqual( [
			'',
			null,
			'<img alt="Missing">',
			null,
			'',
		] );
		expect( result.entries[ 1 ].imageAlt ).toBe( 'Missing' );
		expect( result.entries[ 1 ].notes[ 0 ].code ).toBe(
			'missing-image-url'
		);
	} );

	it( 'retains unavailable blocks and errors without losing their HTML', () => {
		getBlockType.mockReturnValueOnce( undefined );
		getSaveContent.mockImplementationOnce( () => {
			throw new Error( 'Save failed' );
		} );
		const html = '<h2>Unavailable</h2><p>Failed</p><p>Good</p>';
		const result = convertHTML( htmlBlock( html ), all );
		expect( result.counts.paragraph ).toBe( 1 );
		expect( result.innerContent[ 0 ] ).toBe(
			'<h2>Unavailable</h2><p>Failed</p>'
		);
		expect( result.entries.map( ( entry ) => entry.status ) ).toEqual( [
			'failed',
			'failed',
			'converted',
		] );
	} );

	it( 'handles omitted paragraph closing tags without duplicating or changing siblings', () => {
		const result = convertHTML(
			htmlBlock( '<div><p>One<p>Two</div>' ),
			all
		);
		expect( result.counts.paragraph ).toBe( 2 );
		expect( result.innerContent ).toEqual( [
			'<div>',
			null,
			'',
			null,
			'</div>',
		] );
	} );
} );

describe( 'conversion source and labels', () => {
	it.each( [
		'https://example.com/photo.jpg',
		'http://example.com/photo.jpg',
		'//example.com/photo.jpg',
		'/photo.jpg',
		'photo.jpg?size=2#image',
	] )( 'retains web URLs in each supported context: %s', ( url ) => {
		for ( const context of [ 'image', 'link', 'preview' ] ) {
			expect( isSafeURL( url, context ) ).toBe( true );
		}
		expect( getPreviewURL( url ) ).toBe( url );
	} );

	it.each( [
		'javascript:run()',
		'\tjava\nscript:run()',
		'data:text/html;base64,PHNjcmlwdD4=',
		'data:image/svg+xml;base64,PHN2Zz4=',
		'vbscript:run()',
		'file:///photo.jpg',
		'http://[invalid',
		'',
	] )( 'rejects unsafe or unsupported URLs: %s', ( url ) => {
		for ( const context of [ 'image', 'link', 'preview' ] ) {
			expect( isSafeURL( url, context ) ).toBe( false );
		}
		expect( getPreviewURL( url ) ).toBeUndefined();
	} );

	it.each( [ 'mailto:hello@example.com', 'tel:+81123456789' ] )(
		'retains contact URLs for links only: %s',
		( url ) => {
			expect( isSafeURL( url, 'link' ) ).toBe( true );
			expect( isSafeURL( url, 'image' ) ).toBe( false );
			expect( getPreviewURL( url ) ).toBeUndefined();
		}
	);

	it( 'allows raster data and local blob images without exposing them as links or previews', () => {
		const origin = new URL( document.baseURI ).origin;
		for ( const url of [
			'data:image/png;base64,iVBORw0KGgo=',
			`blob:${ origin }/local-image`,
		] ) {
			expect( isSafeURL( url, 'image' ) ).toBe( true );
			expect( isSafeURL( url, 'link' ) ).toBe( false );
			expect( getPreviewURL( url ) ).toBeUndefined();
		}
		expect(
			isSafeURL( 'blob:https://external.example/photo', 'image' )
		).toBe( false );
	} );

	it( 'ignores markup-like text in scripts, styles, code, and templates', () => {
		const result = analyzeHTML(
			htmlBlock(
				'<script>"<p>Script</p>"</script><style>p { content: "<img>" }</style><pre><code><p>Code</p></code></pre><template><h2>Template</h2></template><p>Visible</p>'
			)
		);
		expect( result.candidates.map( ( item ) => item.text ) ).toEqual( [
			'Visible',
		] );
	} );

	it( 'does not confuse static comments with existing block markers', () => {
		const block = {
			...htmlBlock( '' ),
			innerContent: [
				'<!--unitone-html-inner-block:0--><div>',
				null,
				'<p>New</p></div>',
			],
			innerBlocks: [ { clientId: 'existing' } ],
		};
		const result = convertHTML( block, all );
		expect( result.innerContent[ 0 ] ).toBe(
			'<!--unitone-html-inner-block:0--><div>'
		);
		expect( result.innerBlocks[ 0 ] ).toBe( block.innerBlocks[ 0 ] );
	} );

	it( 'reads CSS declaration names without splitting strings, functions, or comments', () => {
		expect(
			getDeclaredStyleProperties(
				'color:red; /* note: ; */ --Label: "a;b"; background:url("data:image/png;a;b"); position:absolute; INVALID:x'
			)
		).toEqual( [
			'color',
			'--Label',
			'background',
			'position',
			'invalid',
		] );
	} );

	it( 'truncates by visible characters and preserves short labels', () => {
		const text = '👨‍👩‍👧‍👦'.repeat( 41 );
		expect( shortenText( text ) ).toBe( '👨‍👩‍👧‍👦'.repeat( 40 ) + '…' );
		expect( shortenText( 'Short' ) ).toBe( 'Short' );
	} );

	it( 'extracts decoded filenames without query strings or URL fragments', () => {
		expect(
			getImageFilename( '/uploads/%E7%94%BB%E5%83%8F.jpg?size=2#photo' )
		).toBe( '画像.jpg' );
		expect( getImageFilename( '/uploads/%invalid.jpg' ) ).toBe(
			'%invalid.jpg'
		);
		expect( getImageFilename( 'data:image/png;base64,abc' ) ).toBe( '' );
	} );
} );
