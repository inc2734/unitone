import {
	registerFormatType,
	removeFormat,
	applyFormat,
	useAnchor,
} from '@wordpress/rich-text';

import {
	useCachedTruthy,
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

const name = 'unitone/text-shadow';
const title = __( 'Text shadow', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-text-shadow',
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

	const [ color, setColor ] = useState(
		style?.match( /--unitone--color: ?([^;]+);?/ )?.[ 1 ]
	);
	const [ offsetX, setOffsetX ] = useState(
		parseInt(
			style?.match( /--unitone--offset-x: ?([^;]+)px;?/ )?.[ 1 ] || 0
		)
	);
	const [ offsetY, setOffsetY ] = useState(
		parseInt(
			style?.match( /--unitone--offset-y: ?([^;]+)px;?/ )?.[ 1 ] || 0
		)
	);
	const [ blurRadius, setBlurRadius ] = useState(
		parseInt(
			style?.match( /--unitone--blur-radius: ?([^;]+)px;?/ )?.[ 1 ] || 0
		)
	);

	const shouldSetDefaultStyles =
		null == color && 0 === offsetX && 0 === offsetY && 0 === blurRadius;

	useEffect( () => {
		if ( shouldSetDefaultStyles ) {
			const newOffsetX = 1;
			const newOffsetY = 1;
			const newBlurRadius = 1;

			setOffsetX( newOffsetX );
			setOffsetY( newOffsetY );
			setBlurRadius( newBlurRadius );

			onChange(
				applyFormat( value, {
					type: name,
					attributes: {
						style: getStyleAttribute( {
							...styleProperties,
							'--unitone--offset-x': `${ newOffsetX }px`,
							'--unitone--offset-y': `${ newOffsetY }px`,
							'--unitone--blur-radius': `${ newBlurRadius }px`,
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

	const cachedRect = useCachedTruthy( popoverAnchor.getBoundingClientRect() );
	popoverAnchor.getBoundingClientRect = () => cachedRect;

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
					__nextHasNoMarginBottom
					label={ __( 'X', 'unitone' ) }
					value={ offsetX }
					min={ 0 }
					max={ 10 }
					onChange={ ( newValue ) => {
						const newOffsetX = newValue;
						setOffsetX( newOffsetX );

						onChange(
							applyFormat( value, {
								type: name,
								attributes: {
									style: getStyleAttribute( {
										...styleProperties,
										'--unitone--offset-x': !! newOffsetX
											? `${ newOffsetX }px`
											: undefined,
									} ),
								},
							} )
						);
					} }
				/>

				<RangeControl
					__nextHasNoMarginBottom
					label={ __( 'Y', 'unitone' ) }
					value={ offsetY }
					min={ 0 }
					max={ 10 }
					onChange={ ( newValue ) => {
						const newOffsetY = newValue;
						setOffsetY( newOffsetY );

						onChange(
							applyFormat( value, {
								type: name,
								attributes: {
									style: getStyleAttribute( {
										...styleProperties,
										'--unitone--offset-y': !! newOffsetY
											? `${ newOffsetY }px`
											: undefined,
									} ),
								},
							} )
						);
					} }
				/>

				<RangeControl
					__nextHasNoMarginBottom
					label={ __( 'Blur', 'unitone' ) }
					value={ blurRadius }
					min={ 0 }
					max={ 10 }
					onChange={ ( newValue ) => {
						const newBlurRadius = newValue;
						setBlurRadius( newBlurRadius );

						onChange(
							applyFormat( value, {
								type: name,
								attributes: {
									style: getStyleAttribute( {
										...styleProperties,
										'--unitone--blur-radius':
											!! newBlurRadius
												? `${ newBlurRadius }px`
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
											'--unitone--color': newColor,
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
	const color = style?.match( /--unitone--color: ?([^;]+);?/ )?.[ 1 ];

	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						strokeWidth="0"
						style={ { fill: color } }
					>
						<path
							d="M8 20H10.4922L11.8234 16.25H16.6426L17.9738 20H20.466L15.3254 6H13.1406L8 20ZM12.5977 14.069L14.233 9.46227L15.8683 14.069H12.5977Z"
							fillOpacity="0.2"
						/>
						<path d="M4 18H6.49224L7.82344 14.25H12.6426L13.9738 18H16.466L11.3254 4H9.14063L4 18ZM8.59768 12.069L10.233 7.46227L11.8683 12.069H8.59768Z" />
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
