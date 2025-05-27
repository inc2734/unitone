/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import clsx from 'clsx';
import deepmerge from 'deepmerge';
import fastDeepEqual from 'fast-deep-equal/es6';

import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	useIsBlurDisabled,
	hasBlurValue,
	resetBlurFilter,
	resetBlur,
	getBlurEditLabel,
	BlurEdit,
} from './blur';

import {
	useIsBrightnessDisabled,
	hasBrightnessValue,
	resetBrightnessFilter,
	resetBrightness,
	getBrightnessEditLabel,
	BrightnessEdit,
} from './brightness';

import {
	useIsContrastDisabled,
	hasContrastValue,
	resetContrastFilter,
	resetContrast,
	getContrastEditLabel,
	ContrastEdit,
} from './contrast';

import {
	useIsGrayscaleDisabled,
	hasGrayscaleValue,
	resetGrayscaleFilter,
	resetGrayscale,
	getGrayscaleEditLabel,
	GrayscaleEdit,
} from './grayscale';

import {
	useIsHueRotateDisabled,
	hasHueRotateValue,
	resetHueRotateFilter,
	resetHueRotate,
	getHueRotateEditLabel,
	HueRotateEdit,
} from './hue-rotate';

import {
	useIsInvertDisabled,
	hasInvertValue,
	resetInvertFilter,
	resetInvert,
	getInvertEditLabel,
	InvertEdit,
} from './invert';

import {
	useIsSaturateDisabled,
	hasSaturateValue,
	resetSaturateFilter,
	resetSaturate,
	getSaturateEditLabel,
	SaturateEdit,
} from './saturate';

import {
	useIsSepiaDisabled,
	hasSepiaValue,
	resetSepiaFilter,
	resetSepia,
	getSepiaEditLabel,
	SepiaEdit,
} from './sepia';

import {
	useIsProgressiveDisabled,
	hasProgressiveValue,
	resetProgressiveFilter,
	resetProgressive,
	getProgressiveEditLabel,
	ProgressiveEdit,
} from './progressive';

