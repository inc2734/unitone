import clsx from 'clsx';
import fastDeepEqual from 'fast-deep-equal/es6';

import {
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

import {
	resetSectionDividerTopTypeFilter,
	resetSectionDividerTopType,
	hasSectionDividerTopTypeValue,
	SectionDividerTopTypeEdit,
} from './top-type';

import {
	resetSectionDividerTopLevelFilter,
	resetSectionDividerTopLevel,
	hasSectionDividerTopLevelValue,
	SectionDividerTopLevelEdit,
} from './top-level';

import {
	resetSectionDividerTopSizeFilter,
	resetSectionDividerTopSize,
	hasSectionDividerTopSizeValue,
	SectionDividerTopSizeEdit,
} from './top-size';

import {
	resetSectionDividerTopXFilter,
	resetSectionDividerTopX,
	hasSectionDividerTopXValue,
	SectionDividerTopXEdit,
} from './top-x';

import {
	resetSectionDividerTopTrimFilter,
	resetSectionDividerTopTrim,
	hasSectionDividerTopTrimValue,
	SectionDividerTopTrimEdit,
} from './top-trim';

import {
	resetSectionDividerTopOverlapFilter,
	resetSectionDividerTopOverlap,
	hasSectionDividerTopOverlapValue,
	SectionDividerTopOverlapEdit,
} from './top-overlap';

import {
	resetSectionDividerBottomTypeFilter,
	resetSectionDividerBottomType,
	hasSectionDividerBottomTypeValue,
	SectionDividerBottomTypeEdit,
} from './bottom-type';

import {
	resetSectionDividerBottomLevelFilter,
	resetSectionDividerBottomLevel,
	hasSectionDividerBottomLevelValue,
	SectionDividerBottomLevelEdit,
} from './bottom-level';

import {
	resetSectionDividerBottomSizeFilter,
	resetSectionDividerBottomSize,
	hasSectionDividerBottomSizeValue,
	SectionDividerBottomSizeEdit,
} from './bottom-size';

import {
	resetSectionDividerBottomXFilter,
	resetSectionDividerBottomX,
	hasSectionDividerBottomXValue,
	SectionDividerBottomXEdit,
} from './bottom-x';

import {
	resetSectionDividerBottomTrimFilter,
	resetSectionDividerBottomTrim,
	hasSectionDividerBottomTrimValue,
	SectionDividerBottomTrimEdit,
} from './bottom-trim';

export function useSectionDividerBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.sectionDivider;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.sectionDivider' ) ) {
		return settings;
	}

	const sectionDivider = cleanEmptyObject( {
		top: {
			...defaultValue?.top,
			...attributes?.unitone?.sectionDivider?.top,
		},
		bottom: {
			...defaultValue?.bottom,
			...attributes?.unitone?.sectionDivider?.bottom,
		},
	} );

	if ( null == sectionDivider ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-section-divider-top:${ sectionDivider?.top?.type }` ]:
						!! sectionDivider?.top?.type,
					[ `-section-divider-bottom:${ sectionDivider?.bottom?.type }` ]:
						!! sectionDivider?.bottom?.type,
					'-section-overlap:top': sectionDivider?.top?.overlap,
				}
			),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--section-divider-top-level':
					!! sectionDivider?.top?.type && sectionDivider?.top?.level,
				'--unitone--section-divider-top-size':
					!! sectionDivider?.top?.type && sectionDivider?.top?.size,
				'--unitone--section-divider-top-x':
					!! sectionDivider?.top?.type && sectionDivider?.top?.x,
				'--unitone--section-divider-top-trim':
					!! sectionDivider?.top?.type && sectionDivider?.top?.trim,
				'--unitone--section-divider-bottom-level':
					!! sectionDivider?.bottom?.type &&
					sectionDivider?.bottom?.level,
				'--unitone--section-divider-bottom-size':
					!! sectionDivider?.bottom?.type &&
					sectionDivider?.bottom?.size,
				'--unitone--section-divider-bottom-x':
					!! sectionDivider?.bottom?.type &&
					sectionDivider?.bottom?.x,
				'--unitone--section-divider-bottom-trim':
					!! sectionDivider?.bottom?.type &&
					sectionDivider?.bottom?.trim,
			},
		},
	};
}

function useIsSectionDividerDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.sectionDivider' );
}

export function SectionDividerPanelPure( props ) {
	const { name, attributes, setAttributes, clientId } = props;
	const { unitone } = attributes;

	const resetAll = ( filters ) => {
		const newUnitone = filters.reduce(
			( accumulator, filter ) =>
				filter( { unitone: accumulator } )?.unitone,
			unitone
		);

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const isSectionDividerDisabled = useIsSectionDividerDisabled( { name } );

	if ( isSectionDividerDisabled ) {
		return null;
	}

	const hasSectionDividerTopType = hasSectionDividerTopTypeValue( {
		...props,
	} );
	const hasSectionDividerBottomType = hasSectionDividerBottomTypeValue( {
		...props,
	} );

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Section divider (Top)', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
			>
				<ToolsPanelItem
					hasValue={ () => hasSectionDividerTopType }
					label={ __( 'Type', 'unitone' ) }
					onDeselect={ () =>
						resetSectionDividerTopType( { ...props } )
					}
					resetAllFilter={ resetSectionDividerTopTypeFilter }
					isShownByDefault
					panelId={ clientId }
				>
					<SectionDividerTopTypeEdit
						{ ...props }
						label={ __( 'Type', 'unitone' ) }
					/>
				</ToolsPanelItem>

				{ hasSectionDividerTopType && (
					<>
						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerTopLevelValue( { ...props } )
							}
							label={ __( 'Level', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerTopLevel( { ...props } )
							}
							resetAllFilter={ resetSectionDividerTopLevelFilter }
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerTopLevelEdit
								{ ...props }
								label={ __( 'Level', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerTopSizeValue( { ...props } )
							}
							label={ __( 'Size', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerTopSize( { ...props } )
							}
							resetAllFilter={ resetSectionDividerTopSizeFilter }
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerTopSizeEdit
								{ ...props }
								label={ __( 'Size', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerTopXValue( { ...props } )
							}
							label={ __( 'Horizontal position', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerTopX( { ...props } )
							}
							resetAllFilter={ resetSectionDividerTopXFilter }
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerTopXEdit
								{ ...props }
								label={ __( 'Horizontal position', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerTopTrimValue( { ...props } )
							}
							label={ __(
								'Amount of content trimming',
								'unitone'
							) }
							onDeselect={ () =>
								resetSectionDividerTopTrim( { ...props } )
							}
							resetAllFilter={ resetSectionDividerTopTrimFilter }
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerTopTrimEdit
								{ ...props }
								label={ __(
									'Amount of content trimming',
									'unitone'
								) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerTopOverlapValue( {
									...props,
								} )
							}
							label={ __(
								'Overlap the previous block',
								'unitone'
							) }
							onDeselect={ () =>
								resetSectionDividerTopOverlap( { ...props } )
							}
							resetAllFilter={
								resetSectionDividerTopOverlapFilter
							}
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerTopOverlapEdit
								{ ...props }
								label={ __(
									'Overlap the previous block',
									'unitone'
								) }
							/>
						</ToolsPanelItem>
					</>
				) }
			</ToolsPanel>

			<ToolsPanel
				label={ __( 'Section divider (Bottom)', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
			>
				<ToolsPanelItem
					hasValue={ () => hasSectionDividerBottomType }
					label={ __( 'Type', 'unitone' ) }
					onDeselect={ () =>
						resetSectionDividerBottomType( { ...props } )
					}
					resetAllFilter={ resetSectionDividerBottomTypeFilter }
					isShownByDefault
					panelId={ clientId }
				>
					<SectionDividerBottomTypeEdit
						{ ...props }
						label={ __( 'Type', 'unitone' ) }
					/>
				</ToolsPanelItem>

				{ hasSectionDividerBottomType && (
					<>
						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerBottomLevelValue( {
									...props,
								} )
							}
							label={ __( 'Level', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerBottomLevel( { ...props } )
							}
							resetAllFilter={
								resetSectionDividerBottomLevelFilter
							}
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerBottomLevelEdit
								{ ...props }
								label={ __( 'Level', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerBottomSizeValue( { ...props } )
							}
							label={ __( 'Size', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerBottomSize( { ...props } )
							}
							resetAllFilter={
								resetSectionDividerBottomSizeFilter
							}
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerBottomSizeEdit
								{ ...props }
								label={ __( 'Size', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerBottomXValue( { ...props } )
							}
							label={ __( 'Horizontal position', 'unitone' ) }
							onDeselect={ () =>
								resetSectionDividerBottomX( { ...props } )
							}
							resetAllFilter={ resetSectionDividerBottomXFilter }
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerBottomXEdit
								{ ...props }
								label={ __( 'Horizontal position', 'unitone' ) }
							/>
						</ToolsPanelItem>

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerBottomTrimValue( { ...props } )
							}
							label={ __(
								'Amount of content trimming',
								'unitone'
							) }
							onDeselect={ () =>
								resetSectionDividerBottomTrim( { ...props } )
							}
							resetAllFilter={
								resetSectionDividerBottomTrimFilter
							}
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerBottomTrimEdit
								{ ...props }
								label={ __(
									'Amount of content trimming',
									'unitone'
								) }
							/>
						</ToolsPanelItem>
					</>
				) }
			</ToolsPanel>
		</InspectorControls>
	);
}

export const SectionDividerPanel = memo(
	SectionDividerPanelPure,
	( oldProps, newProps ) => fastDeepEqual( oldProps, newProps )
);
