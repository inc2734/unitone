/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	useIsMixBlendModeDisabled,
	hasMixBlendModeValue,
	resetMixBlendMode,
	MixBlendModeEdit,
	editMixBlendModeProp,
} from './mix-blend-mode';

export { editMixBlendModeProp };

function LayerPanelPure( props ) {
	const isMixBlendModeDisabled = useIsMixBlendModeDisabled( props );

	if ( isMixBlendModeDisabled ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel label={ __( 'Layer', 'unitone' ) }>
				{ ! isMixBlendModeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasMixBlendModeValue( props ) }
						label={ __( 'Mix blend mode', 'unitone' ) }
						onDeselect={ () => resetMixBlendMode( props ) }
						resetAllFilter={ () => resetMixBlendMode( props ) }
						isShownByDefault
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

export const LayerPanel = memo( LayerPanelPure );
