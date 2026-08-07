import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

const PROPERTY_FALLBACKS = {
	'background-color': [ 'background-color' ],
	'border-top-color': [ 'border-top-color', 'border-color' ],
	'border-right-color': [ 'border-right-color', 'border-color' ],
	'border-bottom-color': [ 'border-bottom-color', 'border-color' ],
	'border-left-color': [ 'border-left-color', 'border-color' ],
	'border-top-style': [ 'border-top-style', 'border-style' ],
	'border-right-style': [ 'border-right-style', 'border-style' ],
	'border-bottom-style': [ 'border-bottom-style', 'border-style' ],
	'border-left-style': [ 'border-left-style', 'border-style' ],
	'border-top-width': [ 'border-top-width', 'border-width' ],
	'border-right-width': [ 'border-right-width', 'border-width' ],
	'border-bottom-width': [ 'border-bottom-width', 'border-width' ],
	'border-left-width': [ 'border-left-width', 'border-width' ],
	'border-top-left-radius': [ 'border-top-left-radius', 'border-radius' ],
	'border-top-right-radius': [ 'border-top-right-radius', 'border-radius' ],
	'border-bottom-right-radius': [
		'border-bottom-right-radius',
		'border-radius',
	],
	'border-bottom-left-radius': [
		'border-bottom-left-radius',
		'border-radius',
	],
};

const CSS_VAR_BREAKPOINTS = {
	'@tablet': 'md',
	'@mobile': 'sm',
};

const removeEmptyValues = ( values ) =>
	Object.fromEntries(
		Object.entries( values ).filter(
			( [ , value ] ) => false !== value && null != value && '' !== value
		)
	);

const getCSSVarBreakpoint = ( breakpoint ) =>
	CSS_VAR_BREAKPOINTS[ breakpoint ] ?? breakpoint.replace( /^@/, '' );

/**
 * Returns the viewport media queries resolved by WordPress on the server.
 *
 * @return {Object} Media queries keyed by responsive style-state name.
 */
export function getViewportMediaQueries() {
	return window.unitoneViewportMediaQueries ?? {};
}

/**
 * Returns CSS vars used to move block styles to an inner element.
 *
 * @param {Object} style            Block style object.
 * @param {string} cssVarPrefix     CSS variable prefix after `--unitone--`.
 * @param {string} cssVarBreakpoint Responsive CSS variable breakpoint.
 * @return {Object} CSS variables and values.
 */
export function getBorderCSSVars( style, cssVarPrefix, cssVarBreakpoint = '' ) {
	const border = style?.border;
	const borderRadius = border?.radius;
	const variablePrefix = `--unitone--${
		cssVarBreakpoint ? `${ cssVarBreakpoint }-` : ''
	}${ cssVarPrefix }--`;

	return removeEmptyValues( {
		[ `${ variablePrefix }background-color` ]: getCSSValueFromRawStyle(
			style?.color?.background
		),
		[ `${ variablePrefix }border-color` ]: getCSSValueFromRawStyle(
			border?.color
		),
		[ `${ variablePrefix }border-top-color` ]: getCSSValueFromRawStyle(
			border?.top?.color
		),
		[ `${ variablePrefix }border-right-color` ]: getCSSValueFromRawStyle(
			border?.right?.color
		),
		[ `${ variablePrefix }border-bottom-color` ]: getCSSValueFromRawStyle(
			border?.bottom?.color
		),
		[ `${ variablePrefix }border-left-color` ]: getCSSValueFromRawStyle(
			border?.left?.color
		),
		[ `${ variablePrefix }border-style` ]: border?.style,
		[ `${ variablePrefix }border-top-style` ]: border?.top?.style,
		[ `${ variablePrefix }border-right-style` ]: border?.right?.style,
		[ `${ variablePrefix }border-bottom-style` ]: border?.bottom?.style,
		[ `${ variablePrefix }border-left-style` ]: border?.left?.style,
		[ `${ variablePrefix }border-width` ]: getCSSValueFromRawStyle(
			border?.width
		),
		[ `${ variablePrefix }border-top-width` ]: getCSSValueFromRawStyle(
			border?.top?.width
		),
		[ `${ variablePrefix }border-right-width` ]: getCSSValueFromRawStyle(
			border?.right?.width
		),
		[ `${ variablePrefix }border-bottom-width` ]: getCSSValueFromRawStyle(
			border?.bottom?.width
		),
		[ `${ variablePrefix }border-left-width` ]: getCSSValueFromRawStyle(
			border?.left?.width
		),
		[ `${ variablePrefix }border-radius` ]:
			null != borderRadius && 'object' !== typeof borderRadius
				? getCSSValueFromRawStyle( borderRadius )
				: undefined,
		[ `${ variablePrefix }border-top-left-radius` ]:
			getCSSValueFromRawStyle( borderRadius?.topLeft ),
		[ `${ variablePrefix }border-top-right-radius` ]:
			getCSSValueFromRawStyle( borderRadius?.topRight ),
		[ `${ variablePrefix }border-bottom-left-radius` ]:
			getCSSValueFromRawStyle( borderRadius?.bottomLeft ),
		[ `${ variablePrefix }border-bottom-right-radius` ]:
			getCSSValueFromRawStyle( borderRadius?.bottomRight ),
	} );
}

