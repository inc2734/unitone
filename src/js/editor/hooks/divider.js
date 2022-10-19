import { InspectorControls } from '@wordpress/block-editor';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import {
	saveDividerTypeProp,
	editDividerTypeProp,
	useIsDividerTypeDisabled,
	resetDividerType,
	resetDividerTypeFilter,
	hasDividerTypeValue,
	DividerTypeEdit,
} from './divider-type';

import {
	saveDividerProp,
	editDividerProp,
	useIsDividerDisabled,
	resetDivider,
	resetDividerFilter,
	hasDividerValue,
	DividerEdit,
} from './divider-object';

export {
	saveDividerTypeProp,
	editDividerTypeProp,
	saveDividerProp,
	editDividerProp,
};

export function DividerPanel( props ) {
	const isDividerTypeDisabled = useIsDividerTypeDisabled( props );
	const isDividerDisabled = useIsDividerDisabled( props );

	if ( isDividerTypeDisabled || isDividerDisabled ) {
		return null;
	}

	const resetAll = () => {
		let newAttributes = { ...props.attributes };
		newAttributes = resetDividerTypeFilter( newAttributes );
		newAttributes = resetDividerFilter( newAttributes );
		props.setAttributes( newAttributes );
	};

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Divider', 'unitone' ) }
				resetAll={ resetAll }
			>
				{ ! isDividerTypeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerTypeValue( props ) }
						label={ __( 'Type', 'unitone' ) }
						onDeselect={ () => resetDividerType( props ) }
						isShownByDefault={ true }
					>
						<DividerTypeEdit { ...props } />
					</ToolsPanelItem>
				) }

				{ ! isDividerDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerValue( props ) }
						label={ __( 'Divider', 'unitone' ) }
						onDeselect={ () => resetDivider( props ) }
						isShownByDefault={ true }
					>
						<DividerEdit { ...props } />
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}
