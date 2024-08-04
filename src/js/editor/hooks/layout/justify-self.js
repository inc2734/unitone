import classnames from 'classnames';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { JustifyToolbar } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { cleanEmptyObject, useDeviceType } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const justifySelfOptions = [
	{
		value: 'start',
		icon: justifyLeft,
		label: __( 'Justify self left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Justify self center', 'unitone' ),
	},
	{
		value: 'end',
		icon: justifyRight,
		label: __( 'Justify self right', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: justifyStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

function getDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifySelf;

	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: defaultValue;
}

function getIsResponsive( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		getBlockSupport( name, 'unitone.justifySelf.responsive' ) ||
		__unstableUnitoneSupports?.justifySelf?.responsive ||
		false
	);
}

function useDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );

	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: defaultValue;
}

export function hasJustifySelfValue( { name, attributes } ) {
	const defaultValue = getDefaultValue( { name, attributes } );

	return null != defaultValue
		? JSON.stringify( attributes?.unitone?.justifySelf ) !==
				JSON.stringify( defaultValue )
		: attributes?.unitone?.justifySelf !== undefined;
}

export function resetJustifySelf( { name, attributes, setAttributes } ) {
	delete attributes?.unitone?.justifySelf;

	const newUnitone = cleanEmptyObject( {
		...attributes?.unitone,
		justifySelf: getDefaultValue( { name, attributes } ) || undefined,
	} );

	setAttributes( {
		unitone: newUnitone,
	} );
}

export function useIsJustifySelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function JustifySelfToolbar( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );
	const defaultValue = useDefaultValue( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );

	const onChangeJustifySelf = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: physicalToLogical( newValue ),
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: physicalToLogical( newValue ),
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: physicalToLogical( newValue ),
				sm: unitone?.justifySelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: physicalToLogical( newValue ),
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	let value = unitone?.justifySelf;
	let onChange = onChangeJustifySelf;
	if ( isResponsive ) {
		const fallbackValue = typeof value === 'string' ? value : undefined;
		if ( 'desktop' === deviceType ) {
			value = value?.lg || fallbackValue;
			onChange = onChangeJustifySelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md || value?.lg || fallbackValue;
			onChange = onChangeJustifySelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm || value?.md || value?.lg || fallbackValue;
			onChange = onChangeJustifySelfSm;
		}
	}

	return (
		<JustifyToolbar
			allowedControls={ justifySelfOptions.map( ( option ) =>
				logicalToPhysical( option.value )
			) }
			value={ logicalToPhysical( value ) }
			onChange={ onChange }
		/>
	);
}

export function getJustifySelfEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.justifySelf?.label ||
		__( 'Justify self', 'unitone' )
	);
}

function JustifySelfEditPure( {
	name,
	label,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );
	const defaultValue = useDefaultValue( {
		name,
		attributes: { __unstableUnitoneSupports },
	} );
	const fallbackValue =
		typeof unitone?.justifySelf === 'string'
			? unitone?.justifySelf
			: undefined;

	const onChangeJustifySelf = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: newValue,
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: newValue,
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: newValue,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: newValue,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ unitone?.justifySelf?.lg || fallbackValue }
						onChange={ onChangeJustifySelfLg }
					>
						{ justifySelfOptions.map(
							( { value, icon, label: iconLabel } ) => (
								<ToggleGroupControlOptionIcon
									key={ value }
									icon={ icon }
									label={ iconLabel }
									value={ value }
								/>
							)
						) }
					</ToggleGroupControl>
				</fieldset>
			) }
			tabletControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							unitone?.justifySelf?.md ||
							unitone?.justifySelf?.lg ||
							fallbackValue
						}
						onChange={ onChangeJustifySelfMd }
					>
						{ justifySelfOptions.map(
							( { value, icon, label: iconLabel } ) => (
								<ToggleGroupControlOptionIcon
									key={ value }
									icon={ icon }
									label={ iconLabel }
									value={ value }
								/>
							)
						) }
					</ToggleGroupControl>
				</fieldset>
			) }
			mobileControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							unitone?.justifySelf?.sm ||
							unitone?.justifySelf?.md ||
							unitone?.justifySelf?.lg ||
							fallbackValue
						}
						onChange={ onChangeJustifySelfSm }
					>
						{ justifySelfOptions.map(
							( { value, icon, label: iconLabel } ) => (
								<ToggleGroupControlOptionIcon
									key={ value }
									icon={ icon }
									label={ iconLabel }
									value={ value }
								/>
							)
						) }
					</ToggleGroupControl>
				</fieldset>
			) }
		/>
	) : (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.justifySelf }
				onChange={ onChangeJustifySelf }
			>
				{ justifySelfOptions.map(
					( { value, icon, label: iconLabel } ) => (
						<ToggleGroupControlOptionIcon
							key={ value }
							icon={ icon }
							label={ iconLabel }
							value={ value }
						/>
					)
				) }
			</ToggleGroupControl>
		</fieldset>
	);
}

export const JustifySelfEdit = memo( JustifySelfEditPure );

export function saveJustifySelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.justifySelf' ) &&
		! attributes?.__unstableUnitoneSupports?.justifySelf
	) {
		delete attributes?.unitone?.justifySelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.justifySelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-justify-self:${ attributes.unitone?.justifySelf }` ]:
				typeof attributes.unitone?.justifySelf === 'string',
			[ `-justify-self:${ attributes.unitone?.justifySelf.lg }` ]:
				null != attributes.unitone?.justifySelf?.lg,
			[ `-justify-self:md:${ attributes.unitone?.justifySelf?.md }` ]:
				null != attributes.unitone?.justifySelf?.md,
			[ `-justify-self:sm:${ attributes.unitone?.justifySelf?.sm }` ]:
				null != attributes.unitone?.justifySelf?.sm,
		}
	);

	return extraProps;
}

export function editJustifySelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveJustifySelfProp( props, settings, attributes );
	};

	return settings;
}
