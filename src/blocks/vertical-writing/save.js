import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { textOrientation } = attributes;

	return (
		<div
			{ ...useBlockProps.save( {
				'data-unitone-layout': 'vertical-writing-wrapper',
			} ) }
		>
			<div
				{ ...useInnerBlocksProps.save( {
					'data-unitone-layout': classnames( 'vertical-writing', {
						[ `-text-orientation:${ textOrientation }` ]:
							!! textOrientation,
					} ),
				} ) }
			/>
		</div>
	);
}
