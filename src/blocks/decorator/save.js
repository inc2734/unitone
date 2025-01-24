import clsx from 'clsx';

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function ( { attributes } ) {
	const { tagName, rel, href, linkTarget, linkText } = attributes;

	const isHrefSet = !! href;

	const TagName = tagName;

	const blockProps = useBlockProps.save( {
		'data-unitone-layout': clsx( 'decorator', {
			'-has-link': isHrefSet,
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
							{ linkText ?? __( 'Learn more', 'unitone' ) }
						</a>
					</div>
				</TagName>
			) : (
				<TagName { ...useInnerBlocksProps.save( { ...blockProps } ) } />
			) }
		</>
	);
}
