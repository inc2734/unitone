import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function SwiperTrackSave() {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'unitone-swiper-track',
			} ) }
		>
			<div className="unitone-swiper-track__viewport swiper">
				<div
					{ ...useInnerBlocksProps.save( {
						className:
							'unitone-swiper-track__wrapper swiper-wrapper',
					} ) }
				/>
			</div>
		</div>
	);
}
