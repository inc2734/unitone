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

import {
	useIsScrollAnimationDisabled,
	hasScrollAnimationValue,
	resetScrollAnimation,
	ScrollAnimationEdit,
	editScrollAnimationProp,
} from './scroll-animation';

export { editParallaxProp, editScrollAnimationProp };

export function AnimationPanel( props ) {
	const isParallaxDisabled = useIsParallaxDisabled( props );
	const isScrollAnimationDisabled = useIsScrollAnimationDisabled( props );

	if ( isParallaxDisabled && isScrollAnimationDisabled ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<ToolsPanel label={ __( 'Animation', 'unitone' ) }>
				{ ( ! isParallaxDisabled || ! isScrollAnimationDisabled ) && (
					<div className="unitone-animation-tools-panel">
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

						{ ! isScrollAnimationDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasScrollAnimationValue( props )
								}
								label={ __( 'Scroll', 'unitone' ) }
								onDeselect={ () =>
									resetScrollAnimation( props )
								}
								resetAllFilter={ () =>
									resetScrollAnimation( props )
								}
								isShownByDefault
							>
								<ScrollAnimationEdit { ...props } />
							</ToolsPanelItem>
						) }
					</div>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}
