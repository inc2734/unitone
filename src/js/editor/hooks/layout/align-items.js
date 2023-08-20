import classnames from 'classnames/dedupe';

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { alignBottom, alignCenter, alignTop, alignStretch } from '../icons';
import { physicalToLogical, logicalToPhysical } from '../../../helper';

const alignItemsOptions = [
	{
		value: 'top',
		icon: alignTop,
		label: __( 'Align items top', 'unitone' ),
	},
	{
		value: 'center',
		icon: alignCenter,
		label: __( 'Align items center', 'unitone' ),
	},
	{
		value: 'bottom',
		icon: alignBottom,
		label: __( 'Align items bottom', 'unitone' ),
	},
	{
		value: 'stretch',
		icon: alignStretch,
		label: __( 'Stretch to fill', 'unitone' ),
	},
];

export function hasAlignItemsValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignItems;

	return null != defaultValue
		? attributes?.unitone?.alignItems !== defaultValue
		: attributes?.unitone?.alignItems !== undefined;
}

export function resetAlignItems( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.alignItems;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.alignItems;

	if ( null != defaultValue ) {
		newUnitone.alignItems = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsAlignItemsDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.alignItems' );
}

export function AlignItemsToolbar( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignItems;
	}, [] );

	return (
		<BlockVerticalAlignmentToolbar
			controls={ [ 'top', 'center', 'bottom', 'stretch' ] }
			value={ logicalToPhysical( unitone?.alignItems, 'vertical' ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignItems: physicalToLogical( newAttribute ),
				};
				if ( null == newUnitone.alignItems ) {
					if ( null == defaultValue ) {
						delete newUnitone.alignItems;
					} else {
						newUnitone.alignItems = '';
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

export function AlignItemsEdit( props ) {
	const {
		name,
		label,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.alignItems;
	}, [] );

	return (
		<fieldset className="block-editor-hooks__flex-layout-justification-controls">
			{ !! label && <legend>{ label }</legend> }

			<div>
				{ alignItemsOptions.map( ( { value, icon, iconLabel } ) => {
					return (
						<Button
							key={ value }
							label={ iconLabel }
							icon={ icon }
							isPressed={
								logicalToPhysical(
									unitone?.alignItems,
									'vertical'
								) === value
							}
							onClick={ () => {
								const newUnitone = {
									...unitone,
									alignItems:
										logicalToPhysical(
											unitone?.alignItems,
											'vertical'
										) !== value
											? physicalToLogical( value )
											: undefined,
								};
								if ( null == newUnitone.alignItems ) {
									if ( null == defaultValue ) {
										delete newUnitone.alignItems;
									} else {
										newUnitone.alignItems = '';
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
				} ) }
			</div>
		</fieldset>
	);
}

export function saveAlignItemsProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.alignItems' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.alignItems ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-align-items:${ attributes.unitone?.alignItems }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		`-align-items:${ attributes.unitone?.alignItems }`
	);

	return extraProps;
}

export function editAlignItemsProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.alignItems' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveAlignItemsProp( props, settings, attributes );
	};
	return settings;
}
