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
			'unitone-swiper-arrow',
			`unitone-swiper-arrow--${ action }`,
			`swiper-button-${ 'next' === action ? 'next' : 'prev' }`
		),
		type: 'button',
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
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Action', 'unitone' ) }
							value={ action }
							options={ [
								{
									label: __( 'Previous', 'unitone' ),
									value: 'previous',
								},
								{
									label: __( 'Next', 'unitone' ),
									value: 'next',
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
						'next' === action
							? __( 'Next', 'unitone' )
							: __( 'Previous', 'unitone' )
					}
					onChange={ ( value ) =>
						setAttributes( { content: value } )
					}
				/>
			</button>
		</>
	);
}
