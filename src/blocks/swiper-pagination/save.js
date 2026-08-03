import { useBlockProps } from '@wordpress/block-editor';

import { getDataSettings, getStyle } from './config';

export default function ( { attributes } ) {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'unitone-swiper-pagination swiper-pagination',
				style: getStyle( attributes.settings ),
				'data-unitone-swiper-pagination': JSON.stringify(
					getDataSettings( attributes.settings )
				),
			} ) }
		/>
	);
}
