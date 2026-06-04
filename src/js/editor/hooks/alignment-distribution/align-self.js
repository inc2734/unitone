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

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	alignBottom,
	alignCenter,
	alignTop,
	alignStretch,
	auto,
} from '../icons';

import {
	cleanEmptyObject,
	mergeObjectWithDefaultValue,
	useDeviceType,
	normalizeForToggleGroupControl,
} from '../utils';

import { ResponsiveSettingsContainer } from '../components';

const alignSelfOptions = [
	{
		value: 'start',
		icon: alignTop,
		label: __( 'Align self top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align self center', 'unitone' ),
	},
	{
		value: 'end',
		icon: alignBottom,
		label: __( 'Align self bottom', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: alignStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
	{
		value: 'auto',
		icon: auto,
		label: __( 'Auto', 'unitone' ),
	},
];

function getIsResponsive( { name, __unstableUnitoneSupports } ) {
	return (
		getBlockSupport( name, 'unitone.alignSelf.responsive' ) ||
		__unstableUnitoneSupports?.alignSelf?.responsive ||
		false
	);
}

function getDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignSelf;
	const unstableDefaultValue = __unstableUnitoneSupports?.alignSelf?.default;
	return unstableDefaultValue ?? defaultValue;
}

function useDefaultValue( { name, __unstableUnitoneSupports } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );
	const unstableDefaultValue = __unstableUnitoneSupports?.alignSelf?.default;
	return unstableDefaultValue ?? defaultValue;
}

export function hasAlignSelfValue( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
} ) {
	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );

	return (
		JSON.stringify( defaultValue ) !==
			JSON.stringify( unitone?.alignSelf ) &&
		undefined !== unitone?.alignSelf
	);
}

export function resetAlignSelfFilter() {
	return {
		alignSelf: undefined,
	};
}

export function resetAlignSelf( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetAlignSelfFilter() )
		),
	} );
}

export function isAlignSelfSupportDisabled( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		! hasBlockSupport( name, 'unitone.alignSelf' ) &&
		! __unstableUnitoneSupports?.alignSelf
	);
}

export function AlignSelfToolbar( {
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const deviceType = useDeviceType();
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	let defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const primitiveValue =
		typeof unitone?.alignSelf === 'string' ? unitone?.alignSelf : undefined;

	const onChangeAlignSelf = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf:
					newValue !== unitone?.alignSelf ? newValue : undefined,
			} ),
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg:
						newValue !== unitone?.alignSelf?.lg
							? newValue
							: undefined,
					md: unitone?.alignSelf?.md,
					sm: unitone?.alignSelf?.sm,
				},
			} ),
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg: unitone?.alignSelf?.lg ?? primitiveValue,
					md:
						newValue !== unitone?.alignSelf?.md
							? newValue
							: undefined,
					sm: unitone?.alignSelf?.sm,
				},
			} ),
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg: unitone?.alignSelf?.lg ?? primitiveValue,
					md: unitone?.alignSelf?.md,
					sm:
						newValue !== unitone?.alignSelf?.sm
							? newValue
							: undefined,
				},
			} ),
		} );
	};

	let value = unitone?.alignSelf;
	let onChange = onChangeAlignSelf;
	if ( isResponsive ) {
		if ( 'desktop' === deviceType ) {
			value = value?.lg ?? primitiveValue;
			defaultValue = defaultValue?.lg;
			onChange = onChangeAlignSelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md ?? value?.lg ?? primitiveValue;
			defaultValue = defaultValue?.md ?? defaultValue?.lg;
			onChange = onChangeAlignSelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm ?? value?.md ?? value?.lg ?? primitiveValue;
			defaultValue =
				defaultValue?.sm ?? defaultValue?.md ?? defaultValue?.lg;
			onChange = onChangeAlignSelfSm;
		}
	}

	return (
		<ToolbarDropdownMenu
			label={ __( 'Align self', 'unitone' ) }
			icon={
				alignSelfOptions.filter(
					( option ) => option.value === ( value ?? defaultValue )
				)?.[ 0 ]?.icon ?? alignSelfOptions[ 0 ]?.icon
			}
			controls={ alignSelfOptions.map( ( option ) => ( {
				...option,
				title: option.label,
				isActive: option.value === ( value ?? defaultValue ),
				onClick: () => onChange( option.value ),
			} ) ) }
		/>
	);
}

