import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	ToolbarDropdownMenu,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifyStretch,
} from '@wordpress/icons';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { cleanEmptyObject, useDeviceType } from '../utils';

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

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.justifySelf.responsive' ) ||
		__unstableUnitoneSupports?.justifySelf?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: wp.data.select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.justifySelf;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.justifySelf;
	}, [] );

	return null != __unstableUnitoneSupports?.justifySelf?.default
		? __unstableUnitoneSupports?.justifySelf?.default
		: defaultValue;
}

export function hasJustifySelfValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.justifySelf ) &&
		undefined !== unitone?.justifySelf
	);
}

function resetJustifySelfFilter( attributes ) {
	if ( null != attributes?.unitone?.justifySelf ) {
		attributes.unitone.justifySelf = undefined;
	}

	return attributes;
}

export function resetJustifySelf( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetJustifySelfFilter( { unitone } )?.unitone
		),
	} );
}

export function useIsJustifySelfDisabled( {
	name,
	__unstableUnitoneSupports,
} ) {
	return (
		! hasBlockSupport( name, 'unitone.justifySelf' ) &&
		! __unstableUnitoneSupports?.justifySelf
	);
}

export function JustifySelfToolbar( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	let defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	const onChangeJustifySelf = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: newValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: newValue || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: newValue || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	let value = unitone?.justifySelf;
	let onChange = onChangeJustifySelf;
	if ( isResponsive ) {
		const fallbackValue = typeof value === 'string' ? value : undefined;
		if ( 'desktop' === deviceType ) {
			value = value?.lg || fallbackValue;
			defaultValue = defaultValue?.lg;
			onChange = onChangeJustifySelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md || value?.lg || fallbackValue;
			defaultValue = defaultValue?.md || defaultValue?.lg;
			onChange = onChangeJustifySelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm || value?.md || value?.lg || fallbackValue;
			defaultValue =
				defaultValue?.sm || defaultValue?.md || defaultValue?.lg;
			onChange = onChangeJustifySelfSm;
		}
	}

	return (
		<ToolbarDropdownMenu
			label={ __( 'Justify self', 'unitone' ) }
			icon={
				justifySelfOptions.filter(
					( option ) => option.value === value ?? defaultValue
				)?.[ 0 ]?.icon ?? justifySelfOptions[ 0 ]?.icon
			}
			controls={ justifySelfOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive: option.value === value ?? defaultValue,
				onClick: () => onChange( option.value ),
			} ) ) }
		/>
	);
}

export function getJustifySelfEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Justify self', 'unitone' );
	const defaultCode = <code>justify-self</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.justifySelf?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.justifySelf?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.justifySelf?.code || defaultCode }
		</>
	);
}

export function JustifySelfEdit( {
	label,
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const fallbackValue =
		typeof unitone?.justifySelf === 'string'
			? unitone?.justifySelf
			: undefined;

	const onChangeJustifySelf = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: newValue || undefined,
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfLg = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: newValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfMd = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: newValue || undefined,
				sm: unitone?.justifySelf?.sm || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeJustifySelfSm = ( newValue ) => {
		const newUnitone = {
			...unitone,
			justifySelf: {
				lg: unitone?.justifySelf?.lg || fallbackValue || undefined,
				md: unitone?.justifySelf?.md || undefined,
				sm: newValue || undefined,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.lg || fallbackValue ) ??
							defaultValue?.lg
						}
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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.md ||
								unitone?.justifySelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.md || defaultValue?.lg )
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
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							( unitone?.justifySelf?.sm ||
								unitone?.justifySelf?.md ||
								unitone?.justifySelf?.lg ||
								fallbackValue ) ??
							( defaultValue?.sm ||
								defaultValue?.md ||
								defaultValue?.lg )
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
				__next40pxDefaultSize
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

export function useJustifySelfBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );

	if ( ! hasBlockSupport( name, 'unitone.justifySelf' ) ) {
		if ( ! attributes?.__unstableUnitoneSupports?.justifySelf ) {
			return settings;
		}
	}

	const newJustifySelf = attributes?.unitone?.justifySelf ?? defaultValue;

	if ( null == newJustifySelf ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-justify-self:${ newJustifySelf }` ]:
						typeof newJustifySelf === 'string',
					[ `-justify-self:${ newJustifySelf.lg }` ]:
						null != newJustifySelf?.lg,
					[ `-justify-self:md:${ newJustifySelf?.md }` ]:
						null != newJustifySelf?.md,
					[ `-justify-self:sm:${ newJustifySelf?.sm }` ]:
						null != newJustifySelf?.sm,
				}
			),
		},
	};
}
