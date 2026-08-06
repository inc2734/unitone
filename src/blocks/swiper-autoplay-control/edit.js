import clsx from 'clsx';

import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { action, content } = attributes;

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const resetAction = () =>
		setAttributes( { action: metadata.attributes.action.default } );

	const blockProps = useBlockProps( {
		className: clsx(
			'unitone-swiper-autoplay-control',
			`unitone-swiper-autoplay-control--${ action }`
		),
		type: 'button',
		'data-unitone-swiper-autoplay-action': action,
		'aria-label':
			'play' === action
				? __( 'Play', 'unitone' )
				: __( 'Pause', 'unitone' ),
	} );

	return (
		<>
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
							] }
							onChange={ ( value ) =>
								setAttributes( { action: value } )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<button { ...blockProps }>
				<RichText
					tagName="span"
					value={ content }
					withoutInteractiveFormatting
					placeholder={
						'play' === action
							? __( 'Play', 'unitone' )
							: __( 'Pause', 'unitone' )
					}
					onChange={ ( value ) =>
						setAttributes( { content: value } )
					}
				/>
			</button>
		</>
	);
}
