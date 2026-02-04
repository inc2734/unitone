import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { itemWidth, duration, reverse, pauseOnHover } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				style: {
					'--unitone--animation-duration': !! duration
						? `${ duration }s`
						: undefined,
					'--unitone--item-width': itemWidth || undefined,
				},
				'data-unitone-layout': clsx( 'marquee-wrapper', {
					'-reverse': reverse,
					'-pause-on-hover': pauseOnHover,
				} ),
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					'data-unitone-layout': 'marquee',
				} ) }
			/>
		</div>
	);
}
