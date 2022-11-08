import classnames from 'classnames';

import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from './utils';

export function useIsPositionDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.position' );
}

export function PositionEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<PanelBody title={ __( 'Position', 'unitone' ) } initialOpen={ false }>
			<SelectControl
				label={
					<>
						{ __( 'Position', 'unitone' ) } :<code>position</code>
					</>
				}
				options={ [
					{ label: '', value: '' },
					{
						label: 'static',
						value: 'static',
					},
					{
						label: 'relative',
						value: 'relative',
					},
					{
						label: 'absolute',
						value: 'absolute',
					},
					{ label: 'fixed', value: 'fixed' },
					{
						label: 'sticky',
						value: 'sticky',
					},
				] }
				value={ unitone?.position?.position }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								position: newAttribute,
							} ),
						} ),
					} );
				} }
			/>

			<TextControl
				label={
					<>
						{ __( 'Top', 'unitone' ) } : <code>top</code>
					</>
				}
				value={ unitone?.position?.top }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								top: newAttribute,
							} ),
						} ),
					} );
				} }
			/>

			<TextControl
				label={
					<>
						{ __( 'Right', 'unitone' ) } : <code>right</code>
					</>
				}
				value={ unitone?.position?.right }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								right: newAttribute,
							} ),
						} ),
					} );
				} }
			/>

			<TextControl
				label={
					<>
						{ __( 'Bottom', 'unitone' ) } : <code>bottom</code>
					</>
				}
				value={ unitone?.position?.bottom }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								bottom: newAttribute,
							} ),
						} ),
					} );
				} }
			/>

			<TextControl
				label={
					<>
						{ __( 'Left', 'unitone' ) } : <code>left</code>
					</>
				}
				value={ unitone?.position?.left }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								left: newAttribute,
							} ),
						} ),
					} );
				} }
			/>

			<TextControl
				label={
					<>
						{ __( 'The stack level', 'unitone' ) } :
						<code>z-index</code>
					</>
				}
				value={ unitone?.position?.zIndex }
				onChange={ ( newAttribute ) => {
					setAttributes( {
						unitone: cleanEmptyObject( {
							...unitone,
							position: cleanEmptyObject( {
								...unitone?.position,
								zIndex: newAttribute,
							} ),
						} ),
					} );
				} }
			/>
		</PanelBody>
	);
}

export function savePositionProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.position' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.position ) {
		return extraProps;
	}

	extraProps.style = cleanEmptyObject( {
		...extraProps.style,
		'--unitone--top': attributes?.unitone?.position?.top,
		'--unitone--right': attributes?.unitone?.position?.right,
		'--unitone--bottom': attributes?.unitone?.position?.bottom,
		'--unitone--left': attributes?.unitone?.position?.left,
		'--unitone--z-index': attributes?.unitone?.position?.zIndex,
	} );

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-position:${ attributes?.unitone?.position?.position }` ]:
				!! attributes?.unitone?.position?.position,
		}
	);

	return extraProps;
}

export function editPositionProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.position' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return savePositionProp( props, settings, attributes );
	};

	return settings;
}
