import clsx from 'clsx';

import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { action, content } = attributes;

	const blockProps = useBlockProps.save( {
		className: clsx(
			'unitone-swiper-arrow',
			`unitone-swiper-arrow--${ action }`,
			`swiper-button-${ 'next' === action ? 'next' : 'prev' }`
		),
		type: 'button',
	} );

	return (
		<button { ...blockProps }>
			<RichText.Content tagName="span" value={ content } />
		</button>
	);
}
