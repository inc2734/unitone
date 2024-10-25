import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const saveProp = ( extraProps, blockType, attributes ) => {
	if ( 'core/table' !== blockType ) {
		return extraProps;
	}

	if ( ! hasBlockSupport( blockType, 'unitone.cellMinWidth' ) ) {
		return extraProps;
	}

	if (
		null == attributes?.unitone?.cellMinWidth ||
		'' === attributes?.unitone?.cellMinWidth
	) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--cell-min-width': attributes?.unitone?.cellMinWidth,
	};

	return extraProps;
};

const useBlockProps = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { attributes, name, wrapperProps } = props;

		props = {
			...props,
			wrapperProps: {
				...props.wrapperProps,
				...saveProp( wrapperProps, name, attributes ),
			},
		};

		return <BlockListBlock { ...props } />;
	};
} );

addFilter(
	'editor.BlockListBlock',
	'unitone/table/useBlockProps',
	useBlockProps
);

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( ! props.isSelected || 'core/table' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const defaultValue = wp.data
			.select( blocksStore )
			.getBlockType( props.name ).blockType?.attributes?.unitone
			?.cellMinWidth?.default;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel label={ __( 'unitone', 'unitone' ) }>
						<ToolsPanelItem
							hasValue={ () =>
								props.attributes?.unitone?.cellMinWidth !==
								defaultValue
							}
							label={ __( 'Cell Min Width', 'unitone' ) }
							onDeselect={ () => {
								const newUnitone = {
									...props.attributes?.unitone,
									cellMinWidth: defaultValue,
								};
								props.setAttributes( {
									unitone: !! Object.keys( newUnitone ).length
										? newUnitone
										: undefined,
								} );
							} }
							isShownByDefault
						>
							<TextControl
								label={ __( 'Cell Min Width', 'unitone' ) }
								value={
									props.attributes?.unitone?.cellMinWidth ||
									''
								}
								onChange={ ( newValue ) => {
									const newUnitone = {
										...unitone,
										cellMinWidth: newValue,
									};
									if ( null == newUnitone.cellMinWidth ) {
										if ( null == defaultValue ) {
											delete newUnitone.cellMinWidth;
										} else {
											newUnitone.cellMinWidth = '';
										}
									}

									props.setAttributes( {
										unitone: !! Object.keys( newUnitone )
											.length
											? newUnitone
											: undefined,
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
	'unitone/core/table/with-inspector-controls',
	withInspectorControls
);
