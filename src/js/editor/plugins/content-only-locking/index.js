import { store as blockEditorStore } from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginBlockSettingsMenuItem } from '@wordpress/editor';
import { registerPlugin } from '@wordpress/plugins';
import { lockOutline, unlock } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

function UnitoneContentOnlyLocking() {
	const { updateBlockAttributes } = useDispatch( blockEditorStore );

	const { selectedBlock } = useSelect( ( select ) => {
		const clientId = select( blockEditorStore ).getSelectedBlockClientId();
		if ( ! clientId ) {
			return {};
		}

		const { getBlock } = select( blockEditorStore );

		return {
			selectedBlock: getBlock( clientId ),
		};
	}, [] );

	const templateLock = selectedBlock?.attributes?.templateLock;
	const isLocking = 'contentOnly' === templateLock;

	if ( ! selectedBlock || ( !! templateLock && ! isLocking ) ) {
		return null;
	}

	const label = ! isLocking
		? __( 'Modify content only', 'unitone' )
		: __( 'Unlock content only locking', 'unitone' );
	const icon = ! isLocking ? lockOutline : unlock;
	const onClick = () =>
		updateBlockAttributes( selectedBlock.clientId, {
			templateLock: ! isLocking ? 'contentOnly' : undefined,
		} );

	return (
		<PluginBlockSettingsMenuItem
			icon={ icon }
			label={ label + ' [unitone]' }
			onClick={ onClick }
			className="unitone-content-only-locking"
		/>
	);
}

registerPlugin( 'unitone-content-only-locking', {
	render: UnitoneContentOnlyLocking,
	icon: null,
} );
