import clsx from 'clsx';

import { InspectorControls } from '@wordpress/block-editor';
import { store as blocksStore } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	ToggleControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import {
	useToolsPanelDropdownMenuProps,
	cleanEmptyObject,
} from '../hooks/utils';

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		if ( 'core/query' !== name ) {
			return <BlockListBlock { ...props } />;
		}

		if ( ! attributes?.unitone?.blockLink ) {
			return <BlockListBlock { ...props } />;
		}

		props = {
			...props,
			wrapperProps: {
				...wrapperProps,
				'data-unitone-layout': clsx(
					wrapperProps?.[ 'data-unitone-layout' ],
					'-blockLink'
				),
			},
		};

		return <BlockListBlock { ...props } />;
	};
}, 'useBlockProps' );

addFilter(
	'editor.BlockListBlock',
	'unitone/query/useBlockProps',
	useBlockProps
);

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const dropdownMenuProps = useToolsPanelDropdownMenuProps();

		if ( ! props.isSelected || 'core/query' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const defaultValue = wp.data
			.select( blocksStore )
			.getBlockType( props.name ).blockType?.attributes?.unitone
			?.blockLink?.default;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel
						label={ __( 'unitone', 'unitone' ) }
						dropdownMenuProps={ dropdownMenuProps }
					>
						<ToolsPanelItem
							hasValue={ () =>
								props.attributes?.unitone?.blockLink !==
								defaultValue
							}
							label={ __( 'Use block links', 'unitone' ) }
							onDeselect={ () => {
								const newUnitone = {
									...props.attributes?.unitone,
									blockLink: defaultValue,
								};
								props.setAttributes( {
									unitone: cleanEmptyObject( newUnitone ),
								} );
							} }
							isShownByDefault
						>
							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Use block links', 'unitone' ) }
								checked={
									!! (
										props.attributes?.unitone?.blockLink ??
										defaultValue
									)
								}
								onChange={ ( newValue ) => {
									const newUnitone = {
										...unitone,
										blockLink: newValue || undefined,
									};

									props.setAttributes( {
										unitone: cleanEmptyObject( newUnitone ),
									} );
								} }
							/>
						</ToolsPanelItem>
					</ToolsPanel>
				</InspectorControls>
			</>
		);
	};
}, 'withInspectorControls' );

addFilter(
	'editor.BlockEdit',
	'unitone/core/query/with-inspector-controls',
	withInspectorControls
);