/**
 * Returns responsive CSS vars grouped by style-state name.
 *
 * @param {Object} style                Block style object.
 * @param {string} cssVarPrefix         CSS variable prefix after `--unitone--`.
 * @param {Object} viewportMediaQueries Media queries keyed by style-state name.
 * @return {Object} CSS vars keyed by responsive style-state name.
 */
export function getResponsiveBorderCSSVars(
	style,
	cssVarPrefix,
	viewportMediaQueries
) {
	return Object.keys( viewportMediaQueries ).reduce(
		( responsiveStyles, breakpoint ) => {
			const viewportStyle = getBorderCSSVars(
				style?.[ breakpoint ],
				cssVarPrefix,
				getCSSVarBreakpoint( breakpoint )
			);

			if ( Object.keys( viewportStyle ).length ) {
				responsiveStyles[ breakpoint ] = viewportStyle;
			}

			return responsiveStyles;
		},
		{}
	);
}

/**
 * Returns responsive CSS that applies inner element style variables.
 *
 * @param {Object} settings                      CSS generation settings.
 * @param {string} settings.identifier           Block instance CSS class.
 * @param {string} settings.blockSelector        Block root selector.
 * @param {string} settings.innerSelector        Inner element selector.
 * @param {string} settings.cssVarPrefix         CSS variable prefix.
 * @param {Object} settings.responsiveStyles     CSS vars keyed by state name.
 * @param {Object} settings.viewportMediaQueries Media queries keyed by state name.
 * @return {string} Responsive CSS.
 */
export function getResponsiveStyleCSS( {
	identifier,
	blockSelector,
	innerSelector,
	cssVarPrefix,
	responsiveStyles,
	viewportMediaQueries,
} ) {
	const scopedSelector = `${ blockSelector }.${ identifier }`;

	return Object.entries( responsiveStyles )
		.map( ( [ breakpoint ] ) => {
			const mediaQuery = viewportMediaQueries?.[ breakpoint ];
			if ( ! mediaQuery ) {
				return '';
			}

			const cssVarBreakpoint = getCSSVarBreakpoint( breakpoint );
			const declarations = Object.entries( PROPERTY_FALLBACKS )
				.map( ( [ property, fallbacks ] ) => {
					let value = `var(--unitone--${ cssVarPrefix }--${ fallbacks[ 0 ] })`;

					[ ...fallbacks ].reverse().forEach( ( fallback ) => {
						value = `var(--unitone--${ cssVarBreakpoint }-${ cssVarPrefix }--${ fallback }, ${ value })`;
					} );

					return `${ property }:${ value };`;
				} )
				.join( '' );

			return `${ mediaQuery }{${ scopedSelector }{background-color:transparent!important;border:none!important;}${ scopedSelector } ${ innerSelector }{${ declarations }}}`;
		} )
		.join( '' );
}