export const useResetBackdropFilter = ( props ) => {
	const filters = [
		[ useIsBlurDisabled, resetBlurFilter ],
		[ useIsBrightnessDisabled, resetBrightnessFilter ],
		[ useIsContrastDisabled, resetContrastFilter ],
		[ useIsGrayscaleDisabled, resetGrayscaleFilter ],
		[ useIsHueRotateDisabled, resetHueRotateFilter ],
		[ useIsInvertDisabled, resetInvertFilter ],
		[ useIsSaturateDisabled, resetSaturateFilter ],
		[ useIsSepiaDisabled, resetSepiaFilter ],
		[ useIsProgressiveDisabled, resetProgressiveFilter ],
	];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? deepmerge( accumulator, resetFilter() )
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

export function useBackdropFilterBlockProps( settings ) {
	const {
		attributes: { unitone },
		name,
	} = settings;

	const backdropFilter = unitone?.backdropFilter;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.backdropFilter;
		},
		[ name ]
	);

	const backdropFilterProps = [];
	const hasBackdropFilterSupport =
		true === getBlockSupport( name, 'unitone.backdropFilter' );

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.blur' ) ||
		hasBackdropFilterSupport
	) {
		const blur = backdropFilter?.blur ?? defaultValue?.blur;
		if ( null != blur && 0 !== blur ) {
			backdropFilterProps.push( {
				blur: `${ blur }px`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.brightness' ) ||
		hasBackdropFilterSupport
	) {
		const brightness =
			backdropFilter?.brightness ?? defaultValue?.brightness;
		if ( null != brightness && 100 !== brightness ) {
			backdropFilterProps.push( {
				brightness: `${ brightness }%`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.contrast' ) ||
		hasBackdropFilterSupport
	) {
		const contrast = backdropFilter?.contrast ?? defaultValue?.contrast;
		if ( null != contrast && 100 !== contrast ) {
			backdropFilterProps.push( {
				contrast: `${ contrast }%`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.grayscale' ) ||
		hasBackdropFilterSupport
	) {
		const grayscale = backdropFilter?.grayscale ?? defaultValue?.grayscale;
		if ( null != grayscale && 0 !== grayscale ) {
			backdropFilterProps.push( {
				grayscale: `${ grayscale }%`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.hueRotate' ) ||
		hasBackdropFilterSupport
	) {
		const hueRotate = backdropFilter?.hueRotate ?? defaultValue?.hueRotate;
		if ( null != hueRotate && 0 !== hueRotate ) {
			backdropFilterProps.push( {
				'hue-rotate': `${ hueRotate }deg`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.invert' ) ||
		hasBackdropFilterSupport
	) {
		const invert = backdropFilter?.invert ?? defaultValue?.invert;
		if ( null != invert && 0 !== invert ) {
			backdropFilterProps.push( {
				invert: `${ invert }%`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.saturate' ) ||
		hasBackdropFilterSupport
	) {
		const saturate = backdropFilter?.saturate ?? defaultValue?.saturate;
		if ( null != saturate && 100 !== saturate ) {
			backdropFilterProps.push( {
				saturate: `${ saturate }%`,
			} );
		}
	}

	if (
		hasBlockSupport( name, 'unitone.backdropFilter.sepia' ) ||
		hasBackdropFilterSupport
	) {
		const sepia = backdropFilter?.sepia ?? defaultValue?.sepia;
		if ( null != sepia && 0 !== sepia ) {
			backdropFilterProps.push( {
				sepia: `${ sepia }%`,
			} );
		}
	}

	const progressiveAngle =
		backdropFilter?.progressive?.angle ?? defaultValue?.progressive?.angle;
	const progressiveStart =
		backdropFilter?.progressive?.start ?? defaultValue?.progressive?.start;
	const hasProgressiveSupport =
		( hasBlockSupport( name, 'unitone.backdropFilter.progressive' ) ||
			hasBackdropFilterSupport ) &&
		null != progressiveStart &&
		0 < progressiveStart;

	if ( 1 > backdropFilterProps.length && ! hasProgressiveSupport ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					'-progressive-backdrop-filter': hasProgressiveSupport,
				}
			),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--backdrop-filter':
					0 < backdropFilterProps.length
						? backdropFilterProps
								.map(
									( v ) =>
										`${ Object.keys( v )[ 0 ] }(${
											Object.values( v )[ 0 ]
										})`
								)
								.join( ' ' )
						: undefined,
				'--unitone--progressive-backdrop-filter-angle':
					hasProgressiveSupport && progressiveAngle
						? `${ progressiveAngle }deg`
						: undefined,
				'--unitone--progressive-backdrop-filter-start':
					hasProgressiveSupport
						? `${ progressiveStart }%`
						: undefined,
			},
		},
	};
}

function BackdropFilterPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				deepmerge.all( [
					{ ...attributes?.unitone },
					resetBlurFilter(),
					resetBrightnessFilter(),
					resetContrastFilter(),
					resetGrayscaleFilter(),
					resetHueRotateFilter(),
					resetInvertFilter(),
					resetSaturateFilter(),
					resetSepiaFilter(),
					resetProgressiveFilter(),
				] )
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	const isBlurDisabled = useIsBlurDisabled( { name } );
	const isBrightnessDisabled = useIsBrightnessDisabled( { name } );
	const isContrastDisabled = useIsContrastDisabled( { name } );
	const isGrayscaleDisabled = useIsGrayscaleDisabled( { name } );
	const isHueRotateDisabled = useIsHueRotateDisabled( { name } );
	const isInvertDisabled = useIsInvertDisabled( { name } );
	const isSaturateDisabled = useIsSaturateDisabled( { name } );
	const isSepiaDisabled = useIsSepiaDisabled( { name } );
	const isProgressiveDisabled = useIsProgressiveDisabled( { name } );

	if (
		isBlurDisabled &&
		isBrightnessDisabled &&
		isContrastDisabled &&
		isGrayscaleDisabled &&
		isHueRotateDisabled &&
		isInvertDisabled &&
		isSaturateDisabled &&
		isSepiaDisabled &&
		isProgressiveDisabled
	) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<ToolsPanel
				label={ __( 'Backdrop Filter', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
				dropdownMenuProps={ dropdownMenuProps }
			>
				{ ! isBlurDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasBlurValue( { ...props } ) }
						label={ getBlurEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetBlur( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<BlurEdit
							{ ...props }
							label={ getBlurEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isBrightnessDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasBrightnessValue( { ...props } ) }
						label={ getBrightnessEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetBrightness( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
						show
					>
						<BrightnessEdit
							{ ...props }
							label={ getBrightnessEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isContrastDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasContrastValue( { ...props } ) }
						label={ getContrastEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetContrast( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<ContrastEdit
							{ ...props }
							label={ getContrastEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isGrayscaleDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGrayscaleValue( { ...props } ) }
						label={ getGrayscaleEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetGrayscale( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<GrayscaleEdit
							{ ...props }
							label={ getGrayscaleEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isHueRotateDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasHueRotateValue( { ...props } ) }
						label={ getHueRotateEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetHueRotate( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<HueRotateEdit
							{ ...props }
							label={ getHueRotateEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isInvertDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasInvertValue( { ...props } ) }
						label={ getInvertEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetInvert( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<InvertEdit
							{ ...props }
							label={ getInvertEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isSaturateDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasSaturateValue( { ...props } ) }
						label={ getSaturateEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetSaturate( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<SaturateEdit
							{ ...props }
							label={ getSaturateEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isSepiaDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasSepiaValue( { ...props } ) }
						label={ getSepiaEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetSepia( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<SepiaEdit
							{ ...props }
							label={ getSepiaEditLabel( {
								...props,
								__withCode: true,
							} ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isProgressiveDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasProgressiveValue( { ...props } ) }
						label={ getProgressiveEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetProgressive( { ...props } ) }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<ProgressiveEdit
							{ ...props }
							label={ getProgressiveEditLabel( {
								...props,
							} ) }
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const BackdropFilterPanel = memo(
	BackdropFilterPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
