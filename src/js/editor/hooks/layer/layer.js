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

import { cleanEmptyObject } from '../utils';

import {
	useIsMixBlendModeDisabled,
	hasMixBlendModeValue,
	resetMixBlendModeFilter,
	resetMixBlendMode,
	MixBlendModeEdit,
	useMixBlendModeBlockProps,
} from './mix-blend-mode';

export { useMixBlendModeBlockProps };

function LayerPanelPure( props ) {
	const { attributes, setAttributes, clientId } = props;
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

	const isMixBlendModeDisabled = useIsMixBlendModeDisabled( { ...props } );

	if ( isMixBlendModeDisabled ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Layer', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
			>
				{ ! isMixBlendModeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasMixBlendModeValue( { ...props } ) }
						label={ __( 'Mix blend mode', 'unitone' ) }
						onDeselect={ () => resetMixBlendMode( { ...props } ) }
						resetAllFilter={ resetMixBlendModeFilter }
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
