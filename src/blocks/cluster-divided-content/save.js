import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { getBackgroundGradientCSSValue } from '../../js/utils/background';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			'--unitone--background-image':
				getBackgroundGradientCSSValue( attributes ),
		},
		'data-unitone-layout': 'cluster__content',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		'data-unitone-layout': 'cluster__content__content',
	} );

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
