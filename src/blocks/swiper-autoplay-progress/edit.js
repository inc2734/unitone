import clsx from 'clsx';

import {
	SelectControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';

import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { __, _x } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../../js/editor/hooks/utils';

import {
	DEFAULT_SETTINGS,
	getStyle,
	normalizeSetting,
	resolveSettings,
} from './config';

const PIXEL_UNITS = [ { value: 'px', label: 'px', default: 0 } ];

export default function ( { attributes, setAttributes } ) {
	const settings = resolveSettings( attributes );
	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const hasSetting = ( key ) => DEFAULT_SETTINGS[ key ] !== settings[ key ];

	const setSetting = ( key, value ) => {
		setAttributes( {
			[ key ]: normalizeSetting( key, value ),
		} );
	};

	const resetSetting = ( key ) => setSetting( key, DEFAULT_SETTINGS[ key ] );
	const resetSettings = () => setAttributes( DEFAULT_SETTINGS );

	const blockProps = useBlockProps( {
		className: clsx(
			'unitone-swiper-autoplay-progress',
			`unitone-swiper-autoplay-progress--${ settings.type }`
		),
		style: getStyle( attributes ),
		'aria-hidden': true,
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
							__nextHasNoMarginBottom
							label={ __( 'Type', 'unitone' ) }
							value={ settings.type }
							options={ [
								{
									label: __( 'Bar', 'unitone' ),
									value: 'bar',
								},
								{
									label: _x(
										'Circle',
										'autoplay progress type',
										'unitone'
									),
									value: 'circle',
								},
							] }
							onChange={ ( value ) =>
								setSetting( 'type', value )
							}
						/>
					</ToolsPanelItem>

					{ 'circle' === settings.type && (
						<ToolsPanelItem
							hasValue={ () => hasSetting( 'circleSize' ) }
							isShownByDefault
							label={ __( 'Circle size', 'unitone' ) }
							onDeselect={ () => resetSetting( 'circleSize' ) }
						>
							<UnitControl
								__nextHasNoMarginBottom
								label={ __( 'Circle size', 'unitone' ) }
								value={ `${ settings.circleSize }px` }
								units={ PIXEL_UNITS }
								min={ 1 }
								step={ 1 }
								onChange={ ( value ) =>
									setSetting( 'circleSize', value )
								}
							/>
						</ToolsPanelItem>
					) }

					<ToolsPanelItem
						hasValue={ () => hasSetting( 'thickness' ) }
						isShownByDefault
						label={ __( 'Thickness', 'unitone' ) }
						onDeselect={ () => resetSetting( 'thickness' ) }
					>
						<UnitControl
							__nextHasNoMarginBottom
							label={ __( 'Thickness', 'unitone' ) }
							value={ `${ settings.thickness }px` }
							units={ PIXEL_UNITS }
							min={ 1 }
							step={ 1 }
							onChange={ ( value ) =>
								setSetting( 'thickness', value )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="unitone-swiper-autoplay-progress__track">
					<span className="unitone-swiper-autoplay-progress__fill" />
				</div>
			</div>
		</>
	);
}
