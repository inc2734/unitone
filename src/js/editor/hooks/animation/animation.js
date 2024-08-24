/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import {
	useIsParallaxDisabled,
	hasParallaxValue,
	resetParallax,
	ParallaxEdit,
	editParallaxProp,
} from './parallax';

export { editParallaxProp };

export function AnimationPanel( props ) {
	const isParallaxDisabled = useIsParallaxDisabled( props );

	if ( isParallaxDisabled ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<ToolsPanel label={ __( 'Animation', 'unitone' ) }>
				{ ! isParallaxDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasParallaxValue( props ) }
						label={ __( 'Parallax', 'unitone' ) }
						onDeselect={ () => resetParallax( props ) }
						resetAllFilter={ () => resetParallax( props ) }
						isShownByDefault
					>
						<ParallaxEdit { ...props } />
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}
