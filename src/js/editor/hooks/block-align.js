import classnames from 'classnames/dedupe';

import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { justifyLeft, justifyCenter, justifyRight } from '@wordpress/icons';

import { physicalToLogical, logicalToPhysical } from '../../helper';

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
	return props.attributes?.unitone?.blockAlign !== undefined;
}

export function resetBlockAlign( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.blockAlign;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsBlockAlignDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.blockAlign' );
}

export function BlockAlignToolbar( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

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
						delete newUnitone.blockAlign;
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

export function BlockAlignEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

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
									delete newUnitone.blockAlign;
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
