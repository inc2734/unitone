import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { __dangerousOptInToUnstableAPIsOnlyForCoreModules } from '@wordpress/private-apis';

const { unlock } = __dangerousOptInToUnstableAPIsOnlyForCoreModules(
	'I acknowledge private features are not for use in themes or plugins and doing so will break in the next version of WordPress.',
	'@wordpress/block-editor'
);

const DEFAULT_STATE_VALUE = 'default';

export const useIsEditingBlockStyleState = ( clientId, isEnabled = true ) =>
	useSelect(
		( select ) => {
			if ( ! isEnabled ) {
				return false;
			}

			const blockEditorSelectors = unlock( select( blockEditorStore ) );
			// WordPress 7.1 has no public selectors for the selected block style
			// state. Keep these calls optional for older WordPress versions.
			// See https://github.com/inc2734/unitone/issues/829.
			const selectedState =
				blockEditorSelectors.getSelectedBlockStyleState?.( clientId );

			if ( ! selectedState ) {
				return false;
			}

			const hasPseudoState =
				!! selectedState.pseudo &&
				selectedState.pseudo !== DEFAULT_STATE_VALUE;
			const hasViewportState =
				!! selectedState.viewport &&
				selectedState.viewport !== DEFAULT_STATE_VALUE;
			const isResponsiveEditing =
				blockEditorSelectors.isResponsiveEditing?.() ?? false;

			return (
				hasPseudoState || ( hasViewportState && isResponsiveEditing )
			);
		},
		[ clientId, isEnabled ]
	);
