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

const BLOCK_SELECTOR = '.wp-block-tag-cloud';
const INNER_SELECTOR = 'a.tag-cloud-link';
const CSS_VAR_PREFIX = 'tag-cloud';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, wrapperProps } = props;

		const className = attributes?.className;
		if (
			'core/tag-cloud' !== props.name ||
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
	'unitone/tagCloud/useBlockProps',
	useBlockProps
);
