import classnames from 'classnames/dedupe';

import { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { alignBottom, alignCenter, alignTop } from './icons';
import { cleanEmptyObject } from './utils';
import { physicalToLogical, logicalToPhysical } from '../../helper';

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
];

export function useIsAlignItemsDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.alignItems' );
}

export function AlignItemsToolbar( props ) {
	const {
		attributes: { unitone },
		setAttributes,
	} = props;

	return (
		<BlockVerticalAlignmentToolbar
			value={ logicalToPhysical( unitone?.alignItems, 'vertical' ) }
			onChange={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					alignItems: physicalToLogical( newAttribute ),
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
				} );
			} }
		/>
	);
}

export function AlignItemsEdit( props ) {
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
						<code>align-items</code>
					</>
				}
			</legend>
			<div>
				{ alignItemsOptions.map( ( { value, icon, label } ) => {
					return (
						<Button
							key={ value }
							label={ label }
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

								setAttributes( {
									unitone: cleanEmptyObject( newUnitone ),
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
