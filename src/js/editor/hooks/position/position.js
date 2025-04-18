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
	hasPositionValue,
	resetPosition,
	useIsPositionDisabled,
	PositionEdit,
	hasTopValue,
	resetTop,
	TopEdit,
	hasRightValue,
	resetRight,
	RightEdit,
	hasBottomValue,
	resetBottom,
	BottomEdit,
	hasLeftValue,
	resetLeft,
	LeftEdit,
	hasZIndexValue,
	resetZIndex,
	ZIndexEdit,
	usePositionBlockProps,
} from './position-object';

export { usePositionBlockProps };

function PositionPanelPure( props ) {
	const { name, clientId } = props;

	const resetAll = ( filters ) => {
		filters.forEach( ( filter ) => filter() );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();
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
					dropdownMenuProps={ dropdownMenuProps }
				>
					<ToolsPanelItem
						hasValue={ () => hasPositionValue( { ...props } ) }
						label={ __( 'Position', 'unitone' ) }
						onDeselect={ () => resetPosition( { ...props } ) }
						resetAllFilter={ () => resetPosition( { ...props } ) }
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
						resetAllFilter={ () => resetTop( { ...props } ) }
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
						resetAllFilter={ () => resetRight( { ...props } ) }
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
						resetAllFilter={ () => resetBottom( { ...props } ) }
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
						resetAllFilter={ () => resetLeft( { ...props } ) }
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
						resetAllFilter={ () => resetZIndex( { ...props } ) }
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
