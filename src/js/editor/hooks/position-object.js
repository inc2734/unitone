import classnames from 'classnames';

import {
	SelectControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

export function useIsPositionDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.position' );
}

export function PositionEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<ToolsPanel label={ __( 'Position', 'unitone' ) }>
			<ToolsPanelItem
				hasValue={ () => unitone?.position?.position !== undefined }
				label={ __( 'Position', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.position;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<SelectControl
					label={
						<>
							{ __( 'Position', 'unitone' ) } :
							<code>position</code>
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
					value={ unitone?.position?.position || undefined }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								position: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.position ) {
							delete newUnitone.position.position;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => unitone?.position?.top !== undefined }
				label={ __( 'Top', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.top;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<TextControl
					label={
						<>
							{ __( 'Top', 'unitone' ) } : <code>top</code>
						</>
					}
					value={ unitone?.position?.top || '' }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								top: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.top ) {
							delete newUnitone.position.top;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => unitone?.position?.right !== undefined }
				label={ __( 'Right', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.right;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<TextControl
					label={
						<>
							{ __( 'Right', 'unitone' ) } : <code>right</code>
						</>
					}
					value={ unitone?.position?.right || '' }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								right: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.right ) {
							delete newUnitone.position.right;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => unitone?.position?.bottom !== undefined }
				label={ __( 'Bottom', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.bottom;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<TextControl
					label={
						<>
							{ __( 'Bottom', 'unitone' ) } : <code>bottom</code>
						</>
					}
					value={ unitone?.position?.bottom || '' }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								bottom: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.bottom ) {
							delete newUnitone.position.bottom;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => unitone?.position?.left !== undefined }
				label={ __( 'Left', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.left;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<TextControl
					label={
						<>
							{ __( 'Left', 'unitone' ) } : <code>left</code>
						</>
					}
					value={ unitone?.position?.left || '' }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								left: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.left ) {
							delete newUnitone.position.left;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>

			<ToolsPanelItem
				hasValue={ () => unitone?.position?.zIndex !== undefined }
				label={ __( 'The stack level', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.zIndex;
					if ( ! Object.keys( unitone?.position ).length ) {
						delete unitone?.position;
					}

					const newUnitone = { ...unitone };

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
				isShownByDefault
			>
				<TextControl
					label={
						<>
							{ __( 'The stack level', 'unitone' ) } :{ ' ' }
							<code>z-index</code>
						</>
					}
					value={ unitone?.position?.zIndex || '' }
					onChange={ ( newValue ) => {
						const newUnitone = {
							...unitone,
							position: {
								...unitone?.position,
								zIndex: newValue || undefined,
							},
						};
						if ( null == newUnitone.position.zIndex ) {
							delete newUnitone.position.zIndex;
						}
						if ( null == newUnitone.position ) {
							delete newUnitone.position;
						}

						setAttributes( {
							unitone: !! Object.keys( newUnitone ).length
								? newUnitone
								: undefined,
						} );
					} }
				/>
			</ToolsPanelItem>
		</ToolsPanel>
	);
}

export function savePositionProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.position' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.position ) {
		return extraProps;
	}

	extraProps.style = {
		...extraProps.style,
		'--unitone--top': attributes?.unitone?.position?.top,
		'--unitone--right': attributes?.unitone?.position?.right,
		'--unitone--bottom': attributes?.unitone?.position?.bottom,
		'--unitone--left': attributes?.unitone?.position?.left,
		'--unitone--z-index': attributes?.unitone?.position?.zIndex,
	};

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
