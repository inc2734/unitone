import classnames from 'classnames/dedupe';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { JustifyToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	justifyLeft,
	justifyCenter,
	justifyRight,
	justifySpaceBetween,
} from '@wordpress/icons';

import { physicalToLogical, logicalToPhysical } from '../../../helper';

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
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.justifyContent;

	return null != defaultValue
		? attributes?.unitone?.justifyContent !== defaultValue
		: attributes?.unitone?.justifyContent !== undefined;
}

export function resetJustifyContent( props ) {
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

export function useIsJustifyContentDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.justifyContent' );
}

export function JustifyContentToolbar( props ) {
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

export function getJustifyContentEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.justifyContent?.label ||
		__( 'Justify content', 'unitone' )
	);
}

export function JustifyContentEdit( props ) {
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
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical( unitone?.justifyContent ) }
				onChange={ ( value ) => {
					const newUnitone = {
						...unitone,
						justifyContent:
							logicalToPhysical( unitone?.justifyContent ) !==
							value
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
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
			>
				{ justifyContentOptions.map(
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
