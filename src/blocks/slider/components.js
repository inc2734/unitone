import classnames from 'classnames';

export const Arrows = ( { alignment, justification } ) => {
	const className = classnames( 'swiper-buttons', {
		[ `swiper-buttons--alignment:${ alignment }` ]: !! alignment,
		[ `swiper-buttons--justification:${ justification }` ]:
			!! justification,
	} );
	return (
		<div className={ className }>
			<div className="swiper-button swiper-button-prev"></div>
			<div className="swiper-button swiper-button-next"></div>
		</div>
	);
};

export const Pagination = ( { slides = [], alignment, justification } ) => {
	const className = classnames(
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
