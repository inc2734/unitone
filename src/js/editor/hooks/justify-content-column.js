import classnames from 'classnames/dedupe';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { alignBottom, alignCenter, alignTop, alignSpaceBetween } from './icons';

import { cleanEmptyObject } from './utils';
import { physicalToLogical, logicalToPhysical } from '../../helper';

const justifyContentColumnOptions = [
	{
		value: 'left',
		icon: alignTop,
		label: __( 'Justify items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Justify items center', 'unitone' ),
	},
	{
		value: 'right',
		icon: alignBottom,
		label: __( 'Justify items bottom', 'unitone' ),
	},
	{
		value: 'space-between',
		icon: alignSpaceBetween,
		label: __( 'Justify items space-between', 'unitone' ),
	},
];

export function useIsJustifyContentColumnDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.justifyContentColumn' );
}

export function JustifyContentColumnToolbar( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<JustifyToolbar
			allowedControls={ justifyContentColumnOptions.map(
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

export function JustifyContentColumnEdit( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<legend>
				{
					<>
						{ __( 'Align items', 'unitone' ) } :
						<code>justify-content</code>
					</>
				}
			</legend>
			<div>
				{ justifyContentColumnOptions.map(
					( { value, icon, label } ) => {
						return (
							<Button
								key={ value }
								label={ label }
								icon={ icon }
								isPressed={
									logicalToPhysical(
										unitone?.justifyContent
									) === value
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

									setAttributes( {
										unitone: cleanEmptyObject( newUnitone ),
									} );
								} }
							/>
						);
					}
				) }
			</div>
		</fieldset>
	);
}

export function saveJustifyContentColumnProp(
	extraProps,
	blockType,
	attributes
) {
	if ( ! hasBlockSupport( blockType, 'unitone.justifyContentColumn' ) ) {
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

export function editJustifyContentColumnProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.justifyContentColumn' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveJustifyContentColumnProp( props, settings, attributes );
	};
	return settings;
}
