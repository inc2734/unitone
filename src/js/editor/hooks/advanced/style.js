import {
	Notice,
	TextareaControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { transformStyles } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function useIsStyleDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.style' );
}

export function resetStyleFilter() {
	return {
		style: undefined,
		instanceId: undefined,
	};
}

// @see https://github.com/WordPress/gutenberg/pull/63656
// When useStyleOverride() becomes available, replace it with it.
export function StyleTag( { unitone } ) {
	if ( ! unitone?.style || ! unitone?.instanceId ) {
		return null;
	}

	const rawCSS = unitone.style
		.replace( /\r?\n\s*/g, ' ' )
		.replace( /\s*\{\s*/g, ' { ' )
		.replace( /\s*;\s*/g, '; ' )
		.replace( /\s*\}\s*/g, ' }' )
		.replace( /\}\s*/g, '}\n' )
		.trim();

	const blockRegex =
		/(@[^{]+\{(?:[^{}]*\{[^{}]*\}[^{}]*)*\})|(&[^{]+\{[^}]*\})/gs;
	const matches = [ ...rawCSS.matchAll( blockRegex ) ];

	let filteredCSS = matches
		.map( ( match ) => match[ 0 ] )
		.filter( ( block ) => {
			if ( block.startsWith( '@' ) ) {
				return /{[^{}]*&[^{]+\{[^}]*\}/s.test( block );
			}
			return block.trim().startsWith( '&' );
		} )
		.join( ' ' );

	filteredCSS = filteredCSS.replace(
		/(&)(?=[^{]*\{)/g,
		`[data-unitone-instance-id="${ unitone.instanceId }"]`
	);

	return <style>{ filteredCSS }</style>;
}

// @see https://github.com/WordPress/gutenberg/blob/a55c62c5c810c84258afcdac7da1a7019a69b332/packages/block-editor/src/components/global-styles/advanced-panel.js
export function StyleEdit( {
	attributes: { unitone },
	setAttributes,
	clientId,
} ) {
	const [ cssError, setCSSError ] = useState( null );
	const [ instanceId, setInstanceId ] = useState( clientId );

	useEffect( () => {
		setInstanceId( clientId );
	}, [ clientId, unitone?.style ] );

	function handleOnChange( newValue ) {
		let customCSS = newValue ?? undefined;

		if ( !! customCSS ) {
			const dummy = document.createElement( 'div' );
			dummy.innerHTML = customCSS;
			customCSS = dummy.innerText;
		}

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				style: customCSS || undefined,
				instanceId: !! customCSS ? instanceId : undefined,
			} ),
		} );

		if ( ! customCSS ) {
			return;
		}

		if ( cssError ) {
			// Check if the new value is valid CSS, and pass a wrapping selector
			// to ensure that `transformStyles` validates the CSS. Note that the
			// wrapping selector here is not used in the actual output of any styles.
			const [ transformed ] = transformStyles(
				[ { css: newValue } ],
				'.for-validation-only'
			);
			if ( transformed ) {
				setCSSError( null );
			}
		}
	}

	function formatCSS( input ) {
		const lines = [];
		let indentLevel = 0;
		const indentStr = '  ';
		let buffer = '';
		const blockStack = [];

		// Collapse consecutive spaces/tabs ONLY outside of quoted strings.
		function collapseSpacesOutsideStrings( s ) {
			let out = '';
			let inSingle = false;
			let inDouble = false;
			let escaped = false;
			let pendingSpace = false;

			for ( let i = 0; i < s.length; i++ ) {
				const ch = s[ i ];

				if ( escaped ) {
					// Keep escaped char as-is and clear escape state
					out += ch;
					escaped = false;
					continue;
				}
				if ( ch === '\\' ) {
					// Preserve escape and mark next char as escaped
					out += ch;
					escaped = true;
					continue;
				}
				if ( ! inDouble && ch === "'" ) {
					inSingle = ! inSingle;
					out += ch;
					continue;
				}
				if ( ! inSingle && ch === '"' ) {
					inDouble = ! inDouble;
					out += ch;
					continue;
				}

				// Outside quotes: compress runs of space/tab to a single space
				if (
					! inSingle &&
					! inDouble &&
					( ch === ' ' || ch === '\t' )
				) {
					pendingSpace = true;
					continue;
				}

				// Flush one space if there was a pending run
				if ( pendingSpace ) {
					out += ' ';
					pendingSpace = false;
				}

				out += ch;
			}

			// If the string ends with a run of spaces/tabs, emit a single space
			if ( pendingSpace ) {
				out += ' ';
			}
			return out;
		}

		const pushLine = ( line ) => {
			const trimmed = line.trim();
			if ( trimmed !== '' ) {
				lines.push( indentStr.repeat( indentLevel ) + trimmed );
			}
		};

		for ( let i = 0; i < input.length; i++ ) {
			const char = input[ i ];

			if ( char === '{' ) {
				const trimmed = buffer.trim();
				const isAtRule = /^@/.test( trimmed );
				blockStack.push( isAtRule );
				pushLine( trimmed + ' {' );
				buffer = '';
				indentLevel++;
			} else if ( char === '}' ) {
				pushLine( buffer );
				buffer = '';
				indentLevel--;
				pushLine( '}' );
				blockStack.pop();
			} else if ( char === ';' ) {
				pushLine( buffer.trim() + ';' );
				buffer = '';
			} else if ( char === '\n' || char === '\r' ) {
				continue;
			} else {
				buffer += char;
			}
		}

		if ( buffer.trim() ) {
			pushLine( buffer );
		}

		let formatted = lines.join( '\n' );

		// Format only declaration lines. Do not touch ':' inside values (e.g., URLs).
		formatted = formatted
			.split( '\n' )
			.map( ( line ) => {
				const trimmed = line.trim();

				// Leave selector lines, block starts, and at-rules untouched
				if ( trimmed.endsWith( '{' ) || trimmed.startsWith( '@' ) ) {
					return line;
				}

				// Process declaration lines (must end with ;)
				if ( trimmed.endsWith( ';' ) && trimmed.includes( ':' ) ) {
					// Preserve leading indentation
					const leading = ( line.match( /^\s*/ ) || [ '' ] )[ 0 ];
					// Split at the first colon only
					const firstColonIdx = trimmed.indexOf( ':' );
					const prop = trimmed.slice( 0, firstColonIdx ).trim();
					let value = trimmed.slice( firstColonIdx + 1 ).trim();

					// Collapse consecutive spaces/tabs outside quoted strings
					value = collapseSpacesOutsideStrings( value );

					// Normalize to "prop: value;"
					return `${ leading }${ prop }: ${ value }`;
				}

				return line;
			} )
			.join( '\n' );

		// Ensure a single space before !important
		formatted = formatted.replace( /\s*!important/g, ' !important' );

		// Normalize conditions inside @media or @supports
		formatted = formatted.replace(
			/@([a-z\-]+)(\s*)\(([^)]+?)\)/gi,
			( _, atRule, space, conditions ) => {
				const cleanConditions = conditions
					.split( /\s+and\s+/i )
					.map( ( cond ) => cond.replace( /\s*:\s*/g, ': ' ).trim() )
					.join( ' and ' );
				return `@${ atRule }${ space }(${ cleanConditions })`;
			}
		);

		// Insert blank lines before top-level selectors or at-rules for readability
		const formattedLines = formatted.split( '\n' );
		const resultLines = [];

		for ( let i = 0; i < formattedLines.length; i++ ) {
			const current = formattedLines[ i ].trim();
			const previous = formattedLines[ i - 1 ]?.trim() || '';

			const isSelector = /^[.#&a-zA-Z]/.test( current );
			const isAtRule = /^@/.test( current );
			const prevIsBrace = previous === '}';

			if ( i > 0 && prevIsBrace && ( isSelector || isAtRule ) ) {
				resultLines.push( '' );
			}

			resultLines.push( formattedLines[ i ] );
		}

		return resultLines.join( '\n' ).trimEnd();
	}

	function handleOnBlur( event ) {
		const customCSS = formatCSS( event?.target?.value );

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				style: customCSS || undefined,
				instanceId: !! customCSS ? instanceId : undefined,
			} ),
		} );

		if ( ! customCSS ) {
			setCSSError( null );
			return;
		}

		// Check if the new value is valid CSS, and pass a wrapping selector
		// to ensure that `transformStyles` validates the CSS. Note that the
		// wrapping selector here is not used in the actual output of any styles.
		const [ transformed ] = transformStyles(
			[ { css: customCSS } ],
			'.for-validation-only'
		);

		setCSSError(
			transformed === null
				? __( 'There is an error with your CSS structure.' )
				: null
		);
	}

	return (
		<VStack spacing={ 3 }>
			{ cssError && (
				<Notice status="error" onRemove={ () => setCSSError( null ) }>
					{ cssError }
				</Notice>
			) }

			<TextareaControl
				__nextHasNoMarginBottom
				label={ __( 'Additional CSS' ) }
				help={ `${ __(
					'Add your own CSS to customize the appearance of this block.',
					'unitone'
				) } ${ __(
					'Using "&" as a selector acts as a unique selector that applies only to this block.',
					'unitone'
				) } ${ __(
					'Selectors and CSS beginning with anything other than "&" are ignored.',
					'unitone'
				) }` }
				value={ unitone?.style ?? undefined }
				onChange={ handleOnChange }
				onBlur={ handleOnBlur }
				className="block-editor-global-styles-advanced-panel__custom-css-input"
				spellCheck={ false }
				rows={ 6 }
			/>
		</VStack>
	);
}

export function saveStyleProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.style' ) ) {
		return extraProps;
	}

	return {
		...extraProps,
		'data-unitone-instance-id': attributes?.unitone?.instanceId,
	};
}

export function withStyleBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveStyleProp( wrapperProps, name, attributes ),
		},
	};
}
