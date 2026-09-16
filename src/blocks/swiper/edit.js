import {
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';

import {
	createBlocksFromInnerBlocksTemplate,
	store as blocksStore,
} from '@wordpress/blocks';

import { useDispatch, useSelect } from '@wordpress/data';
import { Button, Placeholder, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	getEditorIdentifier,
	getEditorResponsiveCSS,
	getEditorStyle,
	isSingleSlideEffect,
	resolveSettings,
} from './config';

import { EffectControl, SettingsInspectorControls } from './inspector-controls';
import { createEmptySwiperTemplate, createSwiperTemplate } from './template';

const PRIORITIZED_INSERTER_BLOCKS = [
	'unitone/swiper-track',
	'unitone/swiper-arrow/previous',
	'unitone/swiper-arrow/next',
	'unitone/swiper-pagination',
	'unitone/swiper-thumbnails',
	'unitone/swiper-scrollbar',
	'unitone/swiper-autoplay-control',
	'unitone/swiper-autoplay-progress',
];

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

	const blockProps = useBlockProps( {
		className: 'unitone-swiper',
		'data-unitone-swiper-editor-id': editorIdentifier,
		'data-unitone-swiper-slides-per-view':
			! isSingleSlideEffect( resolvedSettings.effect ) &&
			'auto' === resolvedSettings.slidesPerViewMode
				? 'auto'
				: 'number',
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

				<SetupPlaceholder
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
				{ innerBlocksProps.children }
			</div>

			{ responsiveCSS && <style>{ responsiveCSS }</style> }
		</>
	);
}

function SetupPlaceholder( { clientId, name, setAttributes } ) {
	const [ effect, setEffect ] = useState( 'slide' );
	const [ autoplay, setAutoplay ] = useState( false );
	const [ fullBleed, setFullBleed ] = useState( false );
	const [ overlayControls, setOverlayControls ] = useState( false );

	const blockType = useSelect(
		( select ) => select( blocksStore ).getBlockType( name ),
		[ name ]
	);

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	const insertTemplate = ( template ) => {
		setAttributes( template.attributes );
		replaceInnerBlocks(
			clientId,
			createBlocksFromInnerBlocksTemplate( template.innerBlocks ),
			false
		);
	};

	return (
		<div { ...useBlockProps() }>
			<Placeholder
				icon={ blockType?.icon?.src }
				label={ blockType?.title }
				className="block-editor-block-variation-picker unitone-swiper-setup"
			>
				<div className="unitone-swiper-setup__controls">
					<EffectControl
						value={ effect }
						onChange={ ( value ) => {
							setEffect( value );
							if ( 'slide' !== value ) {
								setFullBleed( false );
							}
						} }
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Autoplay', 'unitone' ) }
						checked={ autoplay }
						onChange={ setAutoplay }
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Overflow the container', 'unitone' ) }
						checked={ fullBleed }
						disabled={ 'slide' !== effect }
						onChange={ setFullBleed }
					/>

					<ToggleControl
						__nextHasNoMarginBottom
						label={ __( 'Overlay controls', 'unitone' ) }
						checked={ overlayControls }
						onChange={ setOverlayControls }
					/>

					<div className="unitone-swiper-setup__actions">
						<Button
							variant="primary"
							onClick={ () =>
								insertTemplate(
									createSwiperTemplate( {
										effect,
										autoplay,
										fullBleed,
										overlayControls,
									} )
								)
							}
						>
							{ __( 'Insert with settings', 'unitone' ) }
						</Button>

						<Button
							variant="secondary"
							onClick={ () =>
								insertTemplate( createEmptySwiperTemplate() )
							}
						>
							{ __( 'Insert an empty slider', 'unitone' ) }
						</Button>
					</div>
				</div>
			</Placeholder>
		</div>
	);
}
