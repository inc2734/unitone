import {
	registerFormatType,
	insertObject,
	useAnchor,
} from '@wordpress/rich-text';

import {
	RichTextToolbarButton,
	useCachedTruthy,
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
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import icons from './feather-icons';

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
	interactive: true,
	contentEditable: false,
	edit: Edit,
};

const DEFAULT_STROKE_WIDTH = 1.5;
const DEFAULT_ICON_OBJECT_SETTINGS = {
	type: name,
	attributes: {
		ariaHidden: 'true',
	},
	innerHTML: `<a inert> </a>`,
};

function Edit( {
	value,
	onChange,
	onFocus,
	isObjectActive,
	activeObjectAttributes,
	contentRef,
} ) {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ searchText, setSearchText ] = useState( '' );
	const [ strokeWidth, setStrokeWidth ] = useState( DEFAULT_STROKE_WIDTH );

	useEffect( () => {
		closeModal();
	}, [ value.start ] );

	const { style } = activeObjectAttributes;

	const inlineSvg = style?.match(
		/--unitone--inline-svg: ?(url\([^\)]+?\))/
	)?.[ 1 ];
	const color = style?.match( /--unitone--color: ?([^;]+);?/ )?.[ 1 ];

	const colors = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore );
		return getSettings()?.colors || [];
	}, [] );

	const popoverAnchor = useCachedTruthy(
		useAnchor( {
			editableContentElement: contentRef.current,
			settings,
		} )
	);

	function openModal() {
		setIsModalOpen( true );
	}

	function closeModal() {
		setIsModalOpen( false );
	}

	const filteredIcons = Object.values( icons )
		.filter( ( icon ) => icon.name.includes( searchText ) )
		.map( ( icon ) => {
			return {
				name: icon.name,
				svg: icon.toSvg( {
					'stroke-width': strokeWidth || DEFAULT_STROKE_WIDTH,
				} ),
			};
		} );

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
				<Popover
					placement="bottom"
					shift={ true }
					focusOnMount={ false }
					anchor={ popoverAnchor }
					className="block-editor-format-toolbar__image-popover"
					onClose={ closeModal }
				>
					<div
						style={ {
							width: 'min(90vw, 336px)',
							maxHeight: 'min(90vh, 400px)',
							padding: '6px',
						} }
					>
						<SearchControl
							value={ searchText }
							onChange={ ( newValue ) =>
								setSearchText( newValue )
							}
							onClose={ () => setSearchText( '' ) }
						/>

						<RangeControl
							label={ __( 'Stroke width', 'unitone' ) }
							value={ strokeWidth }
							allowReset
							initialPosition={ DEFAULT_STROKE_WIDTH }
							min={ 1 }
							max={ 2 }
							step={ 0.1 }
							onChange={ ( newValue ) =>
								setStrokeWidth( newValue )
							}
						/>

						{ filteredIcons.map( ( icon, index ) => {
							return (
								<Button
									key={ index }
									className="has-icon"
									onClick={ () => {
										const newInlineSvg =
											`url(data:image/svg+xml;charset=UTF-8,${ encodeURIComponent(
												icon.svg
											) })`.trim();

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

										onFocus();
										closeModal();
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

						<div>
							<Button variant="tertiary" onClick={ closeModal }>
								{ __( 'Close', 'unitone' ) }
							</Button>
						</div>
					</div>
				</Popover>
			) }

			{ isObjectActive && (
				<Popover
					placement="bottom"
					shift={ true }
					focusOnMount={ false }
					anchor={ popoverAnchor }
					className="block-editor-format-toolbar__image-popover"
					onClose={ closeModal }
				>
					<div
						style={ { width: 'min(90vw, 320px)', padding: '6px' } }
					>
						<ColorPicker
							value={ color }
							onChange={ ( newValue ) => {
								const newReplacements =
									value.replacements.slice();

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
										`--unitone--color: ${
											cssVarValue || newValue
										}`
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
			) }
		</>
	);
}

registerFormatType( settings.name, settings );

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
