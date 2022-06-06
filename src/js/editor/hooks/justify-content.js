import classnames from 'classnames';

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

import { cleanEmptyObject } from './utils';
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

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function JustifyContentEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<legend>{ __( 'Justify content', 'unitone' ) }</legend>
			<div>
				{ justifyContentOptions.map( ( { value, icon, label } ) => {
					return (
						<Button
							key={ value }
							label={ label }
							icon={ icon }
							isPressed={
								logicalToPhysical( unitone?.justifyContent ) ===
								value
							}
							onClick={ () => {
								const newUnitone = {
									...unitone,
									justifyContent: physicalToLogical( value ),
								};

								setAttributes( {
									unitone: cleanEmptyObject( newUnitone ),
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

	extraProps[ 'data-layout' ] = classnames(
		extraProps[ 'data-layout' ],
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
