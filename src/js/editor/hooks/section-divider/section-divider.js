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

import { cleanEmptyObject, useToolsPanelDropdownMenuProps } from '../utils';

import {
	resetSectionDividerTopType,
	hasSectionDividerTopTypeValue,
	SectionDividerTopTypeEdit,
} from './top-type';

import {
	resetSectionDividerTopLevel,
	hasSectionDividerTopLevelValue,
	SectionDividerTopLevelEdit,
} from './top-level';

import {
	resetSectionDividerTopSize,
	hasSectionDividerTopSizeValue,
	SectionDividerTopSizeEdit,
} from './top-size';

import {
	resetSectionDividerTopX,
	hasSectionDividerTopXValue,
	SectionDividerTopXEdit,
} from './top-x';

import {
	resetSectionDividerTopTrim,
	hasSectionDividerTopTrimValue,
	SectionDividerTopTrimEdit,
} from './top-trim';

import {
	resetSectionDividerTopOverlap,
	hasSectionDividerTopOverlapValue,
	SectionDividerTopOverlapEdit,
} from './top-overlap';

import {
	resetSectionDividerBottomType,
	hasSectionDividerBottomTypeValue,
	SectionDividerBottomTypeEdit,
	isSectionDividerBottomExpand,
} from './bottom-type';

import {
	resetSectionDividerBottomLevel,
	hasSectionDividerBottomLevelValue,
	SectionDividerBottomLevelEdit,
} from './bottom-level';

import {
	resetSectionDividerBottomSize,
	hasSectionDividerBottomSizeValue,
	SectionDividerBottomSizeEdit,
} from './bottom-size';

import {
	resetSectionDividerBottomX,
	hasSectionDividerBottomXValue,
	SectionDividerBottomXEdit,
} from './bottom-x';

import {
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

	const isBottomExpand = isSectionDividerBottomExpand( { ...settings } );

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
					! isBottomExpand &&
					sectionDivider?.bottom?.size,
				'--unitone--section-divider-bottom-x':
					!! sectionDivider?.bottom?.type &&
					! isBottomExpand &&
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
	const { name, clientId } = props;

	const resetAll = ( filters ) => {
		filters.forEach( ( filter ) => filter() );
	};

	const dropdownMenuProps = useToolsPanelDropdownMenuProps();

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

	const isBottomExpand = isSectionDividerBottomExpand( { ...props } );

	return (
		<InspectorControls>
			<ToolsPanel
				label={ __( 'Section divider (Top)', 'unitone' ) }
				resetAll={ resetAll }
				panelId={ clientId }
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => hasSectionDividerTopType }
					label={ __( 'Type', 'unitone' ) }
					onDeselect={ () =>
						resetSectionDividerTopType( { ...props } )
					}
					resetAllFilter={ () =>
						resetSectionDividerTopType( { ...props } )
					}
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
							resetAllFilter={ () =>
								resetSectionDividerTopLevel( { ...props } )
							}
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
							resetAllFilter={ () =>
								resetSectionDividerTopSize( { ...props } )
							}
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
							resetAllFilter={ () =>
								resetSectionDividerTopX( { ...props } )
							}
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
							resetAllFilter={ () =>
								resetSectionDividerTopTrim( { ...props } )
							}
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
							resetAllFilter={ () =>
								resetSectionDividerTopOverlap( { ...props } )
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
				dropdownMenuProps={ dropdownMenuProps }
			>
				<ToolsPanelItem
					hasValue={ () => hasSectionDividerBottomType }
					label={ __( 'Type', 'unitone' ) }
					onDeselect={ () =>
						resetSectionDividerBottomType( { ...props } )
					}
					resetAllFilter={ () =>
						resetSectionDividerBottomType( { ...props } )
					}
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
							resetAllFilter={ () =>
								resetSectionDividerBottomLevel( { ...props } )
							}
							isShownByDefault
							panelId={ clientId }
						>
							<SectionDividerBottomLevelEdit
								{ ...props }
								label={ __( 'Level', 'unitone' ) }
							/>
						</ToolsPanelItem>

						{ ! isBottomExpand && (
							<>
								<ToolsPanelItem
									hasValue={ () =>
										hasSectionDividerBottomSizeValue( {
											...props,
										} )
									}
									label={ __( 'Size', 'unitone' ) }
									onDeselect={ () =>
										resetSectionDividerBottomSize( {
											...props,
										} )
									}
									resetAllFilter={ () =>
										resetSectionDividerBottomSize( {
											...props,
										} )
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
										hasSectionDividerBottomXValue( {
											...props,
										} )
									}
									label={ __(
										'Horizontal position',
										'unitone'
									) }
									onDeselect={ () =>
										resetSectionDividerBottomX( {
											...props,
										} )
									}
									resetAllFilter={ () =>
										resetSectionDividerBottomX( {
											...props,
										} )
									}
									isShownByDefault
									panelId={ clientId }
								>
									<SectionDividerBottomXEdit
										{ ...props }
										label={ __(
											'Horizontal position',
											'unitone'
										) }
									/>
								</ToolsPanelItem>
							</>
						) }

						<ToolsPanelItem
							hasValue={ () =>
								hasSectionDividerBottomTrimValue( {
									...props,
								} )
							}
							label={ __(
								'Amount of content trimming',
								'unitone'
							) }
							onDeselect={ () =>
								resetSectionDividerBottomTrim( {
									...props,
								} )
							}
							resetAllFilter={ () =>
								resetSectionDividerBottomTrim( {
									...props,
								} )
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
