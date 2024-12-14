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
	useIsParallaxDisabled,
	hasParallaxValue,
	resetParallaxFilter,
	resetParallax,
	ParallaxEdit,
	useParallaxBlockProps,
} from './parallax';

import {
	useIsScrollAnimationDisabled,
	hasScrollAnimationValue,
	resetScrollAnimationFilter,
	resetScrollAnimation,
	ScrollAnimationEdit,
	useScrollAnimationBlockProps,
} from './scroll-animation';

export { useParallaxBlockProps, useScrollAnimationBlockProps };

function AnimationPanelPure( props ) {
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

	const isParallaxDisabled = useIsParallaxDisabled( { name } );
	const isScrollAnimationDisabled = useIsScrollAnimationDisabled( { name } );

	if ( isParallaxDisabled && isScrollAnimationDisabled ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			<ToolsPanel
				label={ __( 'Animation', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
			>
				{ ( ! isParallaxDisabled || ! isScrollAnimationDisabled ) && (
					<div className="unitone-animation-tools-panel">
						{ ! isParallaxDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasParallaxValue( { ...props } )
								}
								label={ __( 'Parallax', 'unitone' ) }
								onDeselect={ () =>
									resetParallax( { ...props } )
								}
								resetAllFilter={ resetParallaxFilter }
								isShownByDefault
								panelId={ clientId }
							>
								<ParallaxEdit { ...props } />
							</ToolsPanelItem>
						) }

						{ ! isScrollAnimationDisabled && (
							<ToolsPanelItem
								hasValue={ () =>
									hasScrollAnimationValue( { ...props } )
								}
								label={ __( 'Scroll', 'unitone' ) }
								onDeselect={ () =>
									resetScrollAnimation( { ...props } )
								}
								resetAllFilter={ resetScrollAnimationFilter }
								isShownByDefault
								panelId={ clientId }
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

export const AnimationPanel = memo(
	AnimationPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
