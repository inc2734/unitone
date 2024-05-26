import classnames from 'classnames';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';

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

export function hasAlignSelfValue( props ) {
	const { name, attributes } = props;

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.alignSelf?.default
			? attributes?.__unstableUnitoneSupports?.alignSelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.alignSelf;

	return null != defaultValue
		? attributes?.unitone?.alignSelf !== defaultValue
		: attributes?.unitone?.alignSelf !== undefined;
}

export function resetAlignSelf( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.alignSelf;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue =
		null != attributes?.__unstableUnitoneSupports?.alignSelf?.default
			? attributes?.__unstableUnitoneSupports?.alignSelf?.default
			: wp.data.select( blocksStore ).getBlockType( name )?.attributes
					?.unitone?.default?.alignSelf;

	if ( null != defaultValue ) {
		newUnitone.alignSelf = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
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

export function AlignSelfToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );

	return (
		<BlockVerticalAlignmentToolbar
			controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
			value={ logicalToPhysical( unitone?.alignSelf, 'vertical' ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignSelf: physicalToLogical( newAttribute ),
				};
				if ( null == newUnitone.alignSelf ) {
					if ( null == defaultValue ) {
						delete newUnitone.alignSelf;
					} else {
						newUnitone.alignSelf = '';
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

export function getAlignSelfEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.alignSelf?.label ||
		__( 'Align self', 'unitone' )
	);
}

export function AlignSelfEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone, __unstableUnitoneSupports },
		setAttributes,
	} = props;

	let defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignSelf;
	}, [] );
	if ( null != __unstableUnitoneSupports?.alignSelf?.default ) {
		defaultValue = __unstableUnitoneSupports?.alignSelf?.default;
	}

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ unitone?.alignSelf }
				onChange={ ( value ) => {
					const newUnitone = {
						...unitone,
						alignSelf: value || undefined,
					};
					if ( null == newUnitone.alignSelf ) {
						if ( null == defaultValue ) {
							delete newUnitone.alignSelf;
						} else {
							newUnitone.alignSelf = '';
						}
					}

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
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
		`-align-self:${ attributes.unitone?.alignSelf }`
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
