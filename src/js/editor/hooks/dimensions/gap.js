import classnames from 'classnames/dedupe';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	BaseControl,
	Button,
	Tooltip,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { memo, useCallback, useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject, isNumber, isString } from '../utils';

export function hasGapValue( { name, attributes } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	return null != defaultValue
		? attributes?.unitone?.gap !== defaultValue
		: attributes?.unitone?.gap !== undefined;
}

export function resetGap( { name, attributes, setAttributes } ) {
	delete attributes?.unitone?.gap;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	if ( null != defaultValue ) {
		newUnitone.gap = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsGapDisabled( { name: blockName, attributes } = {} ) {
	if ( ! hasBlockSupport( blockName, 'unitone.gap' ) ) {
		return true;
	}

	const blockSupport = getBlockSupport( blockName, 'unitone.gap' );
	if ( !! blockSupport ) {
		return false;
	}

	const className = attributes?.className;
	if ( !! className ) {
		return ! className.split( ' ' ).some( ( needle ) => {
			needle = needle.replace( 'is-style-', '' );
			return blockSupport.styles?.[ needle ];
		} );
	}

	return true;
}

export function getGapEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	return __unstableUnitoneSupports?.gap?.label || __( 'Gap', 'unitone' );
}

function LinkedButton( { isLinked, ...props } ) {
	const label = isLinked ? __( 'Unlink sides' ) : __( 'Link sides' );

	return (
		<Tooltip text={ label }>
			<Button
				{ ...props }
				className="component-box-control__linked-button"
				size="small"
				icon={ isLinked ? link : linkOff }
				iconSize={ 24 }
				aria-label={ label }
			/>
		</Tooltip>
	);
}

function IconAll() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z"
				fill="currentColor"
			/>

			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function IconVertical() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z"
				fill="currentColor"
			/>

			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z"
				fill="currentColor"
				opacity={ 0.3 }
			/>
		</svg>
	);
}

function IconHorizontal() {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 2H13V0H3V2ZM3 16H13V14H3V16Z"
				fill="currentColor"
				opacity={ 0.3 }
			/>

			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 3V13H2L2 3H0ZM14 3V13H16V3H14Z"
				fill="currentColor"
			/>
		</svg>
	);
}

function GapEditPure( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;
	const isMixed = unitone?.gap?.column !== unitone?.gap?.row;

	const [ isLinked, setIsLinked ] = useState( ! isMixed );

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	const onChangeGap = useCallback(
		( newValue ) => {
			if ( null == newValue ) {
				newValue = defaultValue;
			}

			if ( null != newValue ) {
				// RangeControl returns Int, SelectControl returns String.
				// So cast Int all values.
				newValue = String( newValue );
			}

			const newUnitone = cleanEmptyObject( {
				...unitone,
				gap: newValue,
			} );

			setAttributes( {
				unitone: newUnitone,
			} );
		},
		[ defaultValue ]
	);

	const onChangeColumnGap = useCallback(
		( newValue ) => {
			if ( null == newValue ) {
				newValue = defaultValue?.column || defaultValue;
			}

			if ( null != newValue ) {
				// RangeControl returns Int, SelectControl returns String.
				// So cast Int all values.
				newValue = String( newValue );
			}

			const newUnitone = cleanEmptyObject(
				newValue === String( unitone?.gap?.row )
					? {
							...unitone,
							gap: newValue,
					  }
					: {
							...unitone,
							gap: {
								column: newValue,
								row:
									unitone?.gap?.row ||
									( ( isNumber( unitone?.gap ) ||
										isString( unitone?.gap ) ) &&
										unitone?.gap ) ||
									undefined,
							},
					  }
			);

			setAttributes( {
				unitone: newUnitone,
			} );
		},
		[ defaultValue ]
	);

	const onChangeRowGap = useCallback(
		( newValue ) => {
			if ( null == newValue ) {
				newValue = defaultValue?.row || defaultValue;
			}

			if ( null != newValue ) {
				// RangeControl returns Int, SelectControl returns String.
				// So cast Int all values.
				newValue = String( newValue );
			}

			const newUnitone = cleanEmptyObject(
				newValue === String( unitone?.gap?.column )
					? {
							...unitone,
							gap: newValue,
					  }
					: {
							...unitone,
							gap: {
								row: newValue,
								column:
									unitone?.gap?.column ||
									( ( isNumber( unitone?.gap ) ||
										isString( unitone?.gap ) ) &&
										unitone?.gap ) ||
									undefined,
							},
					  }
			);

			setAttributes( {
				unitone: newUnitone,
			} );
		},
		[ defaultValue ]
	);

	return (
		<div className="spacing-sizes-control">
			<Flex>
				<FlexBlock>
					<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
				</FlexBlock>

				{ splitOnAxis && (
					<FlexItem>
						<LinkedButton
							isLinked={ isLinked }
							onClick={ () => setIsLinked( ! isLinked ) }
						/>
					</FlexItem>
				) }
			</Flex>

			{ ! splitOnAxis ? (
				<SpacingSizeControl
					value={ unitone?.gap }
					onChange={ onChangeGap }
				/>
			) : (
				<>
					{ isLinked ? (
						<Flex align="start">
							<FlexItem style={ { marginTop: '11px' } }>
								<IconAll />
							</FlexItem>

							<FlexBlock>
								<SpacingSizeControl
									value={ ! isMixed && unitone?.gap }
									isMixed={ isMixed }
									onChange={ onChangeGap }
								/>
							</FlexBlock>
						</Flex>
					) : (
						<>
							<Flex align="start">
								<FlexItem style={ { marginTop: '11px' } }>
									<IconHorizontal />
								</FlexItem>

								<FlexBlock>
									<SpacingSizeControl
										value={
											unitone?.gap?.column || unitone?.gap
										}
										onChange={ onChangeColumnGap }
									/>
								</FlexBlock>
							</Flex>

							<Flex align="start">
								<FlexItem style={ { marginTop: '11px' } }>
									<IconVertical />
								</FlexItem>

								<FlexBlock>
									<SpacingSizeControl
										value={
											unitone?.gap?.row || unitone?.gap
										}
										onChange={ onChangeRowGap }
									/>
								</FlexBlock>
							</Flex>
						</>
					) }
				</>
			) }
		</div>
	);
}

export const GapEdit = memo( GapEditPure );

export function saveGapProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gap' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.gap ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = classnames(
			extraProps[ 'data-layout' ],
			`-gap:${ attributes.unitone?.gap }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = classnames(
		extraProps[ 'data-unitone-layout' ],
		{
			[ `-gap:${ attributes.unitone?.gap }` ]:
				null == attributes.unitone?.gap?.column &&
				null == attributes.unitone?.gap?.row,
			[ `-column-gap:${ attributes.unitone?.gap?.column }` ]:
				null != attributes.unitone?.gap?.column,
			[ `-row-gap:${ attributes.unitone?.gap?.row }` ]:
				null != attributes.unitone?.gap?.row,
		}
	);

	return extraProps;
}

export function editGapProp( settings ) {
	if ( ! hasBlockSupport( settings, 'unitone.gap' ) ) {
		return settings;
	}

	const existingGetEditWrapperProps = settings.getEditWrapperProps;
	settings.getEditWrapperProps = ( attributes ) => {
		let props = {};
		if ( existingGetEditWrapperProps ) {
			props = existingGetEditWrapperProps( attributes );
		}
		return saveGapProp( props, settings, attributes );
	};
	return settings;
}
