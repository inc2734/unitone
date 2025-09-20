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
	withDividerTypeBlockProps,
	isDividerTypeSupportDisabled,
	resetDividerTypeFilter,
	resetDividerType,
	hasDividerTypeValue,
	getDividerTypeEditLabel,
	DividerTypeEdit,
} from './divider-type';

import {
	withDividerBlockProps,
	isDividerSupportDisabled,
	resetDividerFilter,
	resetDivider,
	hasDividerValue,
	getDividerEditLabel,
	DividerEdit,
} from './divider';

export const withDividerLineBlockProps = compose(
	withDividerTypeBlockProps,
	withDividerBlockProps
);

export const resetDividerLine = ( props ) => {
	const filters = [
		//[ isDividerTypeSupportDisabled, resetDividerTypeFilter ],
		[ isDividerSupportDisabled, resetDividerFilter ],
	];

	const unitone = filters.reduce(
		( accumulator, [ isDisabled, resetFilter ] ) => {
			return isDisabled( { ...props } )
				? { ...accumulator, ...resetFilter() }
				: accumulator;
		},
		{ ...props.attributes?.unitone }
	);

	return { ...props, attributes: { ...props.attributes, unitone } };
};

export function DividerLinePanelPure( props ) {
	const { attributes, setAttributes, clientId } = props;

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
	const isDividerTypeDisabled = isDividerTypeSupportDisabled( { ...props } );
	const isDividerDisabled = isDividerSupportDisabled( { ...props } );

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
