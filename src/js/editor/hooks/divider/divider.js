import { InspectorControls } from '@wordpress/block-editor';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	editDividerTypeProp,
	useIsDividerTypeDisabled,
	resetDividerType,
	hasDividerTypeValue,
	getDividerTypeEditLabel,
	DividerTypeEdit,
} from './divider-type';

import {
	saveDividerProp,
	editDividerProp,
	useIsDividerDisabled,
	resetDivider,
	hasDividerValue,
	getDividerEditLabel,
	DividerEdit,
} from './divider-object';

export { editDividerTypeProp, saveDividerProp, editDividerProp };

function DividerPanelPure( props ) {
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
						label={ getDividerTypeEditLabel( props ) }
						onDeselect={ () => resetDividerType( props ) }
						isShownByDefault
					>
						<DividerTypeEdit
							{ ...props }
							label={ getDividerTypeEditLabel( props ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isDividerDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerValue( props ) }
						label={ getDividerEditLabel( props ) }
						onDeselect={ () => resetDivider( props ) }
						isShownByDefault
					>
						<DividerEdit
							{ ...props }
							label={ getDividerEditLabel( props ) }
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const DividerPanel = memo( DividerPanelPure );
