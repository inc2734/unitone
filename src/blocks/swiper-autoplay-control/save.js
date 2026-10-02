import clsx from 'clsx';

import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function ( { attributes } ) {
	const { action, content, playContent, pauseContent } = attributes;

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
			{ 'toggle' === action ? (
				<>
					<RichText.Content
						tagName="span"
						className="unitone-swiper-autoplay-control__play"
						value={ playContent || __( 'Play', 'unitone' ) }
					/>
					<RichText.Content
						tagName="span"
						className="unitone-swiper-autoplay-control__pause"
						value={ pauseContent || __( 'Stop', 'unitone' ) }
					/>
				</>
			) : (
				<RichText.Content tagName="span" value={ content } />
			) }
		</button>
	);
}
