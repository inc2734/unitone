import { InspectorControls } from '@wordpress/block-editor';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import {
	editDividerTypeProp,
	useIsDividerTypeDisabled,
	resetDividerType,
	hasDividerTypeValue,
	DividerTypeEdit,
} from './divider-type';

import {
	saveDividerProp,
	editDividerProp,
	useIsDividerDisabled,
	resetDivider,
	hasDividerValue,
	DividerEdit,
} from './divider-object';

export { editDividerTypeProp, saveDividerProp, editDividerProp };

export function DividerPanel( props ) {
	const isDividerTypeDisabled = useIsDividerTypeDisabled( props );
	const isDividerDisabled = useIsDividerDisabled( props );

	if ( isDividerTypeDisabled || isDividerDisabled ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel label={ __( 'Divider', 'unitone' ) }>
				{ ! isDividerTypeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerTypeValue( props ) }
						label={ __( 'Type', 'unitone' ) }
						onDeselect={ () => resetDividerType( props ) }
						isShownByDefault
					>
						<DividerTypeEdit
							{ ...props }
							label={ __( 'Type', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isDividerDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerValue( props ) }
						label={ __( 'Divider', 'unitone' ) }
						onDeselect={ () => resetDivider( props ) }
						isShownByDefault
					>
						<DividerEdit
							{ ...props }
							label={ __( 'Divider', 'unitone' ) }
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}
