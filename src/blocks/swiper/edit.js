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

import { Notice } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	getEditorIdentifier,
	getEditorResponsiveCSS,
	getEditorStyle,
	resolveSettings,
} from './config';
import { SettingsInspectorControls } from './inspector-controls';

const PRIORITIZED_INSERTER_BLOCKS = [
	'unitone/swiper-track',
	'unitone/swiper-arrow/previous',
	'unitone/swiper-arrow/next',
	'unitone/swiper-pagination',
	'unitone/swiper-scrollbar',
	'unitone/swiper-autoplay-control',
	'unitone/swiper-autoplay-progress',
];

const inspectOwnedParts = ( blocks, result = { scrollbarCount: 0 } ) => {
	for ( const block of blocks ) {
		if ( 'unitone/swiper' === block.name ) {
			continue;
		}

		if ( 'unitone/swiper-scrollbar' === block.name ) {
			result.scrollbarCount++;
		}

		inspectOwnedParts( block.innerBlocks || [], result );
	}

	return result;
};

export default function ( props ) {
	const { attributes, clientId, name: blockName, setAttributes } = props;

	const { settings, templateLock } = attributes;

	const resolvedSettings = resolveSettings( settings );
	const editorIdentifier = getEditorIdentifier( clientId );
	const responsiveCSS = getEditorResponsiveCSS(
		settings,
		clientId,
		resolvedSettings
	);
	const usesContainerBreakpoints =
		!! responsiveCSS && 'container' === resolvedSettings.breakpointsBase;

	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);

	const { scrollbarCount } = useMemo(
		() => inspectOwnedParts( innerBlocks ),
		[ innerBlocks ]
	);

	const blockProps = useBlockProps( {
		className: 'unitone-swiper',
		'data-unitone-swiper-editor-id': editorIdentifier,
		style: {
			...getEditorStyle( settings, resolvedSettings ),
			...( usesContainerBreakpoints
				? {
						containerName: editorIdentifier,
						containerType: 'inline-size',
				  }
				: {} ),
		},
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		templateLock,
		prioritizedInserterBlocks: PRIORITIZED_INSERTER_BLOCKS,
	} );

	if ( ! innerBlocks.length ) {
		return (
			<>
				<SettingsInspectorControls { ...props } />

				<Placeholder
					clientId={ clientId }
					name={ blockName }
					setAttributes={ setAttributes }
				/>
			</>
		);
	}

	return (
		<>
			<SettingsInspectorControls { ...props } />

			<div
				{ ...innerBlocksProps }
				data-unitone-swiper-centered-slides={
					resolvedSettings?.centeredSlides ? true : undefined
				}
				data-unitone-swiper-loop={
					'loop' === resolvedSettings?.loopMode ? 'true' : undefined
				}
			>
				{ 1 < scrollbarCount && (
					<Notice status="warning" isDismissible={ false }>
						{ __(
							'Only the first Scrollbar block is connected to Swiper.',
							'unitone'
						) }
					</Notice>
				) }

				{ innerBlocksProps.children }
			</div>

			{ responsiveCSS && <style>{ responsiveCSS }</style> }
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
				icon={ blockType?.icon?.src }
				label={ blockType?.title }
				variations={ variations }
				onSelect={ ( nextVariation = defaultVariation ) => {
					if ( nextVariation?.attributes ) {
						setAttributes( nextVariation.attributes );
					}

					if ( nextVariation?.innerBlocks ) {
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
