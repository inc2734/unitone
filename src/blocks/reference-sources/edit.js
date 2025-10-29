import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	ToolbarButton,
	ToolbarGroup,
	Spinner,
	Button,
	Placeholder,
} from '@wordpress/components';

import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useState } from '@wordpress/element';
import { rotateRight } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';

import apiFetch from '@wordpress/api-fetch';

export default function ( { attributes, clientId } ) {
	const { allowedBlocks, templateLock } = attributes;

	const [ isLoading, setIsLoading ] = useState( false );

	const { getBlocks, hasInnerBlocks } = useSelect(
		( select ) => {
			const selector = select( blockEditorStore );

			return {
				getBlocks: selector.getBlocks,
				hasInnerBlocks:
					0 < selector.getBlock( clientId )?.innerBlocks.length,
			};
		},
		[ clientId, isLoading ]
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const gatherListItemPromises = useCallback( () => {
		const queue = [ ...getBlocks() ];
		const promises = [];
		let validUrlCount = 0;

		while ( queue.length ) {
			const node = queue.shift();
			if ( ! node ) {
				continue;
			}

			if ( node.innerBlocks?.length ) {
				queue.push( ...node.innerBlocks );
			}

			if ( node.name !== 'core/embed' ) {
				continue;
			}

			const url = node?.attributes?.url?.trim?.();
			if ( ! url ) {
				continue;
			}

			validUrlCount++;

			promises.push(
				( async () => {
					try {
						const data = await apiFetch( {
							path: addQueryArgs(
								'/wp-oembed-blog-card/v1/data',
								{ ...node.attributes }
							),
							method: 'GET',
						} );
						const title = data?.title ?? url;
						return createBlock( 'core/list-item', {
							content: `<a href="${ url }" target="_blank" rel="noreferrer noopener nofollow">${ title }</a>`,
						} );
					} catch {
						return createBlock( 'core/list-item', {
							content: `<a href="${ url }" target="_blank" rel="noreferrer noopener nofollow">${ url }</a>`,
						} );
					}
				} )()
			);
		}

		return { promises, validUrlCount };
	}, [ getBlocks ] );

	const onReload = useCallback( async () => {
		setIsLoading( true );

		try {
			const { promises, validUrlCount } = gatherListItemPromises();

			if ( 0 === validUrlCount ) {
				replaceInnerBlocks( clientId, [], false );
				return;
			}

			const listItems = ( await Promise.all( promises ) ).filter(
				Boolean
			);

			replaceInnerBlocks( clientId, [ ...listItems ], false );
		} finally {
			setIsLoading( false );
		}
	}, [ clientId, gatherListItemPromises, replaceInnerBlocks ] );

	const blockProps = useBlockProps( {
		className: 'unitone-reference-sources',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'unitone-reference-sources__inner',
		},
		{
			templateLock,
			allowedBlocks,
			renderAppender: false,
		}
	);

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						label={ __( 'Recollect referral sources', 'unitone' ) }
						icon={ rotateRight }
						onClick={ onReload }
						disabled={ isLoading }
					/>
				</ToolbarGroup>
			</BlockControls>

			<div { ...blockProps } aria-busy={ isLoading }>
				{ hasInnerBlocks && <ul { ...innerBlocksProps } /> }

				{ isLoading && (
					<div className="unitone-reference-sources__loading">
						<Spinner />
						<span>{ __( 'Loading…', 'unitone' ) }</span>
					</div>
				) }

				{ ! isLoading && ! hasInnerBlocks && (
					<Placeholder>
						<p>
							{ __(
								'No embeddable URLs were found. Click to try generating the list.',
								'unitone'
							) }
						</p>

						<Button variant="primary" onClick={ onReload }>
							{ __( 'Generate list', 'unitone' ) }
						</Button>
					</Placeholder>
				) }
			</div>
		</>
	);
}
