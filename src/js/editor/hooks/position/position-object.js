import classnames from 'classnames';

import {
	SelectControl,
	TextControl,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

export function useIsPositionDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.position' );
}

export function PositionEdit( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.position;
	}, [] );

	return (
		<ToolsPanel label={ __( 'Position', 'unitone' ) }>
			<ToolsPanelItem
				hasValue={ () =>
					unitone?.position?.position !== defaultValue?.position
				}
				label={ __( 'Position', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.position;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.position = defaultValue?.position;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.position;
					}

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
							if ( null == defaultValue ) {
								delete newUnitone.position.position;
							} else {
								newUnitone.position.position = '';
							}
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
				hasValue={ () => unitone?.position?.top !== defaultValue?.top }
				label={ __( 'Top', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.top;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.top = defaultValue?.top;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.position;
					}

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
							if ( null == defaultValue ) {
								delete newUnitone.position.top;
							} else {
								newUnitone.position.top = '';
							}
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
				hasValue={ () =>
					unitone?.position?.right !== defaultValue?.right
				}
				label={ __( 'Right', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.right;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.right = defaultValue?.right;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.position;
					}

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
							if ( null == defaultValue ) {
								delete newUnitone.position.right;
							} else {
								newUnitone.position.right = '';
							}
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
				hasValue={ () =>
					unitone?.position?.bottom !== defaultValue?.bottom
				}
				label={ __( 'Bottom', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.bottom;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.bottom = defaultValue?.bottom;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.position;
					}

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
							if ( null == defaultValue ) {
								delete newUnitone.position.bottom;
							} else {
								newUnitone.position.bottom = '';
							}
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
				hasValue={ () =>
					unitone?.position?.left !== defaultValue?.left
				}
				label={ __( 'Left', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.left;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.left = defaultValue?.left;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.position;
					}

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
							if ( null == defaultValue ) {
								delete newUnitone.position.left;
							} else {
								newUnitone.position.left = '';
							}
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
				hasValue={ () =>
					unitone?.position?.zIndex !== defaultValue?.zIndex
				}
				label={ __( 'The stack level', 'unitone' ) }
				onDeselect={ () => {
					delete unitone?.position?.zIndex;
					const newUnitone = { ...unitone };

					if ( null != defaultValue?.position ) {
						newUnitone.position.zIndex = defaultValue?.zIndex;
					}

					if ( ! Object.keys( unitone?.position ).length ) {
						delete newUnitone?.zIndex;
					}

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
							{ __( 'The stack level', 'unitone' ) }&nbsp;:&nbsp;
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
							if ( null == defaultValue ) {
								delete newUnitone.position.zIndex;
							} else {
								newUnitone.position.zIndex = '';
							}
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

export function usePositionBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...savePositionProp( wrapperProps, name, attributes ),
		},
	};
}
