import classnames from 'classnames';

import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

import { dividersResizeObserver } from '../../../node_modules/@inc2734/unitone-css/src/app';

export default function ( { attributes, clientId } ) {
	const { contentWidth, contentMaxWidth } = attributes;

	const { hasInnerBlocks, childern } = useSelect(
		( select ) => {
			const block = select( 'core/block-editor' ).getBlock( clientId );
			return {
				hasInnerBlocks: !! block?.innerBlocks?.length,
				childern: block?.innerBlocks,
			};
		},
		[ clientId ]
	);

	const blockProps = useBlockProps( {
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

	useEffect( () => {
		const target = document.querySelector( `[data-block="${ clientId }"` );
		if ( !! target ) {
			dividersResizeObserver.unobserve( target );
			dividersResizeObserver.observe( target );
		}
	}, [ clientId, childern ] );

	return <div { ...innerBlocksProps } />;
}
