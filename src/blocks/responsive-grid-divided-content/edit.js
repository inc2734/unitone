import clsx from 'clsx';

import {
	ButtonBlockAppender,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect, memo, useCallback } from '@wordpress/element';

import { getBackgroundCSSVariables } from '../../js/utils/background';

const MemoizedButtonBlockAppender = memo( ButtonBlockAppender );

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, templateLock } = attributes;

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/responsive-grid-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		style: {
			'--unitone--background-color': !! attributes?.backgroundColor
				? `var(--wp--preset--color--${ attributes?.backgroundColor })`
				: attributes?.style?.color?.background,
			...getBackgroundCSSVariables( attributes ),
		},
	} );
	blockProps[ 'data-unitone-layout' ] = clsx(
		'responsive-grid__content',
		blockProps[ 'data-unitone-layout' ]
	);

	const renderAppender = useCallback(
		() => <MemoizedButtonBlockAppender rootClientId={ clientId } />,
		[ clientId ]
	);

	const innerBlocksProps = useInnerBlocksProps(
		{
			'data-unitone-layout': 'responsive-grid__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks ? undefined : renderAppender,
		}
	);

	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
