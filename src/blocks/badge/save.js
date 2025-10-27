import clsx from 'clsx';

import {
	useBlockProps,
	RichText,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
} from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const { content, shape, minHeight } = attributes;

	const backgroundColorProps = getColorClassesAndStyles( {
		backgroundColor: attributes?.backgroundColor,
		style: {
			color: {
				background: attributes?.style?.color?.background,
			},
		},
	} );

	const textColorProps = getColorClassesAndStyles( {
		textColor: attributes?.textColor,
		style: {
			color: {
				text: attributes?.style?.color?.text,
			},
		},
	} );

	return (
		<div
			{ ...useBlockProps.save( {
				className: clsx(
					'unitone-badge',
					[ `-shape:${ shape }` ],
					textColorProps.className
				),
				style: {
					...textColorProps.style,
					'--unitone--min-height': minHeight,
				},
			} ) }
		>
			<div
				className={ clsx(
					'unitone-badge__background',
					backgroundColorProps.className
				) }
				style={ {
					...backgroundColorProps.style,
				} }
			/>

			<RichText.Content
				tagName="p"
				className="unitone-badge__text"
				value={ content }
			/>
		</div>
	);
}