export function getAlignSelfEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Align self', 'unitone' );
	const defaultCode = <code className="unitone-label-code">align-self</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.alignSelf?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.alignSelf?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.alignSelf?.code || defaultCode }
		</>
	);
}

export function AlignSelfEdit( {
	label,
	name,
	attributes: { unitone, __unstableUnitoneSupports },
	setAttributes,
} ) {
	const isResponsive = getIsResponsive( { name, __unstableUnitoneSupports } );
	const defaultValue = useDefaultValue( { name, __unstableUnitoneSupports } );
	const primitiveValue =
		typeof unitone?.alignSelf === 'string' ? unitone?.alignSelf : undefined;

	const onChangeAlignSelf = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject(
				cleanEmptyObject( {
					...unitone,
					alignSelf:
						newValue !== unitone?.alignSelf ? newValue : undefined,
				} )
			),
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg:
						newValue !== unitone?.alignSelf?.lg
							? newValue
							: undefined,
					md: unitone?.alignSelf?.md,
					sm: unitone?.alignSelf?.sm,
				},
			} ),
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg: unitone?.alignSelf?.lg ?? primitiveValue,
					md:
						newValue !== unitone?.alignSelf?.md
							? newValue
							: undefined,
					sm: unitone?.alignSelf?.sm,
				},
			} ),
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				alignSelf: {
					lg: unitone?.alignSelf?.lg ?? primitiveValue,
					md: unitone?.alignSelf?.md,
					sm:
						newValue !== unitone?.alignSelf?.sm
							? newValue
							: undefined,
				},
			} ),
		} );
	};

	return isResponsive ? (
		<ResponsiveSettingsContainer
			label={ label }
			desktopControls={ () => (
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.alignSelf?.lg ??
								primitiveValue ??
								defaultValue?.lg
						) }
						isDeselectable={ ! defaultValue?.lg }
						onChange={ ( newValue ) =>
							onChangeAlignSelfLg(
								normalizeForToggleGroupControl( newValue )
							)
						}
					>
						{ alignSelfOptions.map(
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.alignSelf?.md ??
								unitone?.alignSelf?.lg ??
								primitiveValue ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						isDeselectable={ false }
						onChange={ ( newValue ) =>
							onChangeAlignSelfMd(
								normalizeForToggleGroupControl( newValue )
							)
						}
					>
						{ alignSelfOptions.map(
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
					<ToggleGroupControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={ normalizeForToggleGroupControl(
							unitone?.alignSelf?.sm ??
								unitone?.alignSelf?.md ??
								unitone?.alignSelf?.lg ??
								primitiveValue ??
								defaultValue?.sm ??
								defaultValue?.md ??
								defaultValue?.lg
						) }
						isDeselectable={ false }
						onChange={ ( newValue ) =>
							onChangeAlignSelfSm(
								normalizeForToggleGroupControl( newValue )
							)
						}
					>
						{ alignSelfOptions.map(
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
		<fieldset className="block-editor-hooks__flex-layout-justification-controls unitone-dimension-control">
			<ToggleGroupControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={ label }
				value={ normalizeForToggleGroupControl(
					unitone?.alignSelf ?? defaultValue
				) }
				isDeselectable={ ! defaultValue }
				onChange={ ( newValue ) =>
					onChangeAlignSelf(
						normalizeForToggleGroupControl( newValue )
					)
				}
			>
				{ alignSelfOptions.map(
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

export function withAlignSelfBlockProps( settings ) {
	const { attributes, name } = settings;
	const { __unstableUnitoneSupports } = attributes;

	if (
		isAlignSelfSupportDisabled( {
			name,
			attributes: { __unstableUnitoneSupports },
		} )
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name, __unstableUnitoneSupports } );
	const newAlignSelf = mergeObjectWithDefaultValue(
		attributes?.unitone?.alignSelf,
		defaultValue
	);

	if ( null == newAlignSelf ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-align-self:${ newAlignSelf }` ]:
						typeof newAlignSelf === 'string',
					[ `-align-self:${ newAlignSelf?.lg }` ]:
						null != newAlignSelf?.lg,
					[ `-align-self:md:${ newAlignSelf?.md }` ]:
						null != newAlignSelf?.md,
					[ `-align-self:sm:${ newAlignSelf?.sm }` ]:
						null != newAlignSelf?.sm,
				}
			),
		},
	};
}
