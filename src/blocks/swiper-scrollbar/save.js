import { useBlockProps } from '@wordpress/block-editor';

import { getDataSettings, getStyle } from './config';

export default function ( { attributes } ) {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'unitone-swiper-scrollbar swiper-scrollbar',
				style: getStyle( attributes.settings ),
				'data-unitone-swiper-scrollbar': JSON.stringify(
					getDataSettings( attributes.settings )
				),
			} ) }
		/>
	);
}
