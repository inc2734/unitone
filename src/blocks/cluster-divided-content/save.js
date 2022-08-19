import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<div
			{ ...useBlockProps.save( {
				'data-unitone-layout': 'cluster__content',
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					'data-unitone-layout': 'cluster__content__content',
				} ) }
			/>
		</div>
	);
}
