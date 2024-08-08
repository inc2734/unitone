import {
	InnerBlocks,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import { useSelect } from '@wordpress/data';
import { useEffect, useLayoutEffect, useRef } from '@wordpress/element';

import { setDividerLinewrap } from '@inc2734/unitone-css/library';

export default function ( { attributes, setAttributes, clientId, context } ) {
	const { tagName, templateLock } = attributes;

	const ref = useRef();

	useEffect( () => {
		setAttributes( {
			tagName: [ 'ul', 'ol' ].includes(
				context[ 'unitone/grid-divided/tagName' ]
			)
				? 'li'
				: 'div',
		} );
	}, [ context ] );

	useLayoutEffect( () => {
		const target = ref?.current?.parentElement;
		if ( !! target ) {
			setDividerLinewrap( target );
		}
	}, [ JSON.stringify( attributes?.unitone ) ] );

	const hasInnerBlocks = useSelect(
		( select ) =>
			!! select( blockEditorStore ).getBlock( clientId )?.innerBlocks
				?.length,
		[ clientId ]
	);

	const blockProps = useBlockProps( {
		ref,
		className: 'unitone-grid__content',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-grid__content__content',
		},
		{
			templateLock,
			renderAppender: hasInnerBlocks
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			<div { ...innerBlocksProps } />
		</TagName>
	);
}
