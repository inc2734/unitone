import { InspectorControls } from '@wordpress/block-editor';

import {
	Button,
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalVStack as VStack,
} from '@wordpress/components';

import { createHigherOrderComponent } from '@wordpress/compose';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { edit } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	useToolsPanelDropdownMenuProps,
} from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/navigation' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				style: {
					...wrapperProps?.style,
					'--unitone--help-text': !! attributes?.unitone
						?.replaceOverlayMenu
						? `"${ __(
								'The template part overlay-menu is used as an overlay menu.',
								'unitone'
						  ) }"`
						: undefined,
				},
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/navigation/useBlockProps',
	useBlockProps
);

const EditButton = () => {
	const { siteUrl, currentTheme } = useSelect( ( select ) => {
		const { getSite, getCurrentTheme } = select( coreStore );

		return {
			siteUrl: getSite()?.url,
			currentTheme: getCurrentTheme()?.stylesheet,
		};
	}, [] );

	const slug = 'overlay-menu';

	return (
		<Button
			variant="secondary"
			icon={ edit }
			href={ `${ siteUrl }/wp-admin/site-editor.php?p=%2Fwp_template_part%2F${
				currentTheme || ''
			}%2F%2F${ slug }&canvas=edit` }
			target="_blank"
		>
			{ __( 'Edit template', 'unitone' ) }
		</Button>
	);
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		if ( ! props.isSelected || 'core/navigation' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const { attributes, setAttributes, clientId } = props;
		const { unitone = {} } = attributes;

		const resetAll = () => {
			setAttributes( {
				unitone: cleanEmptyObject( {
					...unitone,
					replaceOverlayMenu: false,
				} ),
			} );
		};

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel
						label={ __( 'Overlay menu', 'unitone' ) }
						resetAll={ resetAll }
						panelId={ clientId }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () =>
								null != unitone?.replaceOverlayMenu
							}
							label={ __(
								'Use template parts for overlay menu',
								'unitone'
							) }
							onDeselect={ () => {
								unitone.replaceOverlayMenu = undefined;

								setAttributes( {
									unitone: cleanEmptyObject( unitone ),
								} );
							} }
							isShownByDefault
							panelId={ clientId }
							dropdownMenuProps={ dropdownMenuProps }
						>
							<VStack spacing="16px">
								<ToggleControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Use template parts for overlay menu',
										'unitone'
									) }
									checked={
										attributes?.unitone
											?.replaceOverlayMenu ?? false
									}
									onChange={ ( newSetting ) =>
										setAttributes( {
											unitone: cleanEmptyObject( {
												...unitone,
												replaceOverlayMenu: newSetting,
											} ),
										} )
									}
								/>

								{ !! unitone?.replaceOverlayMenu && (
									<div>
										<EditButton />
									</div>
								) }
							</VStack>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/navigation/with-inspector-controls',
	withInspectorControls,
	9
);
