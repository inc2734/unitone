import clsx from 'clsx';

import {
	useBlockProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetShadowClassesAndStyles as getShadowClassesAndStyles,
} from '@wordpress/block-editor';

export default function ( { attributes } ) {
	const {
		id,
		url,
		alt,
		title,
		sources,
		tagName,
		linkUrl,
		linkTarget,
		rel,
		linkClass,
	} = attributes;

	if ( ! url ) {
		return null;
	}

	const TagName = tagName || 'figure';

	const sourceImages = [ ...sources ].sort(
		( a, b ) =>
			parseInt( a.breakpoint || 0, 10 ) -
			parseInt( b.breakpoint || 0, 10 )
	);

	const mainImageClassName = id ? `wp-image-${ id }` : undefined;
	const borderProps = getBorderClassesAndStyles( attributes );
	const shadowProps = getShadowClassesAndStyles( attributes );
	const imageClassName = borderProps.className || mainImageClassName;

	const classes = clsx( 'unitone-responsive-image', {
		'has-custom-border':
			!! borderProps.className ||
			( borderProps.style &&
				Object.keys( borderProps.style ).length > 0 ),
	} );

	const blockProps = useBlockProps.save( {
		className: classes,
	} );

	return (
		<TagName { ...blockProps }>
			{ linkUrl ? (
				<a
					href={ linkUrl }
					target={ linkTarget }
					rel={ rel }
					className={ linkClass }
				>
					<picture>
						{ sourceImages.map( ( image ) => {
							if ( ! image.breakpoint || ! image.url ) {
								return null;
							}

							return (
								<source
									key={ image.url }
									media={ `(max-width: ${ image.breakpoint }px)` }
									srcSet={ image.url }
									width={ image.width }
									height={ image.height }
								/>
							);
						} ) }

						<img
							src={ url }
							alt={ alt }
							title={ title }
							className={ imageClassName }
							style={ {
								...borderProps.style,
								...shadowProps.style,
							} }
						/>
					</picture>
				</a>
			) : (
				<picture>
					{ sourceImages.map( ( image ) => {
						if ( ! image.breakpoint || ! image.url ) {
							return null;
						}

						return (
							<source
								key={ image.url }
								media={ `(max-width: ${ image.breakpoint }px)` }
								srcSet={ image.url }
								width={ image.width }
								height={ image.height }
							/>
						);
					} ) }

					<img
						src={ url }
						alt={ alt }
						title={ title }
						className={ imageClassName }
						style={ {
							...borderProps.style,
							...shadowProps.style,
						} }
					/>
				</picture>
			) }
		</TagName>
	);
}
