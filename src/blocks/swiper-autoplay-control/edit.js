import clsx from 'clsx';

import {
	BlockControls,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';

import {
	SelectControl,
	ToolbarButton,
	ToolbarGroup,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { action, content, playContent, pauseContent } = attributes;

	const [ editedAction, setEditedAction ] = useState( 'play' );

	const isToggle = 'toggle' === action;
	const displayedAction = isToggle ? editedAction : action;
	const toggleContent = 'play' === editedAction ? playContent : pauseContent;
	const displayedContent = isToggle ? toggleContent : content;
	const pauseLabel = isToggle
		? __( 'Stop', 'unitone' )
		: __( 'Pause', 'unitone' );
	const label =
		'play' === displayedAction ? __( 'Play', 'unitone' ) : pauseLabel;
	const contentAttribute = isToggle ? `${ editedAction }Content` : 'content';

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetAction = () => {
		setAttributes( { action: metadata.attributes.action.default } );
		setEditedAction( 'play' );
	};

	const blockProps = useBlockProps( {
		className: clsx(
			'unitone-swiper-autoplay-control',
			`unitone-swiper-autoplay-control--${ action }`
		),
		type: 'button',
		'data-unitone-swiper-autoplay-action': action,
		'aria-label': label,
	} );

	return (
		<>
			{ isToggle && (
				<BlockControls group="other">
					<ToolbarGroup
						role="group"
						aria-label={ __( 'Button to edit', 'unitone' ) }
					>
						<ToolbarButton
							label={ __( 'Edit play button', 'unitone' ) }
							showTooltip
							isPressed={ 'play' === editedAction }
							onClick={ () => setEditedAction( 'play' ) }
						>
							{ __( 'Play', 'unitone' ) }
						</ToolbarButton>
						<ToolbarButton
							label={ __( 'Edit stop button', 'unitone' ) }
							showTooltip
							isPressed={ 'pause' === editedAction }
							onClick={ () => setEditedAction( 'pause' ) }
						>
							{ __( 'Stop', 'unitone' ) }
						</ToolbarButton>
					</ToolbarGroup>
				</BlockControls>
			) }

			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					resetAll={ resetAction }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							metadata.attributes.action.default !== action
						}
						isShownByDefault
						label={ __( 'Action', 'unitone' ) }
						onDeselect={ resetAction }
					>
						<SelectControl
							__nextHasNoMarginBottom
							label={ __( 'Action', 'unitone' ) }
							value={ action }
							options={ [
								{
									label: __( 'Play', 'unitone' ),
									value: 'play',
								},
								{
									label: __( 'Pause', 'unitone' ),
									value: 'pause',
								},
								{
									label: __( 'Play / Pause', 'unitone' ),
									value: 'toggle',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { action: value } )
							}
						/>
					</ToolsPanelItem>

					{ isToggle && (
						<ToolsPanelItem
							hasValue={ () => 'play' !== editedAction }
							isShownByDefault
							label={ __( 'Button to edit', 'unitone' ) }
							onDeselect={ () => setEditedAction( 'play' ) }
						>
							<ToggleGroupControl
								__nextHasNoMarginBottom
								isBlock
								label={ __( 'Button to edit', 'unitone' ) }
								help={ __(
									'Edit the selected button text on the canvas.',
									'unitone'
								) }
								value={ editedAction }
								onChange={ setEditedAction }
							>
								<ToggleGroupControlOption
									value="play"
									label={ __( 'Play', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="pause"
									label={ __( 'Stop', 'unitone' ) }
								/>
							</ToggleGroupControl>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<button { ...blockProps }>
				<RichText
					key={ displayedAction }
					tagName="span"
					value={ displayedContent }
					withoutInteractiveFormatting
					placeholder={ label }
					onChange={ ( value ) =>
						setAttributes( { [ contentAttribute ]: value } )
					}
				/>
			</button>
		</>
	);
}
