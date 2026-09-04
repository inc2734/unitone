import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { getBackgroundCSSVariables } from '../../js/utils/background';

export default function ( { attributes } ) {
	const { tagName } = attributes;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		className: 'unitone-flex__content',
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			...getBackgroundCSSVariables( attributes ),
		},
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'unitone-flex__content__content',
	} );

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
