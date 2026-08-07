import clsx from 'clsx';

import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

import { StyleOverride } from '../hooks/utils';

import {
	getBorderCSSVars,
	getResponsiveStyleCSS,
	getResponsiveBorderCSSVars,
	getViewportMediaQueries,
} from './border-css-vars';

const BLOCK_SELECTOR = '.wp-block-post-terms';
const INNER_SELECTOR =
	':is(a:where(:not(.wp-element-button)),span:where(:not([class]):not([data-rich-text-placeholder])))';
const CSS_VAR_PREFIX = 'post-term';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, wrapperProps } = props;

		const className = attributes?.className;
		if (
			'core/post-terms' !== props.name ||
			! className ||
			( -1 === className.indexOf( 'is-style-badge' ) &&
				-1 === className.indexOf( 'is-style-outline' ) )
		) {
			return <BlockListBlock { ...props } />;
		}

		const viewportMediaQueries = getViewportMediaQueries();
		const style = getBorderCSSVars( attributes?.style, CSS_VAR_PREFIX );
		if ( attributes?.backgroundColor ) {
			style[
				`--unitone--${ CSS_VAR_PREFIX }--background-color`
			] = `var(--wp--preset--color--${ attributes.backgroundColor })`;
		}
		if ( attributes?.borderColor ) {
			style[
				`--unitone--${ CSS_VAR_PREFIX }--border-color`
			] = `var(--wp--preset--color--${ attributes.borderColor })`;
		}

		const responsiveStyles = getResponsiveBorderCSSVars(
			attributes?.style,
			CSS_VAR_PREFIX,
			viewportMediaQueries
		);
		Object.assign( style, ...Object.values( responsiveStyles ) );

		const identifier = `unitone-responsive-style-${ props.clientId }`;
		const responsiveCSS = getResponsiveStyleCSS( {
			identifier,
			blockSelector: BLOCK_SELECTOR,
			innerSelector: INNER_SELECTOR,
			cssVarPrefix: CSS_VAR_PREFIX,
			responsiveStyles,
			viewportMediaQueries,
		} );

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				className: clsx( wrapperProps?.className, {
					[ identifier ]: !! responsiveCSS,
				} ),
				style: {
					...wrapperProps?.style,
					...style,
				},
			},
		};

		return (
			<>
				<BlockListBlock { ...props } />

				{ responsiveCSS && (
					<StyleOverride
						id={ `${ identifier }-style` }
						css={ responsiveCSS }
					/>
				) }
			</>
		);
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/postTerms/useBlockProps',
	useBlockProps
);
