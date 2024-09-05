import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/block-editor';
import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

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
} from './divider-object';

export { useDividerTypeBlockProps, useDividerBlockProps };

export function DividerPanelPure( {
	clientId,
	name,
	unitone,
	__unstableUnitoneSupports,
	setAttributes,
} ) {
	const props = {
		clientId,
		name,
		unitone,
		__unstableUnitoneSupports,
		setAttributes,
	};

	const resetAll = useCallback( ( filters ) => {
		const newUnitone = filters.reduce(
			( accumulator, filter ) =>
				filter( { unitone: accumulator } )?.unitone,
			unitone
		);

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	}, [] );

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
			>
				{ ! isDividerTypeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasDividerTypeValue( { ...props } ) }
						label={ getDividerTypeEditLabel( { ...props } ) }
						onDeselect={ () => resetDividerType( { ...props } ) }
						resetAllFilter={ resetDividerTypeFilter }
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
						resetAllFilter={ resetDividerFilter }
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
