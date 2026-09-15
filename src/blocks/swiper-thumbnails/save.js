import { useBlockProps } from '@wordpress/block-editor';

export default function ( { attributes: { columnMinWidth } } ) {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'unitone-swiper-thumbnails',
				style: {
					'--unitone--column-min-width': columnMinWidth || undefined,
				},
			} ) }
		/>
	);
}
