import { InspectorControls } from '@wordpress/block-editor';
import { store as blocksStore } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import {
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

const addAttributes = ( settings, name ) => {
	if ( 'core/table' !== name ) {
		return settings;
	}

	return {
		...settings,
		...{
			attributes: {
				...settings.attributes,
				...{
					cellMinWidth: {
						type: 'string',
						default: '',
					},
				},
			},
		},
	};
};

addFilter(
	'blocks.registerBlockType',
	'unitone/table/addAttributes',
	addAttributes
);

const saveProp = ( extraProps, blockType, attributes ) => {
	if ( 'core/table' !== blockType.name ) {
		return extraProps;
	}

	if ( null == attributes?.cellMinWidth || '' === attributes?.cellMinWidth ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--cell-min-width': attributes?.cellMinWidth,
	};

	return extraProps;
};

const editProp = ( settings ) => {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveProp( props, settings, attributes );
	};

	return settings;
};

const addEditProps = ( settings ) => {
	settings = editProp( settings );
	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'unitone/table/addEditProps',
	addEditProps
);

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( 'core/table' !== props.name ) {
			return <BlockEdit { ...props } />;
		}

		const defaultValue = wp.data
			.select( blocksStore )
			.getBlockType( props.name )?.attributes?.cellMinWidth?.default;

		return (
			<>
				<BlockEdit { ...props } />

				<InspectorControls>
					<ToolsPanel label={ __( 'unitone', 'unitone' ) }>
						<ToolsPanelItem
							hasValue={ () =>
								props.attributes?.cellMinWidth !== defaultValue
							}
							label={ __( 'Cell Min Width', 'unitone' ) }
							onDeselect={ () =>
								props.setAttributes( {
									cellMinWidth: defaultValue,
								} )
							}
							isShownByDefault
						>
							<TextControl
								label={ __( 'Cell Min Width', 'unitone' ) }
								value={ props.attributes?.cellMinWidth || '' }
								onChange={ ( newValue ) => {
									props.setAttributes( {
										cellMinWidth: newValue,
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
	'unitone/with-inspector-controls',
	withInspectorControls
);
