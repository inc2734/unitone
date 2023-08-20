import classnames from 'classnames/dedupe';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	alignBottom,
	alignCenter,
	alignTop,
	alignSpaceBetween,
} from '../icons';

import { physicalToLogical, logicalToPhysical } from '../../../helper';

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

export function hasJustifyContentColumnValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyContent;

	return null != defaultValue
		? attributes?.unitone?.justifyContent !== defaultValue
		: attributes?.unitone?.justifyContent !== undefined;
}

export function resetJustifyContentColumn( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.justifyContent;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyContent;

	if ( null != defaultValue ) {
		newUnitone.justifyContent = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsJustifyContentColumnDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.justifyContentColumn' );
}

export function JustifyContentColumnToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

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
				if ( null == newUnitone.justifyContent ) {
					if ( null == defaultValue ) {
						delete newUnitone.justifyContent;
					} else {
						newUnitone.justifyContent = '';
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
}

export function JustifyContentColumnEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifyContent;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			{ !! label && <legend>{ label }</legend> }

			<div>
				{ justifyContentColumnOptions.map(
					( { value, icon, iconLabel } ) => {
						return (
							<Button
								key={ value }
								label={ iconLabel }
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
									if ( null == newUnitone.justifyContent ) {
										if ( null == defaultValue ) {
											delete newUnitone.justifyContent;
										} else {
											newUnitone.justifyContent = '';
										}
									}

									setAttributes( {
										unitone: !! Object.keys( newUnitone )
											.length
											? newUnitone
											: undefined,
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
