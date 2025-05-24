import { store as blockEditorStore } from '@wordpress/block-editor';
import { PluginBlockSettingsMenuItem } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';

import icon from '../../../../blocks/icon';
import usePasteUnitoneAndCoreStyles from './hooks/use-paste-unitone-and-core-styles';

function UnitoneAndCorePastePlugin() {
	const targetBlocks = useSelect( ( select ) => {
		const { getMultiSelectedBlocks, getSelectedBlock } =
			select( blockEditorStore );

		const multiSelectedBlocks = getMultiSelectedBlocks();
		if ( 0 < multiSelectedBlocks.length ) {
			return multiSelectedBlocks;
		}

		const selectedBlock = getSelectedBlock();
		if ( !! selectedBlock ) {
			return [ selectedBlock ];
		}

		return [];
	}, [] );

	const pasteStyles = usePasteUnitoneAndCoreStyles();

	if ( targetBlocks.length === 0 ) {
		return null;
	}

	return (
		<PluginBlockSettingsMenuItem
			icon={ icon }
			label={ __( 'Paste styles', 'unitone' ) + ' [unitone]' }
			onClick={ () => pasteStyles( targetBlocks ) }
			className="unitone-paste-styles-menu-item"
		/>
	);
}

registerPlugin( 'unitone-and-core-style-paste', {
	render: UnitoneAndCorePastePlugin,
	icon: null,
} );
