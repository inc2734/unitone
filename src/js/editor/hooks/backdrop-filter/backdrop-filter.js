/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

import {
	useIsBlurDisabled,
	hasBlurValue,
	resetBlurFilter,
	resetBlur,
	getBlurEditLabel,
	BlurEdit,
	useBlurBlockProps,
} from './blur';

import {
	useIsBrightnessDisabled,
	hasBrightnessValue,
	resetBrightnessFilter,
	resetBrightness,
	getBrightnessEditLabel,
	BrightnessEdit,
	useBrightnessBlockProps,
} from './brightness';

import {
	useIsContrastDisabled,
	hasContrastValue,
	resetContrastFilter,
	resetContrast,
	getContrastEditLabel,
	ContrastEdit,
	useContrastBlockProps,
} from './contrast';

import {
	useIsGrayscaleDisabled,
	hasGrayscaleValue,
	resetGrayscaleFilter,
	resetGrayscale,
	getGrayscaleEditLabel,
	GrayscaleEdit,
	useGrayscaleBlockProps,
} from './grayscale';

import {
	useIsHueRotateDisabled,
	hasHueRotateValue,
	resetHueRotateFilter,
	resetHueRotate,
	getHueRotateEditLabel,
	HueRotateEdit,
	useHueRotateBlockProps,
} from './hue-rotate';

import {
	useIsInvertDisabled,
	hasInvertValue,
	resetInvertFilter,
	resetInvert,
	getInvertEditLabel,
	InvertEdit,
	useInvertBlockProps,
} from './invert';

import {
	useIsSaturateDisabled,
	hasSaturateValue,
	resetSaturateFilter,
	resetSaturate,
	getSaturateEditLabel,
	SaturateEdit,
	useSaturateBlockProps,
} from './saturate';

import {
	useIsSepiaDisabled,
	hasSepiaValue,
	resetSepiaFilter,
	resetSepia,
	getSepiaEditLabel,
	SepiaEdit,
	useSepiaBlockProps,
} from './sepia';

export {
	useBlurBlockProps,
	useBrightnessBlockProps,
	useContrastBlockProps,
	useGrayscaleBlockProps,
	useHueRotateBlockProps,
	useInvertBlockProps,
	useSaturateBlockProps,
	useSepiaBlockProps,
};

function BackdropPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;
	const { unitone } = attributes;

	const resetAll = ( filters ) => {
		const newUnitone = filters.reduce(
			( accumulator, filter ) =>
				filter( { unitone: accumulator } )?.unitone,
			unitone
		);

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const isBlurDisabled = useIsBlurDisabled( { name } );
	const isBrightnessDisabled = useIsBrightnessDisabled( { name } );
	const isContrastDisabled = useIsContrastDisabled( { name } );
	const isGrayscaleDisabled = useIsGrayscaleDisabled( { name } );
	const isHueRotateDisabled = useIsHueRotateDisabled( { name } );
	const isInvertDisabled = useIsInvertDisabled( { name } );
	const isSaturateDisabled = useIsSaturateDisabled( { name } );
	const isSepiaDisabled = useIsSepiaDisabled( { name } );

	if (
		isBlurDisabled &&
		isBrightnessDisabled &&
		isContrastDisabled &&
		isGrayscaleDisabled &&
		isHueRotateDisabled &&
		isInvertDisabled &&
		isSaturateDisabled &&
		isSepiaDisabled
	) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<ToolsPanel
				label={ __( 'Backdrop Filter', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
			>
				{ ! isBlurDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasBlurValue( { ...props } ) }
						label={ getBlurEditLabel( {
							...props,
						} ) }
						onDeselect={ () => resetBlur( { ...props } ) }
						resetAllFilter={ resetBlurFilter }
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
						resetAllFilter={ resetBrightnessFilter }
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
						resetAllFilter={ resetContrastFilter }
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
						resetAllFilter={ resetGrayscaleFilter }
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
						resetAllFilter={ resetHueRotateFilter }
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
						resetAllFilter={ resetInvertFilter }
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
						resetAllFilter={ resetSaturateFilter }
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
						resetAllFilter={ resetSepiaFilter }
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
			</ToolsPanel>
		</InspectorControls>
	);
}

export const BackdropPanel = memo( BackdropPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
