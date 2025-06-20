import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { getCSSValueFromRawStyle } from '@wordpress/style-engine';

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

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				style: {
					...wrapperProps?.style,
					'--unitone--tag-cloud--background-color':
						!! attributes?.backgroundColor
							? `var(--wp--preset--color--${ attributes?.backgroundColor })`
							: attributes?.style?.color?.background,

					'--unitone--tag-cloud--border-color':
						!! attributes?.borderColor
							? `var(--wp--preset--color--${ attributes?.borderColor })`
							: attributes?.style?.border?.color,
					'--unitone--tag-cloud--border-top-color':
						getCSSValueFromRawStyle(
							attributes?.style?.border?.top?.color
						),
					'--unitone--tag-cloud--border-right-color':
						getCSSValueFromRawStyle(
							attributes?.style?.border?.right?.color
						),
					'--unitone--tag-cloud--border-bottom-color':
						getCSSValueFromRawStyle(
							attributes?.style?.border?.bottom?.color
						),
					'--unitone--tag-cloud--border-left-color':
						getCSSValueFromRawStyle(
							attributes?.style?.border?.left?.color
						),

					'--unitone--tag-cloud--border-style':
						attributes?.style?.border?.style,
					'--unitone--tag-cloud--border-top-style':
						attributes?.style?.border?.top?.style,
					'--unitone--tag-cloud--border-right-style':
						attributes?.style?.border?.right?.style,
					'--unitone--tag-cloud--border-bottom-style':
						attributes?.style?.border?.bottom?.style,
					'--unitone--tag-cloud--border-left-style':
						attributes?.style?.border?.left?.style,

					'--unitone--tag-cloud--border-width':
						attributes?.style?.border?.width,
					'--unitone--tag-cloud--border-top-width':
						attributes?.style?.border?.top?.width,
					'--unitone--tag-cloud--border-right-width':
						attributes?.style?.border?.right?.width,
					'--unitone--tag-cloud--border-bottom-width':
						attributes?.style?.border?.bottom?.width,
					'--unitone--tag-cloud--border-left-width':
						attributes?.style?.border?.left?.width,

					'--unitone--tag-cloud--border-radius':
						null != attributes?.style?.border?.radius &&
						'object' !== typeof attributes?.style?.border?.radius
							? attributes?.style?.border?.radius
							: undefined,
					'--unitone--tag-cloud--border-top-left-radius':
						attributes?.style?.border?.radius?.topLeft,
					'--unitone--tag-cloud--border-top-right-radius':
						attributes?.style?.border?.radius?.topRight,
					'--unitone--tag-cloud--border-bottom-left-radius':
						attributes?.style?.border?.radius?.bottomLeft,
					'--unitone--tag-cloud--border-bottom-right-radius':
						attributes?.style?.border?.radius?.bottomRight,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/tagCloud/useBlockProps',
	useBlockProps
);
