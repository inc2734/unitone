import clsx from 'clsx';
import feather from 'feather-icons';

import { __ } from '@wordpress/i18n';

export const arrowsIconTypes = [
	{
		name: 'arrow',
		label: __( 'Arrow', 'unitone' ),
		icons: {
			prev: 'arrow-left',
			next: 'arrow-right',
		},
	},
	{
		name: 'arrow-circle',
		label: __( 'Arrow (Circle)', 'unitone' ),
		icons: {
			prev: 'arrow-left-circle',
			next: 'arrow-right-circle',
		},
	},
	{
		name: 'chevron',
		label: __( 'Chevron', 'unitone' ),
		icons: {
			prev: 'chevron-left',
			next: 'chevron-right',
		},
	},
	{
		name: 'chevrons',
		label: __( 'Chevrons', 'unitone' ),
		icons: {
			prev: 'chevrons-left',
			next: 'chevrons-right',
		},
	},
];

export const Arrows = ( {
	icons,
	iconStroke,
	iconSize,
	iconColor,
	iconCustomColor,
	alignment,
	justification,
} ) => {
	const className = clsx( 'swiper-buttons', {
		[ `swiper-buttons--alignment:${ alignment }` ]: !! alignment,
		[ `swiper-buttons--justification:${ justification }` ]:
			!! justification,
	} );

	const styles = {};
	if ( !! iconColor ) {
		styles[
			'--swiper-navigation-color'
		] = `var(--wp--preset--color--${ iconColor })`;
	} else if ( !! iconCustomColor ) {
		styles[ '--swiper-navigation-color' ] = iconCustomColor;
	}

	return (
		<div className={ className } style={ styles }>
			<div className="swiper-button swiper-button-prev">
				{ !! icons?.prev && (
					<span
						dangerouslySetInnerHTML={ {
							__html: feather.icons[ icons?.prev ].toSvg( {
								'stroke-width': iconStroke,
								width: iconSize,
								height: iconSize,
							} ),
						} }
					/>
				) }
			</div>

			<div className="swiper-button swiper-button-next">
				{ !! icons?.next && (
					<span
						dangerouslySetInnerHTML={ {
							__html: feather.icons[ icons?.next ].toSvg( {
								'stroke-width': iconStroke,
								width: iconSize,
								height: iconSize,
							} ),
						} }
					/>
				) }
			</div>
		</div>
	);
};

export const Pagination = ( { slides = [], alignment, justification } ) => {
	const className = clsx(
		'swiper-pagination',
		'swiper-pagination-bullets',
		'swiper-pagination-horizontal',
		{
			[ `swiper-pagination--alignment:${ alignment }` ]: !! alignment,
			[ `swiper-pagination--justification:${ justification }` ]:
				!! justification,
		}
	);

	return (
		<div className={ className }>
			{ slides.length > 0 &&
				slides.map( ( slide, index ) => (
					<span
						className="swiper-pagination-bullet"
						key={ index }
					></span>
				) ) }
		</div>
	);
};
