import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import { getStyle } from './config';

export default function ( { attributes } ) {
	const { settings } = attributes;

	const blockProps = useBlockProps.save( {
		className: 'unitone-swiper',
		style: getStyle( settings ),
		role: 'region',
		'aria-label': 'Carousel',
		'aria-roledescription': 'carousel',
		'data-unitone-swiper-settings': JSON.stringify( settings || {} ),
	} );

	return <div { ...useInnerBlocksProps.save( blockProps ) } />;
}
