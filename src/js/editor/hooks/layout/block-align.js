import classnames from 'classnames/dedupe';

import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';

import { BlockAlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { justifyLeft, justifyCenter, justifyRight } from '@wordpress/icons';

import { physicalToLogical, logicalToPhysical } from '../../../helper';

const blockAlignOptions = [
	{
		value: 'left',
		icon: justifyLeft,
		label: __( 'Left', 'unitone' ),
	},
	{
		value: 'center',
		icon: justifyCenter,
		label: __( 'Center', 'unitone' ),
	},
	{
		value: 'right',
		icon: justifyRight,
		label: __( 'Right', 'unitone' ),
	},
];

export function hasBlockAlignValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.blockAlign;

	return null != defaultValue
		? attributes?.unitone?.blockAlign !== defaultValue
		: attributes?.unitone?.blockAlign !== undefined;
}

export function resetBlockAlign( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.blockAlign;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.blockAlign;

	if ( null != defaultValue ) {
		newUnitone.blockAlign = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsBlockAlignDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.blockAlign' );
}

export function BlockAlignToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<BlockControls group="block">
			<BlockAlignmentToolbar
				controls={ blockAlignOptions.map( ( option ) => option.value ) }
				value={ logicalToPhysical( unitone?.blockAlign ) }
				onChange={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						blockAlign: physicalToLogical( newAttribute ),
					};
					if ( null == newUnitone.blockAlign ) {
						if ( null == defaultValue ) {
							delete newUnitone.blockAlign;
						} else {
							newUnitone.blockAlign = '';
						}
					}

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
			/>
		</BlockControls>
	);
}

export function getBlockAlignEditLabel( props ) {
	const {
		attributes: { __unstableUnitoneSupports },
	} = props;

	return (
		__unstableUnitoneSupports?.blockAlign?.label ||
		__( 'Block alignment', 'unitone' )
	);
}

export function BlockAlignEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.blockAlign;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			<ToggleGroupControl
				__nextHasNoMarginBottom
				label={ label }
				value={ logicalToPhysical( unitone?.blockAlign ) }
				onChange={ ( value ) => {
					const newUnitone = {
						...unitone,
						blockAlign:
							logicalToPhysical( unitone?.blockAlign ) !== value
								? physicalToLogical( value )
								: undefined,
					};
					if ( null == newUnitone.blockAlign ) {
						if ( null == defaultValue ) {
							delete newUnitone.blockAlign;
						} else {
							newUnitone.blockAlign = '';
						}
					}

					setAttributes( {
						unitone: !! Object.keys( newUnitone ).length
							? newUnitone
							: undefined,
					} );
				} }
			>
				{ blockAlignOptions.map(
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

export function saveBlockAlignProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.blockAlign' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.blockAlign ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-align:${ attributes.unitone?.blockAlign }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-align:${ attributes.unitone?.blockAlign }`
	);

	return extraProps;
}

export function useBlockAlignBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveBlockAlignProp( wrapperProps, name, attributes ),
		},
	};
}
