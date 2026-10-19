import { hasBlockSupport } from '@wordpress/blocks';

const STYLE_PROPERTIES = {
	color: [ 'color.text', 'color.text' ],
	'background-color': [ 'color.background', 'color.background' ],
	'font-size': [ 'typography.fontSize', 'typography.fontSize' ],
	'font-family': [
		'typography.fontFamily',
		'typography.__experimentalFontFamily',
	],
	'font-weight': [
		'typography.fontWeight',
		'typography.__experimentalFontWeight',
	],
	'font-style': [
		'typography.fontStyle',
		'typography.__experimentalFontStyle',
	],
	'line-height': [ 'typography.lineHeight', 'typography.lineHeight' ],
	'letter-spacing': [
		'typography.letterSpacing',
		'typography.__experimentalLetterSpacing',
	],
	'text-align': [ 'typography.textAlign', 'typography.textAlign' ],
	'text-decoration': [
		'typography.textDecoration',
		'typography.__experimentalTextDecoration',
	],
	'text-transform': [
		'typography.textTransform',
		'typography.__experimentalTextTransform',
	],
	'writing-mode': [
		'typography.writingMode',
		'typography.__experimentalWritingMode',
	],
	'border-color': [ 'border.color', '__experimentalBorder.color' ],
	'border-width': [ 'border.width', '__experimentalBorder.width' ],
	'border-style': [ 'border.style', '__experimentalBorder.style' ],
	'border-radius': [ 'border.radius', '__experimentalBorder.radius' ],
	'box-shadow': [ 'shadow', 'shadow' ],
};

const setPath = ( object, path, value ) => {
	const parts = path.split( '.' );
	const key = parts.pop();

	const parent = parts.reduce( ( current, part ) => {
		current[ part ] ??= {};
		return current[ part ];
	}, object );

	parent[ key ] = value;
};

// Keep unsupported declarations in the diagnostics, including declarations that
// CSSStyleDeclaration discards. Semicolons in strings and functions are content.
export function getDeclaredStyleProperties( style ) {
	const properties = new Set();
	let declaration = '';
	let quote = '';
	let depth = 0;

	const add = () => {
		const separator = declaration.indexOf( ':' );
		if ( separator > 0 ) {
			const property = declaration.slice( 0, separator ).trim();
			properties.add(
				property.startsWith( '--' ) ? property : property.toLowerCase()
			);
		}

		declaration = '';
	};

	for ( let index = 0; index < style.length; index++ ) {
		const character = style[ index ];
		if ( character === '\\' ) {
			declaration += character + ( style[ ++index ] ?? '' );
			continue;
		}

		if ( quote ) {
			if ( character === quote ) {
				quote = '';
			}
		} else if ( character === '/' && style[ index + 1 ] === '*' ) {
			const end = style.indexOf( '*/', index + 2 );
			index = end === -1 ? style.length : end + 1;
			continue;
		} else if ( character === '"' || character === "'" ) {
			quote = character;
		} else if ( character === '(' ) {
			depth++;
		} else if ( character === ')' ) {
			depth--;
		} else if ( character === ';' && depth === 0 ) {
			add();
			continue;
		}
		declaration += character;
	}

	add();

	return Array.from( properties );
}

export function applyStyles( element, blockName, attributes ) {
	const properties = getDeclaredStyleProperties(
		element.getAttribute( 'style' ) ?? ''
	);

	for ( const property of properties ) {
		const value = element.style.getPropertyValue( property );
		if ( ! value ) {
			continue;
		}

		if ( blockName === 'core/image' ) {
			const imageProperties = {
				width: 'width',
				height: 'height',
				'aspect-ratio': 'aspectRatio',
				'object-fit': 'scale',
			};

			if ( imageProperties[ property ] && element.tagName === 'IMG' ) {
				attributes[ imageProperties[ property ] ] = value;
				continue;
			}
		}

		const spacing = /^(margin|padding)(?:-(top|right|bottom|left))?$/.exec(
			property
		);

		if (
			spacing &&
			hasBlockSupport( blockName, `spacing.${ spacing[ 1 ] }` )
		) {
			for ( const side of [ 'top', 'right', 'bottom', 'left' ] ) {
				const sideValue = element.style.getPropertyValue(
					`${ spacing[ 1 ] }-${ side }`
				);

				if ( sideValue ) {
					attributes.style ??= {};
					setPath(
						attributes.style,
						`spacing.${ spacing[ 1 ] }.${ side }`,
						sideValue
					);
				}
			}
			continue;
		}

		const mapping = STYLE_PROPERTIES[ property ];
		const defaultSupport =
			[ 'color.text', 'color.background' ].includes( mapping?.[ 1 ] ) &&
			hasBlockSupport( blockName, 'color' );

		if (
			mapping &&
			hasBlockSupport( blockName, mapping[ 1 ], defaultSupport )
		) {
			attributes.style ??= {};
			setPath( attributes.style, mapping[ 0 ], value );
		}
	}
}
