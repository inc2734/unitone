import classnames from 'classnames';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function ( { attributes } ) {
	const {
		tagName,
		shadow,
		position,
		top,
		right,
		bottom,
		left,
		zIndex,
		rel,
		href,
		linkTarget,
	} = attributes;

	const isHrefSet = !! href;

	const TagName = tagName || 'div';

	const blockProps = useBlockProps.save( {
		style: {
			'--unitone--top': top || undefined,
			'--unitone--right': right || undefined,
			'--unitone--bottom': bottom || undefined,
			'--unitone--left': left || undefined,
			'--unitone--z-index': zIndex || undefined,
		},
		'data-unitone-layout': classnames( 'decorator', {
			[ `-position:${ position }` ]: position,
			'-shadow': shadow,
		} ),
	} );

	return (
		<>
			{ isHrefSet ? (
				<TagName { ...blockProps }>
					<div data-unitone-layout="decorator__inner">
						<div { ...useInnerBlocksProps.save() } />
						<a
							data-unitone-layout="decorator__link"
							href={ href }
							target={ linkTarget }
							rel={ rel }
						>
							{ __( 'Learn more', 'unitone' ) }
						</a>
					</div>
				</TagName>
			) : (
				<TagName { ...useInnerBlocksProps.save( { ...blockProps } ) } />
			) }
		</>
	);
}
