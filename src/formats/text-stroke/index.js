import {
	registerFormatType,
	removeFormat,
	applyFormat,
	useAnchor,
} from '@wordpress/rich-text';

import {
	RichTextToolbarButton,
	getColorObjectByColorValue,
	store as blockEditorStore,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { Popover, RangeControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const name = 'unitone/text-stroke';
const title = __( 'Text stroke', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-text-stroke',
	attributes: {
		className: 'class',
		style: 'style',
	},
	edit: Edit,
};

function getStyleProperties( text ) {
	const pairs = ( text || '' )
		.replace( /;?\s*$/, '' )
		.split( ';' )
		.map( ( style ) => {
			const [ key, ...valueParts ] = style.split( ':' );
			const value = valueParts.join( ':' );

			return [ key.trim(), value.trim() ];
		} )
		.filter( ( style ) => null != style[ 0 ] && null != style[ 1 ] );

	return Object.fromEntries( pairs );
}

function getStyleAttribute( styleProperties ) {
	const styleKeys = Object.keys( styleProperties );
	const styleValues = Object.values( styleProperties );
	return styleValues
		.map( ( styleValue, i ) => {
			return null != styleValue && '' !== styleValue
				? [ styleKeys[ i ], styleValue ].join( ':' )
				: undefined;
		} )
		.filter( Boolean )
		.join( ';' );
}

function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
} ) {
	const { style } = activeAttributes;
	const styleProperties = getStyleProperties( style );

	const [ width, setWidth ] = useState(
		parseInt(
			style?.match(
				/--unitone--text-stroke-width: ?([^;]+)px;?/
			)?.[ 1 ] || 0
		)
	);
	const [ color, setColor ] = useState(
		style?.match( /--unitone--text-stroke-color: ?([^;]+);?/ )?.[ 1 ]
	);

	const shouldSetDefaultStyles = 0 === width && null == color;

	useEffect( () => {
		if ( shouldSetDefaultStyles ) {
			const newWidth = 1;

			setWidth( newWidth );

			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: getStyleAttribute( {
							...styleProperties,
							'--unitone--text-stroke-width': `${ newWidth }px`,
						} ),
					},
				} )
			);
		}
	}, [ shouldSetDefaultStyles ] );

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
			onClose={ onClose }
		>
			<div
				style={ {
					width: '260px',
					padding: '16px',
				} }
			>
				<RangeControl
					__next40pxDefaultSize
					__nextHasNoMarginBottom
					label={ __( 'Width', 'unitone' ) }
					value={ width }
					min={ 0 }
					max={ 10 }
					onChange={ ( newValue ) => {
						const newWidth = newValue;
						setWidth( newWidth );

						onChange(
							applyFormat( value, {
								type: name,
								attributes: {
									style: getStyleAttribute( {
										...styleProperties,
										'--unitone--text-stroke-width':
											!! newWidth
												? `${ newWidth }px`
												: undefined,
									} ),
								},
							} )
						);
					} }
				/>

				<ColorPicker
					value={ color }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							const colorObj = getColorObjectByColorValue(
								colors,
								newValue
							);

							const cssVarValue =
								!! colorObj?.slug &&
								`var(--wp--preset--color--${ colorObj?.slug })`;

							const newColor = cssVarValue || newValue;
							setColor( newColor );

							onChange(
								applyFormat( value, {
									type: name,
									attributes: {
										style: getStyleAttribute( {
											...styleProperties,
											'--unitone--text-stroke-color':
												newColor,
										} ),
									},
								} )
							);
						} else {
							onChange( removeFormat( value, name ) );
							onClose();
						}
					} }
				/>
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

function Edit( { value, onChange, isActive, activeAttributes, contentRef } ) {
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

	const { style } = activeAttributes;
	const color = style?.match(
		/--unitone--text-stroke-color: ?([^;]+);?/
	)?.[ 1 ];

	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
					>
						<path
							d="M13.6748 4.5L13.7949 4.82812L18.9355 18.8281L19.1826 19.5H15.6211L15.5029 19.167L14.2891 15.75H10.1768L8.96387 19.167L8.8457 19.5H5.28418L5.53027 18.8281L10.6709 4.82812L10.792 4.5H13.6748ZM11.3057 12.5693H13.1602L12.2324 9.95703L11.3057 12.5693Z"
							fill="white"
							stroke={ color || 'black' }
						/>
					</svg>
				}
				title={ title }
				onClick={ openModal }
				isActive={ isActive }
			/>

			{ isModalOpen && (
				<InlineUI
					value={ value }
					onChange={ onChange }
					onClose={ closeModal }
					activeAttributes={ activeAttributes }
					contentRef={ contentRef }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
