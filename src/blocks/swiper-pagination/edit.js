import clsx from 'clsx';

import {
	SelectControl,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import {
	DEFAULT_SETTINGS,
	getStyle,
	resolveSettings,
	updateSetting,
} from './config';

const PIXEL_UNITS = [ { value: 'px', label: 'px', default: 0 } ];

export default function ( { attributes, setAttributes } ) {
	const rawSettings = attributes.settings || {};
	const settings = resolveSettings( rawSettings );

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const hasSetting = ( key ) =>
		Object.prototype.hasOwnProperty.call( rawSettings, key );

	const setSetting = ( key, value ) => {
		setAttributes( {
			settings: updateSetting( rawSettings, key, value ),
		} );
	};

	const resetSetting = ( key ) => setSetting( key, DEFAULT_SETTINGS[ key ] );

	const resetSettings = () => {
		const next = Object.keys( DEFAULT_SETTINGS ).reduce(
			( nextSettings, key ) =>
				updateSetting( nextSettings, key, DEFAULT_SETTINGS[ key ] ),
			rawSettings
		);

		setAttributes( { settings: next } );
	};

	const blockProps = useBlockProps( {
		className: clsx(
			'unitone-swiper-pagination',
			'swiper-pagination',
			`swiper-pagination-${ settings.type }`
		),
		style: getStyle( rawSettings ),
	} );

	return (
		<>
			<InspectorControls>
				<ToolsPanel
					label={ __( 'Settings', 'unitone' ) }
					resetAll={ resetSettings }
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => hasSetting( 'type' ) }
						isShownByDefault
						label={ __( 'Type', 'unitone' ) }
						onDeselect={ () => resetSetting( 'type' ) }
					>
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone' ) }
							value={ settings.type }
							options={ [
								{
									label: __( 'Bullets', 'unitone' ),
									value: 'bullets',
								},
								{
									label: __( 'Fraction', 'unitone' ),
									value: 'fraction',
								},
								{
									label: __( 'Progress bar', 'unitone' ),
									value: 'progressbar',
								},
							] }
							onChange={ ( value ) =>
								setSetting( 'type', value )
							}
						/>
					</ToolsPanelItem>

					{ 'bullets' === settings.type && (
						<>
							<ToolsPanelItem
								hasValue={ () =>
									hasSetting( 'dynamicBullets' )
								}
								isShownByDefault
								label={ __( 'Dynamic bullets', 'unitone' ) }
								onDeselect={ () =>
									resetSetting( 'dynamicBullets' )
								}
							>
								<ToggleControl
									__nextHasNoMarginBottom
									label={ __( 'Dynamic bullets', 'unitone' ) }
									checked={ settings.dynamicBullets }
									onChange={ ( value ) =>
										setSetting( 'dynamicBullets', value )
									}
								/>
							</ToolsPanelItem>

							<ToolsPanelItem
								hasValue={ () => hasSetting( 'bulletSize' ) }
								isShownByDefault
								label={ __( 'Bullet size', 'unitone' ) }
								onDeselect={ () =>
									resetSetting( 'bulletSize' )
								}
							>
								<UnitControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Bullet size', 'unitone' ) }
									value={ `${ settings.bulletSize }px` }
									units={ PIXEL_UNITS }
									min={ 1 }
									step={ 1 }
									onChange={ ( value ) =>
										setSetting( 'bulletSize', value )
									}
								/>
							</ToolsPanelItem>
						</>
					) }

					{ 'progressbar' === settings.type && (
						<ToolsPanelItem
							hasValue={ () => hasSetting( 'progressbarSize' ) }
							isShownByDefault
							label={ __( 'Progress bar size', 'unitone' ) }
							onDeselect={ () =>
								resetSetting( 'progressbarSize' )
							}
						>
							<UnitControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Progress bar size', 'unitone' ) }
								value={ `${ settings.progressbarSize }px` }
								units={ PIXEL_UNITS }
								min={ 1 }
								step={ 1 }
								onChange={ ( value ) =>
									setSetting( 'progressbarSize', value )
								}
							/>
						</ToolsPanelItem>
					) }
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				{ 'bullets' === settings.type &&
					[ 0, 1, 2, 3, 4 ].map( ( index ) => (
						<span
							key={ index }
							className={ clsx( 'swiper-pagination-bullet', {
								'swiper-pagination-bullet-active': 0 === index,
							} ) }
						/>
					) ) }

				{ 'fraction' === settings.type && (
					<>
						<span className="swiper-pagination-current">1</span>
						{ ' / ' }
						<span className="swiper-pagination-total">5</span>
					</>
				) }

				{ 'progressbar' === settings.type && (
					<span className="swiper-pagination-progressbar-fill" />
				) }
			</div>
		</>
	);
}
