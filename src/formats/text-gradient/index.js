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
