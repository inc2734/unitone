import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { autoplayDelay, width } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'unitone-swiper__slide swiper-slide',
		style: {
			'--unitone--slide-width': width || undefined,
		},
		'data-swiper-autoplay': 0 < autoplayDelay ? autoplayDelay : undefined,
	} );

	return <div { ...useInnerBlocksProps.save( blockProps ) } />;
}
