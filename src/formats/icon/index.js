import {
	registerFormatType,
	insertObject,
	useAnchor,
} from '@wordpress/rich-text';

import {
	RichTextToolbarButton,
	getColorObjectByColorValue,
	store as blockEditorStore,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import {
	Popover,
	Button,
	RangeControl,
	SearchControl,
	TabPanel,
} from '@wordpress/components';

import { useSelect, dispatch } from '@wordpress/data';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { store as preferencesStore } from '@wordpress/preferences';
import { __ } from '@wordpress/i18n';

import fetherIcons from './feather-icons';
import flowbiteIcons from './flowbite-icons.js';
import spinnerIcons from './spinner-icons';

const name = 'unitone/inline-icon';
const title = __( 'Inline icon', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-inline-icon',
	attributes: {
		className: 'class',
		style: 'style',
		ariaHidden: 'aria-hidden',
	},
	// interactive: true,
	contentEditable: false,
	edit: Edit,
};

const DEFAULT_STROKE_WIDTH = 1.5;
const DEFAULT_ICON_OBJECT_SETTINGS = {
	type: name,
	attributes: {
		ariaHidden: 'true',
	},
	innerHTML: `<span inert> </span>`,
};

const PREFERENCE_SCOPE = 'unitone/preferences';

function InlineUI( { value, onChange, onClose, contentRef } ) {
	dispatch( preferencesStore ).setDefaults( PREFERENCE_SCOPE, {
		inlineIconStrokeWidth: DEFAULT_STROKE_WIDTH,
	} );

	const savedStrokeWidth = useSelect(
		( select ) =>
			select( preferencesStore ).get(
				PREFERENCE_SCOPE,
				'inlineIconStrokeWidth'
			),
		[]
	);

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	const [ searchText, setSearchText ] = useState( '' );
	const [ strokeWidth, setStrokeWidth ] = useState(
		! isNaN( savedStrokeWidth ) ? savedStrokeWidth : DEFAULT_STROKE_WIDTH
	);
	const isSearching = !! searchText;

	const filteredFetherIcons = Object.values( fetherIcons )
		.filter( ( icon ) => icon.name.includes( searchText ) )
		.map( ( icon ) => {
			return {
				name: icon.name,
				svg: icon.toSvg( {
					'stroke-width': strokeWidth || DEFAULT_STROKE_WIDTH,
				} ),
			};
		} );

	const filteredFlowbiteIcons = flowbiteIcons
		.filter( ( icon ) => icon.name.includes( searchText ) )
		.map( ( icon ) => {
			return {
				name: icon.name,
				svg: icon.svg( {
					strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH,
				} ),
			};
		} );

	const filteredSpinnerIcons = spinnerIcons
		.filter( ( icon ) => icon.name.includes( searchText ) )
		.map( ( icon ) => {
			return {
				name: icon.name,
				svg: icon.svg( {
					strokeWidth: strokeWidth || DEFAULT_STROKE_WIDTH,
				} ),
			};
		} );

	const filteredIcons = [
		...filteredFetherIcons,
		...filteredFlowbiteIcons,
		...filteredSpinnerIcons,
	];

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="block-editor-format-toolbar__image-popover"
			onClose={ () => {
				setSearchText( '' );
				onClose();
			} }
		>
			<div
				style={ {
					width: 'min(90vw, 320px)',
					maxHeight: 'min(90vh, 400px)',
					padding: '16px',
					display: 'grid',
					gap: '8px',
				} }
			>
				<SearchControl
					__nextHasNoMarginBottom
					SearchControl
					value={ searchText }
					onChange={ ( newValue ) => setSearchText( newValue ) }
				/>

				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Stroke width', 'unitone' ) }
					value={ strokeWidth }
					allowReset
					initialPosition={ strokeWidth }
					min={ 1 }
					max={ 2 }
					step={ 0.1 }
					onChange={ ( newValue ) => setStrokeWidth( newValue ) }
				/>

				{ ! isSearching && (
					<TabPanel
						activeClass="is-active"
						tabs={ [
							{
								name: 'feather',
								title: __( 'Feather', 'unitone' ),
							},
							{
								name: 'flowbite',
								title: __( 'Flowbite', 'unitone' ),
							},
							{
								name: 'unitone',
								title: __( 'unitone', 'unitone' ),
							},
						] }
					>
						{ ( tab ) => {
							let iconsForTab = [];
							switch ( tab.name ) {
								case 'feather':
									iconsForTab = filteredFetherIcons;
									break;
								case 'flowbite':
									iconsForTab = filteredFlowbiteIcons;
									break;
								case 'unitone':
									iconsForTab = filteredSpinnerIcons;
									break;
							}

							return (
								<div style={ { paddingTop: '1rem' } }>
									{ iconsForTab.map( ( icon, index ) => {
										return (
											<Button
												key={ index }
												label={ icon.name }
												showTooltip
												className="has-icon"
												onClick={ () => {
													const encodedSvg =
														encodeURIComponent(
															icon.svg
														)
															.replace(
																/\(/g,
																'%28'
															)
															.replace(
																/\)/g,
																'%29'
															);
													const newInlineSvg =
														`url("data:image/svg+xml;charset=UTF-8,${ encodedSvg }")`.trim();

													const newValue =
														insertObject(
															value,
															{
																...DEFAULT_ICON_OBJECT_SETTINGS,
																attributes: {
																	...DEFAULT_ICON_OBJECT_SETTINGS.attributes,
																	style: `--unitone--inline-svg: ${ newInlineSvg }`,
																},
															},
															value.end,
															value.end
														);
													newValue.start =
														newValue.end - 1;
													onChange( newValue );

													if (
														strokeWidth !==
														savedStrokeWidth
													) {
														dispatch(
															preferencesStore
														).set(
															PREFERENCE_SCOPE,
															'inlineIconStrokeWidth',
															strokeWidth
														);
													}

													onClose();
												} }
											>
												<span
													dangerouslySetInnerHTML={ {
														__html: icon.svg,
													} }
												/>
											</Button>
										);
									} ) }
								</div>
							);
						} }
					</TabPanel>
				) }

				{ isSearching && (
					<div>
						{ filteredIcons.map( ( icon, index ) => {
							return (
								<Button
									key={ index }
									label={ icon.name }
									showTooltip
									className="has-icon"
									onClick={ () => {
										const encodedSvg = encodeURIComponent(
											icon.svg
										)
											.replace( /\(/g, '%28' )
											.replace( /\)/g, '%29' );
										const newInlineSvg =
											`url("data:image/svg+xml;charset=UTF-8,${ encodedSvg }")`.trim();

										const newValue = insertObject(
											value,
											{
												...DEFAULT_ICON_OBJECT_SETTINGS,
												attributes: {
													...DEFAULT_ICON_OBJECT_SETTINGS.attributes,
													style: `--unitone--inline-svg: ${ newInlineSvg }`,
												},
											},
											value.end,
											value.end
										);
										newValue.start = newValue.end - 1;
										onChange( newValue );

										if (
											strokeWidth !== savedStrokeWidth
										) {
											dispatch( preferencesStore ).set(
												PREFERENCE_SCOPE,
												'inlineIconStrokeWidth',
												strokeWidth
											);
										}

										onClose();
									} }
								>
									<span
										dangerouslySetInnerHTML={ {
											__html: icon.svg,
										} }
									/>
								</Button>
							);
						} ) }
					</div>
				) }

				<div>
					<Button variant="tertiary" onClick={ onClose }>
						{ __( 'Close', 'unitone' ) }
					</Button>
				</div>
			</div>
		</Popover>
	);
}

