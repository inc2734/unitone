import clsx from 'clsx';
import { get } from 'lodash';

import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from '@wordpress/block-editor';

import { createBlocksFromInnerBlocksTemplate } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

export default function ( { name, setAttributes, clientId } ) {
	const innerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks || [],
		[ clientId ]
	);

	const hasInnerBlocks = !! innerBlocks.length;
	const innerBlockTypes = innerBlocks.map(
		( innerblock ) => innerblock.attributes?.position
	);

	useEffect( () => {
		setAttributes( {
			variation: hasInnerBlocks
				? `cover-${ innerBlockTypes.join( '-' ) }`
				: undefined,
		} );
	}, [ innerBlockTypes.toString() ] );

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'cover',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock: false,
		allowedBlocks: [ 'unitone/cover-content' ],
		renderAppender: false,
	} );

	return (
		<>
			{ hasInnerBlocks ? (
				<div { ...innerBlocksProps } />
			) : (
				<Placeholder { ...{ clientId, name, setAttributes } } />
			) }
		</>
	);
}

function Placeholder( { clientId, name, setAttributes } ) {
	const { blockType, defaultVariation, variations } = useSelect(
		( select ) => {
			const {
				getBlockVariations,
				getBlockType,
				getDefaultBlockVariation,
			} = select( 'core/blocks' );

			return {
				blockType: getBlockType( name ),
				defaultVariation: getDefaultBlockVariation( name, 'block' ),
				variations: getBlockVariations( name, 'block' ),
			};
		},
		[ name ]
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	return (
		<div { ...useBlockProps() }>
			<BlockVariationPicker
				icon={ get( blockType, [ 'icon', 'src' ] ) }
				label={ get( blockType, [ 'title' ] ) }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation.attributes ) {
						setAttributes( nextVariation.attributes );
					}
					if ( nextVariation.innerBlocks ) {
						replaceInnerBlocks(
							clientId,
							createBlocksFromInnerBlocksTemplate(
								nextVariation.innerBlocks
							),
							true
						);
					}
				} }
				allowSkip={ false }
			/>
		</div>
	);
}
