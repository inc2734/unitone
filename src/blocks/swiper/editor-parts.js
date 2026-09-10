import {
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';

import { store as blocksStore } from '@wordpress/blocks';
import { Placeholder } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';

const SINGLE_PARTS = [ 'unitone/swiper-track', 'unitone/swiper-scrollbar' ];

const getFirstOwnedParts = ( blocks, result = {} ) => {
	for ( const block of blocks ) {
		if ( 'unitone/swiper' === block.name ) {
			continue;
		}

		if ( SINGLE_PARTS.includes( block.name ) ) {
			if ( result[ block.name ] ) {
				// Parts inside hidden tracks are also excluded on the front end.
				continue;
			}
			result[ block.name ] = block.clientId;
		}

		getFirstOwnedParts( block.innerBlocks || [], result );
	}

	return result;
};

export const useIsDuplicateSwiperPart = ( clientId, blockName ) =>
	useSelect(
		( select ) => {
			const selector = select( blockEditorStore );
			const swiperClientId = selector
				.getBlockParents( clientId, true )
				.find(
					( parentId ) =>
						'unitone/swiper' === selector.getBlockName( parentId )
				);

			if ( ! swiperClientId ) {
				return false;
			}

			const firstParts = getFirstOwnedParts(
				selector.getBlocks( swiperClientId )
			);
			return firstParts[ blockName ] !== clientId;
		},
		[ clientId, blockName ]
	);

export function DuplicateSwiperPart( { blockName } ) {
	const blockProps = useBlockProps();
	const blockTitle = useSelect(
		( select ) => select( blocksStore ).getBlockType( blockName )?.title,
		[ blockName ]
	);

	return (
		<div { ...blockProps }>
			<Placeholder label={ blockTitle }>
				{ sprintf(
					/* translators: %s: Block title. */
					__(
						'This block is not displayed. Only the first %s is displayed.',
						'unitone'
					),
					blockTitle
				) }
			</Placeholder>
		</div>
	);
}
