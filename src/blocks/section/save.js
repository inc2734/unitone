import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function () {
	return (
		<section
			{ ...useBlockProps.save( {
				className: 'unitone-section',
			} ) }
		>
			<div data-unitone-layout="gutters">
				<div data-unitone-layout="container">
					<div
						{ ...useInnerBlocksProps.save( {
							'data-unitone-layout': 'stack',
						} ) }
					/>
				</div>
			</div>
		</section>
	);
}
