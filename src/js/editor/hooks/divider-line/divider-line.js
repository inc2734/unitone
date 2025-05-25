import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { compose } from '@wordpress/compose';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	useDividerTypeBlockProps,
	useIsDividerTypeDisabled,
	resetDividerTypeFilter,
	resetDividerType,
	hasDividerTypeValue,
	getDividerTypeEditLabel,
	DividerTypeEdit,
} from './divider-type';

import {
	useDividerBlockProps,
	useIsDividerDisabled,
	resetDividerFilter,
	resetDivider,
	hasDividerValue,
	getDividerEditLabel,
	DividerEdit,
} from './divider';

export const useDividerLineBlockProps = compose(
	useDividerTypeBlockProps,
	useDividerBlockProps
);

export function DividerLinePanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;

	const resetAll = () => {
		setAttributes( {
			unitone: cleanEmptyObject(
				Object.assign(
					{ ...attributes?.unitone },
					resetDividerTypeFilter(),
					resetDividerFilter()
				)
			),
		} );
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

export const DividerLinePanel = memo(
	DividerLinePanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
