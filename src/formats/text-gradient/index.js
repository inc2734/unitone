import {
	registerFormatType,
	removeFormat,
	applyFormat,
	useAnchor,
} from '@wordpress/rich-text';

import {
	RichTextToolbarButton,
	getGradientSlugByValue,
	store as blockEditorStore,
	__experimentalColorGradientControl as ColorGradientControl,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';

import { Popover } from '@wordpress/components';
import { useCallback, useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { getStyleAttribute, getStyleProperties } from '../utils';

const name = 'unitone/text-gradient';
const title = __( 'Text gradient', 'unitone' );

const settings = {
	name,
	title,
	tagName: 'span',
	className: 'unitone-text-gradient',
	attributes: {
		style: 'style',
		class: 'class',
	},
	edit: Edit,
};

function InlineUI( {
	value,
	onChange,
	onClose,
	activeAttributes,
	contentRef,
	isActive,
} ) {
	const { style } = activeAttributes;
	const styleProperties = getStyleProperties( style );

	const [ color, setColor ] = useState(
		style?.match( /--unitone--text-gradient-gradient: ?([^;]+);?/ )?.[ 1 ]
	);

	const gradients = useSelect(
		( select ) => select( blockEditorStore ).getSettings()?.gradients ?? [],
		[]
	);

	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { ...settings, isActive },
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
				<GradientPicker
					value={ color }
					onChange={ ( newValue ) => {
						if ( !! newValue ) {
							const gradientSlug = getGradientSlugByValue(
								gradients,
								newValue
							);

							const cssVarValue =
								!! gradientSlug &&
								`var(--wp--preset--color--${ gradientSlug })`;

							const newColor = cssVarValue || newValue;
							setColor( newColor );

							onChange(
								applyFormat( value, {
									type: name,
									attributes: {
										style: getStyleAttribute( {
											...styleProperties,
											'--unitone--text-gradient-gradient':
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

function GradientPicker( { value, onChange } ) {
	return (
		<ColorGradientControl
			label={ __( 'Color', 'unitone' ) }
			gradientValue={ value }
			onGradientChange={ onChange }
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

	return (
		<>
			<RichTextToolbarButton
				icon={
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						strokeWidth="0"
					>
						<path d="M17.4658 19H14.9736L13.6426 15.25H8.82324L7.49219 19H5L10.1406 5H12.3252L17.4658 19ZM9.59766 13.0693H12.8682L11.2334 8.46191L9.59766 13.0693ZM20.5 5H22.2998V6.5H20.5V8.2998H19V6.5H17.2998V5H19V3.2998H20.5V5Z" />
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
					isActive={ isActive }
				/>
			) }
		</>
	);
}

registerFormatType( settings.name, settings );
