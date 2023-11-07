import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';

import { dividersResizeObserver } from '@inc2734/unitone-css/library';

export default function ( { attributes, clientId } ) {
	const { contentWidth, contentMaxWidth } = attributes;

	const { hasInnerBlocks, children } = useSelect(
		( select ) => {
			const block = select( 'core/block-editor' ).getBlock( clientId );
			return {
				hasInnerBlocks: !! block?.innerBlocks?.length,
				children: block?.innerBlocks,
			};
		},
		[ clientId ]
	);

	const ref = useRefEffect(
		( target ) => {
			dividersResizeObserver.unobserve( target );
			dividersResizeObserver.observe( target );
		},
		[ clientId, attributes, children.length ]
	);

	const blockProps = useBlockProps( {
		ref,
		style: {
			'--unitone--content-width': contentWidth || undefined,
			'--unitone--content-max-width': contentMaxWidth || undefined,
		},
	} );
	blockProps[ 'data-unitone-layout' ] = classnames(
		'both-sides__content',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		renderAppender: hasInnerBlocks
			? InnerBlocks.DefaultBlockAppender
			: InnerBlocks.ButtonBlockAppender,
	} );

	return <div { ...innerBlocksProps } />;
}
