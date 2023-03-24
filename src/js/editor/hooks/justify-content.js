import classnames from 'classnames/dedupe';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
} from '@wordpress/icons';

import { physicalToLogical, logicalToPhysical } from '../../helper';

const justifyContentOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Justify items left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Justify items right', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: justifySpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
];

export function hasJustifyContentValue( props ) {
	return props.attributes?.unitone?.justifyContent !== undefined;
}

export function resetJustifyContent( { attributes = {}, setAttributes } ) {
	delete attributes?.unitone?.justifyContent;
	const newUnitone = { ...attributes?.unitone };

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsJustifyContentDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.justifyContent' );
}

export function JustifyContentToolbar( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<JustifyToolbar
			allowedControls={ justifyContentOptions.map(
				( option ) => option.value
			) }
			value={ logicalToPhysical( unitone?.justifyContent ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					justifyContent: physicalToLogical( newAttribute ),
				};
				if ( null == newUnitone.justifyContent ) {
					delete newUnitone.justifyContent;
				}

				setAttributes( {
					unitone: !! Object.keys( newUnitone ).length
						? newUnitone
						: undefined,
				} );
			} }
		/>
	);
}

export function JustifyContentEdit( props ) {
	const {
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			{ !! label && <legend>{ label }</legend> }

			<div>
				{ justifyContentOptions.map( ( { value, icon, iconLabel } ) => {
					return (
						<Button
							key={ value }
							label={ iconLabel }
							icon={ icon }
							isPressed={
								logicalToPhysical( unitone?.justifyContent ) ===
								value
							}
							onClick={ () => {
								const newUnitone = {
									...unitone,
									justifyContent:
										logicalToPhysical(
											unitone?.justifyContent
										) !== value
											? physicalToLogical( value )
											: undefined,
								};
								if ( null == newUnitone.justifyContent ) {
									delete newUnitone.justifyContent;
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

export function saveJustifyContentProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.justifyContent' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.justifyContent ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-justify-content:${ attributes.unitone?.justifyContent }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-justify-content:${ attributes.unitone?.justifyContent }`
	);

	return extraProps;
}

export function editJustifyContentProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.justifyContent' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveJustifyContentProp( props, settings, attributes );
	};
	return settings;
}
