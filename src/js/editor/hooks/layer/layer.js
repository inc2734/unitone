/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
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

export const withLayerBlockProps = withMixBlendModeBlockProps;

export const resetLayer = ( props ) => {
	const filters = [
		[ isMixBlendModeSupportDisabled, resetMixBlendModeFilter ],
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

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				Object.assign(
					{ ...attributes?.unitone },
					resetMixBlendModeFilter()
				)
			),
		} );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const isMixBlendModeDisabled = isMixBlendModeSupportDisabled( {
		...props,
	} );

	if ( isMixBlendModeDisabled ) {
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
									<code>mix-blend-mode</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const LayerPanel = memo( LayerPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
