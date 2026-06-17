import clsx from 'clsx';
import { get } from 'lodash';

import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
	__experimentalBlockVariationPicker as BlockVariationPicker,
} from '@wordpress/block-editor';

import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../../js/editor/hooks/utils';

const isDefaultCoverContentPosition = ( unitonePosition, defaultValue ) => {
	const properties = [
		'position',
		'top',
		'right',
		'bottom',
		'left',
		'zIndex',
	];

	return properties.every(
		( property ) =>
			( unitonePosition?.[ property ] ?? defaultValue?.[ property ] ) ===
			defaultValue?.[ property ]
	);
};

export default function ( { name, attributes, setAttributes, clientId } ) {
	const { allowedBlocks, templateLock } = attributes;
	const previousBackgroundClipRef = useRef(
		attributes?.unitone?.backgroundClip
	);

	const innerBlocks = useSelect(
		( select ) =>
			select( blockEditorStore ).getBlock( clientId )?.innerBlocks || [],
		[ clientId ]
	);

	const coverContentDefaultPosition = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( 'unitone/cover-content' )
			?.attributes?.unitone?.default?.position;
	}, [] );

	const { updateBlockAttributes } = useDispatch( blockEditorStore );
	const { createNotice } = useDispatch( 'core/notices' );

	const innerBlockTypes = useMemo(
		() =>
			innerBlocks.map(
				( innerblock ) => innerblock.attributes?.position
			),
		[ innerBlocks.length ]
	);

	const hasInnerBlocks = !! innerBlocks.length;
	const backgroundClip = attributes?.unitone?.backgroundClip;

	useEffect( () => {
		setAttributes( {
			variation: hasInnerBlocks
				? `cover-${ innerBlockTypes.join( '-' ) }`
				: undefined,
		} );
	}, [ innerBlockTypes.toString() ] );

	useEffect( () => {
		if ( ! previousBackgroundClipRef.current && backgroundClip ) {
			const updatedCoverContents = innerBlocks.filter(
				( block ) =>
					'unitone/cover-content' === block.name &&
					isDefaultCoverContentPosition(
						block.attributes?.unitone?.position,
						coverContentDefaultPosition
					)
			);

			updatedCoverContents.forEach( ( block ) => {
				updateBlockAttributes( block.clientId, {
					unitone: cleanEmptyObject( {
						...block.attributes?.unitone,
						position: {
							...block.attributes?.unitone?.position,
							position: 'static',
						},
					} ),
				} );
			} );

			if ( updatedCoverContents.length ) {
				createNotice(
					'success',
					__(
						'Updated cover content position to static.',
						'unitone'
					),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
			}
		}

		previousBackgroundClipRef.current = backgroundClip;
	}, [
		backgroundClip,
		coverContentDefaultPosition,
		createNotice,
		innerBlocks,
		updateBlockAttributes,
	] );

	const blockProps = useBlockProps();
	blockProps[ 'data-unitone-layout' ] = clsx(
		'cover',
		blockProps[ 'data-unitone-layout' ]
	);

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		allowedBlocks,
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
			} = select( blocksStore );

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
