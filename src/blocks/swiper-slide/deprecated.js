import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import metadata from './block.json';

export default [
	{
		attributes: metadata.attributes,
		supports: metadata.supports,

		save( { attributes } ) {
			const { autoplayDelay, width } = attributes;

			const blockProps = useBlockProps.save( {
				className: 'unitone-swiper__slide swiper-slide',
				style: {
					width: width || undefined,
				},
				'data-swiper-autoplay':
					0 < autoplayDelay ? autoplayDelay : undefined,
			} );

			return <div { ...useInnerBlocksProps.save( blockProps ) } />;
		},
	},
];
