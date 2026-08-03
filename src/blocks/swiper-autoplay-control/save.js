import clsx from 'clsx';

import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { action, content } = attributes;

	const blockProps = useBlockProps.save( {
		className: clsx(
			'unitone-swiper-autoplay-control',
			`unitone-swiper-autoplay-control--${ action }`
		),
		type: 'button',
		'data-unitone-swiper-autoplay-action': action,
	} );

	return (
		<button { ...blockProps }>
			<RichText.Content tagName="span" value={ content } />
		</button>
	);
}
