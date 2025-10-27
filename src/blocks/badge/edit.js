import clsx from 'clsx';

import {
	useBlockProps,
	RichText,
	InspectorControls,
	__experimentalUseColorProps as useColorProps,
} from '@wordpress/block-editor';

import {
	Button,
	BaseControl,
	__experimentalUnitControl as UnitControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import metadata from './block.json';

export default function ( { attributes, setAttributes } ) {
	const { content, shape, minHeight } = attributes;

	const shapes = [
		{
			name: 'circle',
			label: __( 'Circle', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="9" />
				</svg>
			),
		},
		{
			name: 'ribbon',
			label: __( 'Ribbon', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M4 3H20V22L12 18.4375L4 22V3Z" />
				</svg>
			),
		},
		{
			name: 'crown',
			label: __( 'Crown', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M0 6.16667L6.72917 11.7083L11.875 3L16.625 11.7083L23.75 6.16667L20.3194 22H2.90278L0 6.16667Z" />
				</svg>
			),
		},
		{
			name: 'square',
			label: __( 'Square', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<rect x="4" y="4" width="16" height="16" />
				</svg>
			),
		},
		{
			name: 'box',
			label: __( 'Box', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M20 20H4V4H20V20ZM5 19H19V5H5V19Z" />
				</svg>
			),
		},
		{
			name: 'diamond',
			label: __( 'Diamond', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M21 12L12 21L3 12L12 3L21 12Z" />
				</svg>
			),
		},
		{
			name: 'speech-left',
			label: __( 'Speech (Left)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M18.5996 5C19.3728 5 20 5.62719 20 6.40039V15.5996C20 16.3728 19.3728 17 18.5996 17H16.333L16.8193 19.9141C16.8807 20.2826 16.4478 20.5264 16.1641 20.2832L12.333 17H5.40039C4.62719 17 4 16.3728 4 15.5996V6.40039C4 5.62719 4.62719 5 5.40039 5H18.5996Z" />
				</svg>
			),
		},
		{
			name: 'speech-right',
			label: __( 'Speech (Right)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M5.40039 5C4.62719 5 4 5.62719 4 6.40039V15.5996C4 16.3728 4.62719 17 5.40039 17H7.66699L7.18066 19.9141C7.11926 20.2826 7.55224 20.5264 7.83594 20.2832L11.667 17H18.5996C19.3728 17 20 16.3728 20 15.5996V6.40039C20 5.62719 19.3728 5 18.5996 5H5.40039Z" />
				</svg>
			),
		},
		{
			name: 'thorn-ball',
			label: __( 'Thorn ball', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M11.6356 2.14443C11.8305 1.95195 12.144 1.95177 12.3388 2.14443L13.9569 3.74599C13.9806 3.76949 13.9997 3.79547 14.0175 3.82119C14.1152 3.84541 14.2121 3.8717 14.3085 3.89931C14.3375 3.88545 14.369 3.87385 14.4022 3.86513L16.6034 3.28701C16.8685 3.21747 17.1405 3.37515 17.2128 3.63955L17.8134 5.83486C17.8226 5.86854 17.8266 5.90193 17.829 5.93447C17.9001 6.00308 17.9694 6.07337 18.038 6.14443C18.071 6.14678 18.1053 6.15167 18.1395 6.16103L20.3349 6.76162C20.599 6.834 20.7557 7.10506 20.6864 7.37001L20.1083 9.57216C20.0996 9.60539 20.087 9.63595 20.0731 9.66494C20.1006 9.76071 20.1272 9.85686 20.1513 9.954C20.1778 9.9722 20.2042 9.993 20.2284 10.0175L21.829 11.6356C22.0217 11.8305 22.0218 12.144 21.829 12.3388L20.2284 13.9569C20.2044 13.9812 20.1776 14.0004 20.1513 14.0185C20.1271 14.1159 20.1007 14.2124 20.0731 14.3085C20.0871 14.3376 20.0995 14.3688 20.1083 14.4022L20.6864 16.6034C20.756 16.8685 20.5992 17.1404 20.3349 17.2128L18.1395 17.8134C18.1053 17.8227 18.071 17.8266 18.038 17.829C17.9695 17.8999 17.8999 17.9695 17.829 18.038C17.8266 18.071 17.8227 18.1053 17.8134 18.1395L17.2128 20.3349C17.1404 20.5992 16.8685 20.756 16.6034 20.6864L14.4022 20.1083C14.3688 20.0995 14.3376 20.0871 14.3085 20.0731C14.2124 20.1007 14.1159 20.1271 14.0185 20.1513C14.0004 20.1776 13.9812 20.2044 13.9569 20.2284L12.3388 21.829C12.144 22.0218 11.8305 22.0217 11.6356 21.829L10.0175 20.2284C9.99301 20.2042 9.9722 20.1778 9.954 20.1513C9.85686 20.1272 9.76071 20.1006 9.66494 20.0731C9.63595 20.087 9.60539 20.0996 9.57216 20.1083L7.37001 20.6864C7.10506 20.7558 6.834 20.599 6.76162 20.3349L6.16103 18.1395C6.15167 18.1053 6.14678 18.071 6.14443 18.038C6.07337 17.9694 6.00308 17.9001 5.93447 17.829C5.90193 17.8266 5.86854 17.8226 5.83486 17.8134L3.63955 17.2128C3.37514 17.1405 3.21746 16.8685 3.28701 16.6034L3.86513 14.4022C3.87385 14.369 3.88545 14.3375 3.89931 14.3085C3.8717 14.2121 3.84541 14.1152 3.82119 14.0175C3.79547 13.9997 3.76949 13.9806 3.74599 13.9569L2.14443 12.3388C1.95177 12.144 1.95195 11.8305 2.14443 11.6356L3.74599 10.0175C3.76978 9.99345 3.79513 9.97295 3.82119 9.95497C3.84535 9.85754 3.87178 9.76099 3.89931 9.66494C3.88554 9.63608 3.87381 9.60522 3.86513 9.57216L3.28701 7.37001C3.21773 7.10501 3.37528 6.83389 3.63955 6.76162L5.83486 6.16103C5.8686 6.15181 5.90187 6.14684 5.93447 6.14443C6.00324 6.0732 6.07321 6.00324 6.14443 5.93447C6.14684 5.90187 6.15181 5.8686 6.16103 5.83486L6.76162 3.63955C6.83389 3.37528 7.10501 3.21773 7.37001 3.28701L9.57216 3.86513C9.60522 3.87381 9.63608 3.88554 9.66494 3.89931C9.76099 3.87178 9.85754 3.84535 9.95498 3.82119C9.97295 3.79513 9.99345 3.76978 10.0175 3.74599L11.6356 2.14443Z" />
				</svg>
			),
		},
		{
			name: 'box-cutter-left',
			label: __( 'Box cutter (Left)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M22 4L16 20H2L8 4H22Z" />
				</svg>
			),
		},
		{
			name: 'box-cutter-right',
			label: __( 'Box cutter (Right)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M16 4L22 20H8L2 4H16Z" />
				</svg>
			),
		},
		{
			name: 'corner-top-left',
			label: __( 'Corner (Top Left)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M2 2H18L10 10L2 18V2Z" />
				</svg>
			),
		},
		{
			name: 'inspiration',
			label: __( 'Inspiration', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M6.97363 21H3V20H6.97363V21ZM9.95508 20.8301H7.96777V19.8359H9.95508V20.8301ZM11.1562 15.8232L10.7773 16.7432L8.94141 15.9775L9.31934 15.0576L11.1562 15.8232ZM8.33887 14.8262L7.95898 15.75L4.28711 14.2197L4.66797 13.2959L8.33887 14.8262ZM13.708 12.8369L13.0059 13.5439L11.6006 12.1299L12.3027 11.4229L13.708 12.8369ZM11.4844 10.832L10.7812 11.5391L7.97168 8.71094L8.67383 8.00391L11.4844 10.832ZM17.0693 10.6094L16.1465 10.9941L15.3857 9.14551L16.3086 8.76172L17.0693 10.6094ZM21.042 10.001H20.041V8H21.042V10.001ZM15.7754 7.90137L14.8574 8.28418L13.3369 4.58887L14.2539 4.20605L15.7754 7.90137ZM20.875 7H19.8818V3H20.875V7Z" />
				</svg>
			),
		},
		{
			name: 'radiation',
			label: __( 'Radiation', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M12.375 21H11.625V18.75H12.375V21ZM9.76367 18.3799L8.90234 20.458L8.20898 20.1719L9.07031 18.0928L9.76367 18.3799ZM15.791 20.1709L15.0977 20.458L14.2363 18.3799L14.9297 18.0928L15.791 20.1709ZM7.49219 17.0381L5.90137 18.6289L5.37109 18.0986L6.96191 16.5078L7.49219 17.0381ZM18.6289 18.0986L18.0986 18.6289L16.5078 17.0381L17.0381 16.5078L18.6289 18.0986ZM5.90723 14.9297L3.82812 15.791L3.54199 15.0977L5.62012 14.2363L5.90723 14.9297ZM20.458 15.0977L20.1719 15.791L18.0928 14.9297L18.3799 14.2363L20.458 15.0977ZM5.25 12.375H3V11.625H5.25V12.375ZM21 12.375H18.75V11.625H21V12.375ZM5.90723 9.07031L5.62012 9.76367L3.54199 8.90234L3.82812 8.20898L5.90723 9.07031ZM20.458 8.90234L18.3799 9.76367L18.0928 9.07031L20.1719 8.20898L20.458 8.90234ZM7.49219 6.96191L6.96191 7.49219L5.37109 5.90137L5.90137 5.37109L7.49219 6.96191ZM18.6289 5.90137L17.0381 7.49219L16.5078 6.96191L18.0986 5.37109L18.6289 5.90137ZM9.76367 5.62012L9.07031 5.90723L8.20898 3.82812L8.90234 3.54199L9.76367 5.62012ZM15.791 3.82812L14.9297 5.90723L14.2363 5.62012L15.0977 3.54199L15.791 3.82812ZM12.375 5.25H11.625V3H12.375V5.25Z" />
				</svg>
			),
		},
		{
			name: 'dot-circle',
			label: __( 'Dot circle', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 19.5C12.4142 19.5 12.75 19.8358 12.75 20.25C12.75 20.6642 12.4142 21 12 21C11.5858 21 11.25 20.6642 11.25 20.25C11.25 19.8358 11.5858 19.5 12 19.5ZM8.15039 19.335C8.30895 18.9524 8.74728 18.7703 9.12988 18.9287C9.51257 19.0872 9.69465 19.5265 9.53613 19.9092C9.37761 20.2918 8.93834 20.473 8.55566 20.3145C8.17319 20.1558 7.99192 19.7175 8.15039 19.335ZM14.8701 18.9287C15.2527 18.7703 15.691 18.9525 15.8496 19.335C16.0081 19.7175 15.8268 20.1558 15.4443 20.3145C15.0617 20.473 14.6224 20.2919 14.4639 19.9092C14.3054 19.5265 14.4874 19.0872 14.8701 18.9287ZM5.63574 17.3037C5.92864 17.0108 6.4034 17.0108 6.69629 17.3037C6.98916 17.5966 6.98918 18.0714 6.69629 18.3643C6.40337 18.6568 5.92852 18.657 5.63574 18.3643C5.34297 18.0715 5.34321 17.5966 5.63574 17.3037ZM17.3037 17.3037C17.5966 17.0108 18.0714 17.0108 18.3643 17.3037C18.6568 17.5966 18.657 18.0715 18.3643 18.3643C18.0715 18.657 17.5966 18.6568 17.3037 18.3643C17.0108 18.0714 17.0108 17.5966 17.3037 17.3037ZM4.09082 14.4639C4.4735 14.3054 4.91278 14.4874 5.07129 14.8701C5.22967 15.2527 5.04754 15.691 4.66504 15.8496C4.28247 16.0081 3.84418 15.8268 3.68555 15.4443C3.52703 15.0617 3.70814 14.6224 4.09082 14.4639ZM18.9287 14.8701C19.0872 14.4874 19.5265 14.3054 19.9092 14.4639C20.2919 14.6224 20.473 15.0617 20.3145 15.4443C20.1558 15.8268 19.7175 16.0081 19.335 15.8496C18.9524 15.691 18.7703 15.2527 18.9287 14.8701ZM3.75 11.25C4.16421 11.25 4.5 11.5858 4.5 12C4.5 12.4142 4.16421 12.75 3.75 12.75C3.33579 12.75 3 12.4142 3 12C3 11.5858 3.33579 11.25 3.75 11.25ZM20.25 11.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75C19.8358 12.75 19.5 12.4142 19.5 12C19.5 11.5858 19.8358 11.25 20.25 11.25ZM3.68555 8.55566C3.84418 8.17322 4.28247 7.99193 4.66504 8.15039C5.04754 8.30895 5.22966 8.7473 5.07129 9.12988C4.91278 9.51257 4.4735 9.69465 4.09082 9.53613C3.70814 9.37762 3.52703 8.93835 3.68555 8.55566ZM19.335 8.15039C19.7175 7.99192 20.1558 8.17319 20.3145 8.55566C20.473 8.93834 20.2918 9.37761 19.9092 9.53613C19.5265 9.69465 19.0872 9.51257 18.9287 9.12988C18.7703 8.74728 18.9524 8.30895 19.335 8.15039ZM5.63574 5.63574C5.92852 5.34298 6.40337 5.34321 6.69629 5.63574C6.98918 5.92863 6.98917 6.40339 6.69629 6.69629C6.4034 6.98918 5.92864 6.98918 5.63574 6.69629C5.3432 6.40337 5.34297 5.92852 5.63574 5.63574ZM17.3037 5.63574C17.5966 5.3432 18.0715 5.34296 18.3643 5.63574C18.657 5.92852 18.6568 6.40337 18.3643 6.69629C18.0714 6.98918 17.5966 6.98916 17.3037 6.69629C17.0108 6.4034 17.0108 5.92864 17.3037 5.63574ZM8.55566 3.68555C8.93834 3.52704 9.37761 3.70815 9.53613 4.09082C9.69465 4.4735 9.51257 4.91278 9.12988 5.07129C8.74729 5.22969 8.30895 5.04756 8.15039 4.66504C7.99192 4.28246 8.17319 3.84417 8.55566 3.68555ZM14.4639 4.09082C14.6224 3.70814 15.0617 3.52606 15.4443 3.68457C15.827 3.84308 16.0081 4.28236 15.8496 4.66504C15.691 5.04753 15.2527 5.22966 14.8701 5.07129C14.4874 4.91278 14.3054 4.4735 14.4639 4.09082ZM12 3C12.4142 3 12.75 3.33579 12.75 3.75C12.75 4.16421 12.4142 4.5 12 4.5C11.5858 4.5 11.25 4.16421 11.25 3.75C11.25 3.33579 11.5858 3 12 3Z" />
				</svg>
			),
		},
		{
			name: 'slash-top',
			label: __( 'Slash (Top)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M13.2627 0.582031L0.813477 17.9902L0 17.4082L12.4492 0L13.2627 0.582031Z" />
				</svg>
			),
		},
		{
			name: 'slash-bottom',
			label: __( 'Slash (Bottom)', 'unitone' ),
			shape: (
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M23.9627 6.58203L11.5135 23.9902L10.7 23.4082L23.1492 6L23.9627 6.58203Z" />
				</svg>
			),
		},
	];

	const backgroundColorProps = useColorProps( {
		backgroundColor: attributes?.backgroundColor,
		style: {
			color: {
				background: attributes?.style?.color?.background,
			},
		},
	} );

	const textColorProps = useColorProps( {
		textColor: attributes?.textColor,
		style: {
			color: {
				text: attributes?.style?.color?.text,
			},
		},
	} );

	const blockProps = useBlockProps( {
		className: clsx(
			'unitone-badge',
			[ `-shape:${ shape }` ],
			textColorProps.className
		),
		style: {
			...textColorProps.style,
			'--unitone--min-height': minHeight || undefined,
		},
	} );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () =>
							shape !== metadata.attributes.shape.default
						}
						isShownByDefault
						label={ __( 'Shape', 'unitone' ) }
						onDeselect={ () => {
							setAttributes( {
								shape: metadata.attributes.shape.default,
							} );
						} }
					>
						<BaseControl
							__nextHasNoMarginBottom
							label={ __( 'Shape', 'unitone' ) }
							id="unitone/badge/shape"
						>
							<fieldset className="block-editor-text-transform-control">
								<div
									className="block-editor-text-transform-control__buttons"
									style={ {
										display: 'flex',
										flexWrap: 'wrap',
									} }
								>
									{ shapes.map( ( _shape, index ) => (
										<Button
											key={ index }
											className="has-icon"
											label={ _shape.label }
											isPressed={ shape === _shape?.name }
											onClick={ () =>
												setAttributes( {
													shape: _shape.name,
												} )
											}
										>
											{ _shape.shape }
										</Button>
									) ) }
								</div>
							</fieldset>
						</BaseControl>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () =>
							minHeight !== metadata.attributes.minHeight.default
						}
						isShownByDefault
						label={ __( 'Size', 'unitone' ) }
						onDeselect={ () => {
							setAttributes( {
								minHeight:
									metadata.attributes.minHeight.default,
							} );
						} }
					>
						<UnitControl
							__next40pxDefaultSize
							label={ __( 'Size', 'unitone' ) }
							value={ minHeight }
							style={ { width: '100%' } }
							onChange={ ( newAttribute ) =>
								setAttributes( {
									minHeight: newAttribute || minHeight,
								} )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps } className={ blockProps.className }>
				<div
					className={ clsx(
						'unitone-badge__background',
						backgroundColorProps.className
					) }
					style={ {
						...backgroundColorProps.style,
					} }
				/>

				<RichText
					tagName="p"
					className="unitone-badge__text"
					value={ content }
					onChange={ ( newAttribute ) => {
						setAttributes( {
							content: newAttribute,
						} );
					} }
					placeholder="0"
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
				/>
			</div>
		</>
	);
}
