/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	isMixBlendModeSupportDisabled,
	hasMixBlendModeValue,
	resetMixBlendModeFilter,
	resetMixBlendMode,
	MixBlendModeEdit,
	withMixBlendModeBlockProps,
} from './mix-blend-mode';

import {
	isOpacitySupportDisabled,
	hasOpacityValue,
	resetOpacityFilter,
	resetOpacity,
	OpacityEdit,
	withOpacityBlockProps,
} from '../color/opacity';

export const withLayerBlockProps = compose(
	withMixBlendModeBlockProps,
	withOpacityBlockProps
);

export const resetLayer = ( props ) => {
	const filters = [
		[ isMixBlendModeSupportDisabled, resetMixBlendModeFilter ],
		[ isOpacitySupportDisabled, resetOpacityFilter ],
	];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

function LayerPanelPure( props ) {
	const { attributes, setAttributes, clientId } = props;
	const isMixBlendModeDisabled = isMixBlendModeSupportDisabled( {
		...props,
	} );
	const isOpacityDisabled = isOpacitySupportDisabled( { ...props } );

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				Object.assign(
					{ ...attributes?.unitone },
					resetMixBlendModeFilter(),
					resetOpacityFilter()
				)
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

	if ( isMixBlendModeDisabled && isOpacityDisabled ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Layer', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
				dropdownMenuProps={ dropdownMenuProps }
			>
				{ ! isMixBlendModeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasMixBlendModeValue( { ...props } ) }
						label={ __( 'Mix blend mode', 'unitone' ) }
						onDeselect={ () => resetMixBlendMode( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<MixBlendModeEdit
							{ ...props }
							label={
								<>
									{ __( 'Mix blend mode', 'unitone' ) }
									&nbsp;:&nbsp;
									<code className="unitone-label-code">
										mix-blend-mode
									</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isOpacityDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasOpacityValue( { ...props } ) }
						label={ __( 'Opacity', 'unitone' ) }
						onDeselect={ () => resetOpacity( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<div className="unitone-opacity-control">
							<OpacityEdit { ...props } />
						</div>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const LayerPanel = memo( LayerPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
