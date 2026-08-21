import {
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
	normalizeSetting,
	resolveSettings,
} from './config';

const PIXEL_UNITS = [
	{ value: 'px', label: 'px', default: DEFAULT_SETTINGS.size },
];

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
		className: 'unitone-swiper-scrollbar swiper-scrollbar',
		style: getStyle( attributes ),
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
						hasValue={ () => hasSetting( 'hide' ) }
						isShownByDefault
						label={ __( 'Hide after interaction', 'unitone' ) }
						onDeselect={ () => resetSetting( 'hide' ) }
					>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Hide after interaction', 'unitone' ) }
							checked={ settings.hide }
							onChange={ ( value ) =>
								setSetting( 'hide', value )
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasSetting( 'size' ) }
						isShownByDefault
						label={ __( 'Scrollbar size', 'unitone' ) }
						onDeselect={ () => resetSetting( 'size' ) }
					>
						<UnitControl
							__nextHasNoMarginBottom
							label={ __( 'Scrollbar size', 'unitone' ) }
							value={ `${ settings.size }px` }
							units={ PIXEL_UNITS }
							min={ 1 }
							step={ 1 }
							onChange={ ( value ) =>
								setSetting( 'size', value )
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="swiper-scrollbar-drag" />
			</div>
		</>
	);
}
