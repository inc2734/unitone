import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useToolsPanelDropdownMenuProps } from '../utils';

import {
	useDividerTypeBlockProps,
	useIsDividerTypeDisabled,
	resetDividerType,
	hasDividerTypeValue,
	getDividerTypeEditLabel,
	DividerTypeEdit,
} from './divider-type';

import {
	useDividerBlockProps,
	useIsDividerDisabled,
	resetDivider,
	hasDividerValue,
	getDividerEditLabel,
	DividerEdit,
} from './divider-object';

export { useDividerTypeBlockProps, useDividerBlockProps };

export function DividerPanelPure( props ) {
	const { name, clientId } = props;

	const resetAll = ( filters ) => {
		filters.forEach( ( filter ) => filter() );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
	const isDividerTypeDisabled = useIsDividerTypeDisabled( { name } );
	const isDividerDisabled = useIsDividerDisabled( { name } );

	if ( isDividerTypeDisabled || isDividerDisabled ) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Divider', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
				dropdownMenuProps={ dropdownMenuProps }
			>
				{ ! isDividerTypeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerTypeValue( { ...props } ) }
						label={ getDividerTypeEditLabel( { ...props } ) }
						onDeselect={ () => resetDividerType( { ...props } ) }
						resetAllFilter={ () =>
							resetDividerType( { ...props } )
						}
						isShownByDefault
						panelId={ clientId }
					>
						<DividerTypeEdit
							{ ...props }
							label={ getDividerTypeEditLabel( { ...props } ) }
						/>
					</ToolsPanelItem>
				) }

				{ ! isDividerDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerValue( { ...props } ) }
						label={ getDividerEditLabel( { ...props } ) }
						onDeselect={ () => resetDivider( { ...props } ) }
						resetAllFilter={ () => resetDivider( { ...props } ) }
						isShownByDefault
						panelId={ clientId }
					>
						<DividerEdit
							{ ...props }
							label={ getDividerEditLabel( { ...props } ) }
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const DividerPanel = memo( DividerPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
