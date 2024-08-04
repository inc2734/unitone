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

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { ResponsiveSettingsContainer } from '../components';
import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';
import { cleanEmptyObject, useDeviceType } from '../utils';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

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
];

function getDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignSelf;

	return null != __unstableUnitoneSupports?.alignSelf?.default
		? __unstableUnitoneSupports?.alignSelf?.default
		: defaultValue;
}

function getIsResponsive( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		getBlockSupport( name, 'unitone.alignSelf.responsive' ) ||
		__unstableUnitoneSupports?.alignSelf?.responsive ||
		false
	);
}

function useDefaultValue( {
	name,
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );

	return null != __unstableUnitoneSupports?.alignSelf?.default
		? __unstableUnitoneSupports?.alignSelf?.default
		: defaultValue;
}

export function hasAlignSelfValue( { name, attributes } ) {
	const defaultValue = getDefaultValue( { name, attributes } );

	return null != defaultValue
		? JSON.stringify( attributes?.unitone?.alignSelf ) !==
				JSON.stringify( defaultValue )
		: attributes?.unitone?.alignSelf !== undefined;
}

export function resetAlignSelf( { name, attributes, setAttributes } ) {
	delete attributes?.unitone?.alignSelf;

	const newUnitone = cleanEmptyObject( {
		...attributes?.unitone,
		alignSelf: getDefaultValue( { name, attributes } ) || undefined,
	} );

	setAttributes( {
		unitone: newUnitone,
	} );
}

export function useIsAlignSelfDisabled( {
	name: blockName,
	attributes: { __unstableUnitoneSupports },
} = {} ) {
	return (
		! hasBlockSupport( blockName, 'unitone.alignSelf' ) &&
		! __unstableUnitoneSupports?.alignSelf
	);
}

export function AlignSelfToolbar( {
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

	const onChangeAlignSelf = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: physicalToLogical( newValue ),
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: physicalToLogical( newValue ),
				md: unitone?.alignSelf?.md || undefined,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || undefined,
				md: physicalToLogical( newValue ),
				sm: unitone?.alignSelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || undefined,
				md: unitone?.alignSelf?.md || undefined,
				sm: physicalToLogical( newValue ),
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	let value = unitone?.alignSelf;
	let onChange = onChangeAlignSelf;
	if ( isResponsive ) {
		const fallbackValue = typeof value === 'string' ? value : undefined;
		if ( 'desktop' === deviceType ) {
			value = value?.lg || fallbackValue;
			onChange = onChangeAlignSelfLg;
		} else if ( 'tablet' === deviceType ) {
			value = value?.md || value?.lg || fallbackValue;
			onChange = onChangeAlignSelfMd;
		} else if ( 'mobile' === deviceType ) {
			value = value?.sm || value?.md || value?.lg || fallbackValue;
			onChange = onChangeAlignSelfSm;
		}
	}

	return (
		<BlockVerticalAlignmentToolbar
			controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
			value={ logicalToPhysical( value, 'vertical' ) }
			onChange={ onChange }
		/>
	);
}

export function getAlignSelfEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return (
		__unstableUnitoneSupports?.alignSelf?.label ||
		__( 'Align self', 'unitone' )
	);
}

function AlignSelfEditPure( {
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
		typeof unitone?.alignSelf === 'string' ? unitone?.alignSelf : undefined;

	const onChangeAlignSelf = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: newValue,
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfLg = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.lg || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: newValue,
				md: unitone?.alignSelf?.md || undefined,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfMd = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.md || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || fallbackValue || undefined,
				md: newValue,
				sm: unitone?.alignSelf?.sm || undefined,
			},
		} );

		setAttributes( {
			unitone: newUnitone,
		} );
	};

	const onChangeAlignSelfSm = ( newValue ) => {
		if ( null == newValue ) {
			newValue = defaultValue?.sm || undefined;
		}

		const newUnitone = cleanEmptyObject( {
			...unitone,
			alignSelf: {
				lg: unitone?.alignSelf?.lg || fallbackValue || undefined,
				md: unitone?.alignSelf?.md || undefined,
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
						value={ unitone?.alignSelf?.lg || fallbackValue }
						onChange={ onChangeAlignSelfLg }
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							unitone?.alignSelf?.md ||
							unitone?.alignSelf?.lg ||
							fallbackValue
						}
						onChange={ onChangeAlignSelfMd }
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
				<fieldset className="block-editor-hooks__flex-layout-justification-controls">
					<ToggleGroupControl
						__nextHasNoMarginBottom
						hideLabelFromVision
						value={
							unitone?.alignSelf?.sm ||
							unitone?.alignSelf?.md ||
							unitone?.alignSelf?.lg ||
							fallbackValue
						}
						onChange={ onChangeAlignSelfSm }
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
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.alignSelf }
				onChange={ onChangeAlignSelf }
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

export const AlignSelfEdit = memo( AlignSelfEditPure );

export function saveAlignSelfProp( extraProps, blockType, attributes ) {
	if (
		! hasBlockSupport( blockType, 'unitone.alignSelf' ) &&
		! attributes?.__unstableUnitoneSupports?.alignSelf
	) {
		delete attributes?.unitone?.alignSelf;
		if (
			!! attributes?.unitone &&
			! Object.keys( attributes?.unitone ).length
		) {
			delete attributes?.unitone;
		}
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.alignSelf ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-align-self:${ attributes.unitone?.alignSelf }` ]:
				typeof attributes.unitone?.alignSelf === 'string',
			[ `-align-self:${ attributes.unitone?.alignSelf.lg }` ]:
				null != attributes.unitone?.alignSelf?.lg,
			[ `-align-self:md:${ attributes.unitone?.alignSelf?.md }` ]:
				null != attributes.unitone?.alignSelf?.md,
			[ `-align-self:sm:${ attributes.unitone?.alignSelf?.sm }` ]:
				null != attributes.unitone?.alignSelf?.sm,
		}
	);

	return extraProps;
}

export function editAlignSelfProp( settings ) {
	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAlignSelfProp( props, settings, attributes );
	};

	return settings;
}
