import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

const saveProp = ( extraProps, blockType, attributes ) => {
	if ( 'core/post-terms' !== blockType ) {
		return extraProps;
	}

	const className = attributes?.className;
	if (
		! className ||
		( -1 === className.indexOf( 'is-style-badge' ) &&
			-1 === className.indexOf( 'is-style-outline' ) )
	) {
		return extraProps;
	}

	return {
		...extraProps,
		style: {
			...extraProps?.style,
			'--unitone--post-term--background-color':
				!! attributes?.backgroundColor
					? `var(--wp--preset--color--${ attributes?.backgroundColor })`
					: attributes?.style?.color?.background,

			'--unitone--post-term--border-color': !! attributes?.borderColor
				? `var(--wp--preset--color--${ attributes?.borderColor })`
				: attributes?.style?.border?.color,
			'--unitone--post-term--border-top-color': getCSSValueFromRawStyle(
				attributes?.style?.border?.top?.color
			),
			'--unitone--post-term--border-right-color': getCSSValueFromRawStyle(
				attributes?.style?.border?.right?.color
			),
			'--unitone--post-term--border-bottom-color':
				getCSSValueFromRawStyle(
					attributes?.style?.border?.bottom?.color
				),
			'--unitone--post-term--border-left-color': getCSSValueFromRawStyle(
				attributes?.style?.border?.left?.color
			),

			'--unitone--post-term--border-style':
				attributes?.style?.border?.style,
			'--unitone--post-term--border-top-style':
				attributes?.style?.border?.top?.style,
			'--unitone--post-term--border-right-style':
				attributes?.style?.border?.right?.style,
			'--unitone--post-term--border-bottom-style':
				attributes?.style?.border?.bottom?.style,
			'--unitone--post-term--border-left-style':
				attributes?.style?.border?.left?.style,

			'--unitone--post-term--border-width':
				attributes?.style?.border?.width,
			'--unitone--post-term--border-top-width':
				attributes?.style?.border?.top?.width,
			'--unitone--post-term--border-right-width':
				attributes?.style?.border?.right?.width,
			'--unitone--post-term--border-bottom-width':
				attributes?.style?.border?.bottom?.width,
			'--unitone--post-term--border-left-width':
				attributes?.style?.border?.left?.width,

			'--unitone--post-term--border-radius':
				null != attributes?.style?.border?.radius &&
				'object' !== typeof attributes?.style?.border?.radius
					? attributes?.style?.border?.radius
					: undefined,
			'--unitone--post-term--border-top-left-radius':
				attributes?.style?.border?.radius?.topLeft,
			'--unitone--post-term--border-top-right-radius':
				attributes?.style?.border?.radius?.topRight,
			'--unitone--post-term--border-bottom-left-radius':
				attributes?.style?.border?.radius?.bottomLeft,
			'--unitone--post-term--border-bottom-right-radius':
				attributes?.style?.border?.radius?.bottomRright,
		},
	};
};

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		props = {
			...props,
			wrapperProps: {
				...props.wrapperProps,
				...saveProp( wrapperProps, name, attributes ),
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/postTerms/useBlockProps',
	useBlockProps
);
