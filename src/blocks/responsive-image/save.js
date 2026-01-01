import { useBlockProps } from '@wordpress/block-editor';

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

	return (
		<TagName
			{ ...useBlockProps.save( {
				className: 'unitone-responsive-image',
			} ) }
		>
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
								/>
							);
						} ) }

						<img
							src={ url }
							alt={ alt }
							title={ title }
							className={ mainImageClassName }
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
							/>
						);
					} ) }

					<img
						src={ url }
						alt={ alt }
						title={ title }
						className={ mainImageClassName }
					/>
				</picture>
			) }
		</TagName>
	);
}
