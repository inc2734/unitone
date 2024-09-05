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
	hasPositionValue,
	resetPositionFilter,
	resetPosition,
	useIsPositionDisabled,
	PositionEdit,
	hasTopValue,
	resetTopFilter,
	resetTop,
	TopEdit,
	hasRightValue,
	resetRightFilter,
	resetRight,
	RightEdit,
	hasBottomValue,
	resetBottomFilter,
	resetBottom,
	BottomEdit,
	hasLeftValue,
	resetLeftFilter,
	resetLeft,
	LeftEdit,
	hasZIndexValue,
	resetZIndexFilter,
	resetZIndex,
	ZIndexEdit,
	usePositionBlockProps,
} from './position-object';

export { usePositionBlockProps };

function PositionPanelPure( { clientId, name, unitone, setAttributes } ) {
	const props = {
		clientId,
		name,
		unitone,
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

	const isPositionDisabled = useIsPositionDisabled( { name } );

	if ( isPositionDisabled ) {
		return null;
	}

	return (
		<InspectorControls group="styles">
			{ ! isPositionDisabled && (
				<ToolsPanel
					label={ __( 'Position', 'unitone' ) }
					resetAll={ resetAll }
					panelId={ clientId }
				>
					<ToolsPanelItem
						hasValue={ () => hasPositionValue( { ...props } ) }
						label={ __( 'Position', 'unitone' ) }
						onDeselect={ () => resetPosition( { ...props } ) }
						resetAllFilter={ resetPositionFilter }
						isShownByDefault
						panelId={ clientId }
					>
						<PositionEdit
							{ ...props }
							label={
								<>
									{ __( 'Position', 'unitone' ) }&nbsp;:&nbsp;
									<code>position</code>
								</>
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasTopValue( { ...props } ) }
						label={ __( 'Top', 'unitone' ) }
						onDeselect={ () => resetTop( { ...props } ) }
						resetAllFilter={ resetTopFilter }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<TopEdit
							{ ...props }
							label={
								<>
									{ __( 'Top', 'unitone' ) }&nbsp;:&nbsp;
									<code>top</code>
								</>
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasRightValue( { ...props } ) }
						label={ __( 'Right', 'unitone' ) }
						onDeselect={ () => resetRight( { ...props } ) }
						resetAllFilter={ resetRightFilter }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<RightEdit
							{ ...props }
							label={
								<>
									{ __( 'Right', 'unitone' ) }&nbsp;:&nbsp;
									<code>right</code>
								</>
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasBottomValue( { ...props } ) }
						label={ __( 'Bottom', 'unitone' ) }
						onDeselect={ () => resetBottom( { ...props } ) }
						resetAllFilter={ resetBottomFilter }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<BottomEdit
							{ ...props }
							label={
								<>
									{ __( 'Bottom', 'unitone' ) }&nbsp;:&nbsp;
									<code>bottom</code>
								</>
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasLeftValue( { ...props } ) }
						label={ __( 'Left', 'unitone' ) }
						onDeselect={ () => resetLeft( { ...props } ) }
						resetAllFilter={ resetLeftFilter }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<LeftEdit
							{ ...props }
							label={
								<>
									{ __( 'Left', 'unitone' ) }&nbsp;:&nbsp;
									<code>left</code>
								</>
							}
						/>
					</ToolsPanelItem>

					<ToolsPanelItem
						hasValue={ () => hasZIndexValue( { ...props } ) }
						label={ __( 'The stack level', 'unitone' ) }
						onDeselect={ () => resetZIndex( { ...props } ) }
						resetAllFilter={ resetZIndexFilter }
						isShownByDefault={ false }
						panelId={ clientId }
					>
						<ZIndexEdit
							{ ...props }
							label={
								<>
									{ __( 'The stack level', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>z-index</code>
								</>
							}
						/>
					</ToolsPanelItem>
				</ToolsPanel>
			) }
		</InspectorControls>
	);
}

export const PositionPanel = memo( PositionPanelPure, ( oldProps, newProps ) =>
	fastDeepEqual( oldProps, newProps )
);