function ColorPicker( { value, onChange } ) {
	return (
		<ColorGradientControl
			label={ __( 'Color', 'unitone' ) }
			colorValue={ value }
			onColorChange={ onChange }
			{ ...useMultipleOriginColorsAndGradients() }
			__experimentalHasMultipleOrigins={ true }
			__experimentalIsRenderedInSidebar={ true }
		/>
	);
}

function ColorPickerUI( {
	value,
	onChange,
	activeObjectAttributes,
	contentRef,
} ) {
	const { style } = activeObjectAttributes;

	const inlineSvg = style?.match(
		/--unitone--inline-svg: ?(url\([^\)]+?\))/
	)?.[ 1 ];
	const color = style?.match( /--unitone--color: ?([^;]+);?/ )?.[ 1 ];

	const colors = useSelect(
		( select ) => select( blockEditorStore ).getSettings()?.colors ?? [],
		[]
	);

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings,
	} );

	return (
		<Popover
			placement="bottom"
			shift={ true }
			focusOnMount={ false }
			anchor={ popoverAnchor }
			className="block-editor-format-toolbar__image-popover"
		>
			<div
				style={ {
					width: '260px',
					padding: '16px',
				} }
			>
				<ColorPicker
					value={ color }
					onChange={ ( newValue ) => {
						const newReplacements = value.replacements.slice();

						const newStye = [];
						if ( !! inlineSvg ) {
							newStye.push(
								`--unitone--inline-svg: ${ inlineSvg }`
							);
						}
						if ( !! newValue ) {
							const colorObj = getColorObjectByColorValue(
								colors,
								newValue
							);
							const cssVarValue =
								!! colorObj?.slug &&
								`var(--wp--preset--color--${ colorObj?.slug })`;

							newStye.push(
								`--unitone--color: ${ cssVarValue || newValue }`
							);
						}

						newReplacements[ value.start ] = {
							...DEFAULT_ICON_OBJECT_SETTINGS,
							attributes: {
								...DEFAULT_ICON_OBJECT_SETTINGS.attributes,
								...activeObjectAttributes,
								style: newStye.join( ';' ),
							},
						};

						onChange( {
							...value,
							replacements: newReplacements,
						} );
					} }
				/>
			</div>
		</Popover>
	);
}

function Edit( {
	value,
	onChange,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const openModal = useCallback( () => {
		setIsModalOpen( true );
	}, [ setIsModalOpen ] );

	const closeModal = useCallback( () => {
		setIsModalOpen( false );
	}, [ setIsModalOpen ] );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4px"
						strokeLinecap="round"
						strokeLinejoin="round"
						style={ { fill: 'none' } }
					>
						<circle cx="12" cy="12" r="10"></circle>
						<path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
						<line x1="9" y1="9" x2="9.01" y2="9"></line>
						<line x1="15" y1="9" x2="15.01" y2="9"></line>
					</svg>
				}
				title={ title }
				onClick={ openModal }
				isActive={ isObjectActive }
			/>

			{ isModalOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ closeModal }
					contentRef={ contentRef }
				/>
			) }

			{ isObjectActive && (
				<ColorPickerUI
					value={ value }
					onChange={ onChange }
					activeObjectAttributes={ activeObjectAttributes }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
