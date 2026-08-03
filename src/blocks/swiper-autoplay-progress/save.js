import clsx from 'clsx';

import { useBlockProps } from '@wordpress/block-editor';

import { getStyle, resolveSettings } from './config';

export default function ( { attributes } ) {
	const settings = resolveSettings( attributes.settings );

	return (
		<div
			{ ...useBlockProps.save( {
				className: clsx(
					'unitone-swiper-autoplay-progress',
					`unitone-swiper-autoplay-progress--${ settings.type }`
				),
				style: getStyle( attributes.settings ),
				'aria-hidden': true,
			} ) }
		>
			<div className="unitone-swiper-autoplay-progress__track">
				<span className="unitone-swiper-autoplay-progress__fill" />
			</div>
		</div>
	);
}
