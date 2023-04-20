/*
 *@see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/dimensions.js
 */

import { InspectorControls } from '@wordpress/block-editor';
import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';
import { sprintf, __ } from '@wordpress/i18n';

import {
	useIsAlignSelfDisabled,
	hasAlignSelfValue,
	resetAlignSelf,
	AlignSelfEdit,
	editAlignSelfProp,
} from './align-self';

import {
	useIsJustifySelfDisabled,
	hasJustifySelfValue,
	resetJustifySelf,
	JustifySelfEdit,
	editJustifySelfProp,
} from './justify-self';

import {
	useIsGridColumnDisabled,
	hasGridColumnValue,
	resetGridColumn,
	GridColumnEdit,
	editGridColumnProp,
} from './grid-column';

import {
	useIsGridRowDisabled,
	hasGridRowValue,
	resetGridRow,
	GridRowEdit,
	editGridRowProp,
} from './grid-row';

import {
	useIsMixBlendModeDisabled,
	hasMixBlendModeValue,
	resetMixBlendMode,
	MixBlendModeEdit,
	editMixBlendModeProp,
} from './mix-blend-mode';

export {
	editAlignSelfProp,
	editJustifySelfProp,
	editGridColumnProp,
	editGridRowProp,
	editMixBlendModeProp,
};

export function LayerPanel( props ) {
	const isAlignSelfDisabled = useIsAlignSelfDisabled( props );
	const isJustifySelfDisabled = useIsJustifySelfDisabled( props );
	const isGridColumnDisabled = useIsGridColumnDisabled( props );
	const isGridRowDisabled = useIsGridRowDisabled( props );
	const isMixBlendModeDisabled = useIsMixBlendModeDisabled( props );

	if (
		isAlignSelfDisabled &&
		isJustifySelfDisabled &&
		isGridColumnDisabled &&
		isGridRowDisabled &&
		isMixBlendModeDisabled
	) {
		return null;
	}

	return (
		<InspectorControls>
			<ToolsPanel label={ __( 'Layer', 'unitone' ) }>
				{ ! isAlignSelfDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasAlignSelfValue( props ) }
						label={ __( 'Align self', 'unitone' ) }
						onDeselect={ () => resetAlignSelf( props ) }
						resetAllFilter={ () => resetAlignSelf( props ) }
						isShownByDefault
					>
						<AlignSelfEdit
							{ ...props }
							label={
								<>
									{ __( 'Align self', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>align-self</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isJustifySelfDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasJustifySelfValue( props ) }
						label={ __( 'Justify self', 'unitone' ) }
						onDeselect={ () => resetJustifySelf( props ) }
						resetAllFilter={ () => resetJustifySelf( props ) }
						isShownByDefault={ true }
					>
						<JustifySelfEdit
							{ ...props }
							label={
								<>
									{ __( 'Justify self', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>justify-self</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGridColumnDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGridColumnValue( props ) }
						label={ __(
							"A grid item's size and location within a grid column",
							'unitone'
						) }
						onDeselect={ () => resetGridColumn( props ) }
						resetAllFilter={ () => resetGridColumn( props ) }
						isShownByDefault={ true }
					>
						<GridColumnEdit
							{ ...props }
							label={
								<>
									{ __(
										"A grid item's size and location within a grid column",
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>grid-column</code>
								</>
							}
							help={
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isGridRowDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasGridRowValue( props ) }
						label={ __(
							"A grid item's size and location within the grid row",
							'unitone'
						) }
						onDeselect={ () => resetGridRow( props ) }
						resetAllFilter={ () => resetGridRow( props ) }
						isShownByDefault={ true }
					>
						<GridRowEdit
							{ ...props }
							label={
								<>
									{ __(
										"A grid item's size and location within the grid row",
										'unitone'
									) }
									&nbsp;:&nbsp;
									<code>grid-row</code>
								</>
							}
							help={
								<span
									dangerouslySetInnerHTML={ {
										__html: sprintf(
											// translators: %1$s: <code>, %2$s: </code>
											__(
												'For example, enter %1$s1 / -2%2$s (fill from the first grid line to the second-to-last grid line).',
												'unitone'
											),
											'<code>',
											'</code>'
										),
									} }
								/>
							}
						/>
					</ToolsPanelItem>
				) }

				{ ! isMixBlendModeDisabled && (
					<ToolsPanelItem
						hasValue={ () => hasMixBlendModeValue( props ) }
						label={ __( 'Mix blend mode', 'unitone' ) }
						onDeselect={ () => resetMixBlendMode( props ) }
						resetAllFilter={ () => resetMixBlendMode( props ) }
						isShownByDefault
					>
						<MixBlendModeEdit
							{ ...props }
							label={
								<>
									{ __( 'Mix blend mode', 'unitone' ) }
									&nbsp;:&nbsp;
									<code>mix-blend-mode</code>
								</>
							}
						/>
					</ToolsPanelItem>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}
