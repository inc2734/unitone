import classnames from 'classnames/dedupe';

import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { justifyLeft, justifyCenter, justifyRight } from '@wordpress/icons';

import { physicalToLogical, logicalToPhysical } from '../../../helper';

const blockAlignOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Right', 'unitone' ),
	},
];

export function hasBlockAlignValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.blockAlign;

	return null != defaultValue
		? attributes?.unitone?.blockAlign !== defaultValue
		: attributes?.unitone?.blockAlign !== undefined;
}

export function resetBlockAlign( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.blockAlign;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.blockAlign;

	if ( null != defaultValue ) {
		newUnitone.blockAlign = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsBlockAlignDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.blockAlign' );
}

export function BlockAlignToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<BlockControls group="block">
			<BlockAlignmentToolbar
				controls={ blockAlignOptions.map( ( option ) => option.value ) }
				value={ logicalToPhysical( unitone?.blockAlign ) }
				onChange={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						blockAlign: physicalToLogical( newAttribute ),
					};
					if ( null == newUnitone.blockAlign ) {
						if ( null == defaultValue ) {
							delete newUnitone.blockAlign;
						} else {
							newUnitone.blockAlign = '';
						}
					}

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
			/>
		</BlockControls>
	);
}

export function getBlockAlignEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.blockAlign?.label ||
		__( 'Block alignment', 'unitone' )
	);
}

export function BlockAlignEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			{ !! label && <legend>{ label }</legend> }

			<div>
				{ blockAlignOptions.map( ( { value, icon, iconLabel } ) => {
					return (
						<Button
							key={ value }
							label={ iconLabel }
							icon={ icon }
							isPressed={
								logicalToPhysical( unitone?.blockAlign ) ===
								value
							}
							onClick={ () => {
								const newUnitone = {
									...unitone,
									blockAlign:
										logicalToPhysical(
											unitone?.blockAlign
										) !== value
											? physicalToLogical( value )
											: undefined,
								};
								if ( null == newUnitone.blockAlign ) {
									if ( null == defaultValue ) {
										delete newUnitone.blockAlign;
									} else {
										newUnitone.blockAlign = '';
									}
								}

								setAttributes( {
									unitone: !! Object.keys( newUnitone ).length
										? newUnitone
										: undefined,
								} );
							} }
						/>
					);
				} ) }
			</div>
		</fieldset>
	);
}

export function saveBlockAlignProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.blockAlign' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.blockAlign ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-align:${ attributes.unitone?.blockAlign }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-align:${ attributes.unitone?.blockAlign }`
	);

	return extraProps;
}

export function editBlockAlignProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.blockAlign' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveBlockAlignProp( props, settings, attributes );
	};
	return settings;
}
