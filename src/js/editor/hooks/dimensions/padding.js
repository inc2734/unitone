/*
 * @see https://github.com/WordPress/gutenberg/blob/42a5611fa7649186190fd4411425f6e5e9deb01a/packages/block-editor/src/hooks/padding.js
 */

import clsx from 'clsx';

import {
	hasBlockSupport,
	getBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	BaseControl,
	Button,
	Icon,
	Tooltip,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import {
	allSides,
	verticalSides,
	horizontalSides,
	topSides,
	rightSides,
	bottomSides,
	leftSides,
} from '../icons';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject, isNumber, isString } from '../utils';

export function hasPaddingValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.padding;

	return defaultValue !== unitone?.padding && undefined !== unitone?.padding;
}

export function resetPaddingFilter() {
	return {
		padding: undefined,
	};
}

export function resetPadding( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetPaddingFilter() )
		),
	} );
}

export function isPaddingSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.padding' );
}

export function getPaddingEditLabel( {
	attributes: { __unstableUnitoneSupports },
	__withCode = false,
} ) {
	const defaultLabel = __( 'Padding', 'unitone' );
	const defaultCode = <code>padding</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.padding?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.padding?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.padding?.code || defaultCode }
		</>
	);
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

function compacting( attribute, defaultValue = undefined ) {
	if ( 0 === attribute ) {
		return 0;
	}

	if ( null == attribute ) {
		return undefined;
	}

	const values = Object.values( attribute );
	const allEqual =
		4 === values.length && values.every( ( v ) => v === values[ 0 ] );

	const compactedAttribute = allEqual ? values[ 0 ] : attribute;

	if (
		! isNumber( compactedAttribute ) &&
		! isString( compactedAttribute ) &&
		null != defaultValue
	) {
		if ( compactedAttribute?.top === defaultValue?.top ) {
			compactedAttribute.top = undefined;
		}

		if ( compactedAttribute?.right === defaultValue?.right ) {
			compactedAttribute.right = undefined;
		}

		if ( compactedAttribute?.bottom === defaultValue?.bottom ) {
			compactedAttribute.bottom = undefined;
		}

		if ( compactedAttribute?.left === defaultValue?.left ) {
			compactedAttribute.left = undefined;
		}
	}

	if (
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( defaultValue ) ||
		JSON.stringify( compactedAttribute ) ===
			JSON.stringify( compacting( defaultValue ) )
	) {
		return undefined;
	}

	return compactedAttribute;
}

function expand( attribute ) {
	return isNumber( attribute ) || isString( attribute )
		? {
				top: attribute,
				right: attribute,
				bottom: attribute,
				left: attribute,
		  }
		: {
				top: attribute?.top,
				right: attribute?.right,
				bottom: attribute?.bottom,
				left: attribute?.left,
		  };
}

export function PaddingEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.padding;
	}, [] );

	const split = getBlockSupport( name, 'unitone.padding.split' ) || false;
	const isAllSides = true === split;
	const applyTop = Array.isArray( split ) && split?.includes( 'top' );
	const applyRight = Array.isArray( split ) && split?.includes( 'right' );
	const applyBottom = Array.isArray( split ) && split?.includes( 'bottom' );
	const applyLeft = Array.isArray( split ) && split?.includes( 'left' );
	const isVerticalSides =
		applyTop && applyBottom && ! applyRight && ! applyLeft;
	const isHorizontalSides =
		! applyTop && ! applyBottom && applyRight && applyLeft;

	const conpactedValue = compacting( unitone?.padding, defaultValue );
	const conpactedDefaultValue = compacting( defaultValue );

	const isMixed =
		( null != unitone?.padding &&
			! isNumber( conpactedValue ) &&
			! isString( conpactedValue ) ) ||
		( null != defaultValue &&
			! isNumber( conpactedDefaultValue ) &&
			! isString( conpactedDefaultValue ) );

	const [ isLinked, setIsLinked ] = useState( ! isMixed );

	const onChangePadding = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const newUnitone = {
			...unitone,
			padding: newValue || ( null != defaultValue ? undefined : '' ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangePaddingSide = ( side, newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactedDefault = compacting( defaultValue );
		const expandedDefault = expand( compactedDefault );
		const newPadding = expand( unitone?.padding );

		newPadding[ side ] = newValue || expandedDefault?.[ side ];

		// If the side you use is restricted, remove unnecessary values.
		if ( ! isAllSides ) {
			if ( ! applyTop ) {
				newPadding.top = undefined;
			}
			if ( ! applyRight ) {
				newPadding.right = undefined;
			}
			if ( ! applyBottom ) {
				newPadding.bottom = undefined;
			}
			if ( ! applyLeft ) {
				newPadding.left = undefined;
			}
		}

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				padding: compacting( newPadding, defaultValue ),
			} ),
		} );
	};

	let linkedIcon = allSides;
	if ( isVerticalSides ) {
		linkedIcon = verticalSides;
	} else if ( isHorizontalSides ) {
		linkedIcon = horizontalSides;
	}

	return (
		<div className="spacing-sizes-control">
			<Flex>
				<FlexBlock>
					<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>
				</FlexBlock>

				{ !! split && (
					<FlexItem>
						<LinkedButton
							isLinked={ isLinked }
							onClick={ () => setIsLinked( ! isLinked ) }
						/>
					</FlexItem>
				) }
			</Flex>

			{ ! split ? (
				<SpacingSizeControl
					value={ unitone?.padding ?? defaultValue }
					onChange={ onChangePadding }
				/>
			) : (
				<>
					{ isLinked ? (
						<Flex align="center">
							<FlexItem>
								<Icon icon={ linkedIcon } size={ 16 } />
							</FlexItem>

							<FlexBlock>
								<SpacingSizeControl
									value={
										! isMixed &&
										( unitone?.padding ?? defaultValue )
									}
									isMixed={ isMixed }
									onChange={ onChangePadding }
								/>
							</FlexBlock>
						</Flex>
					) : (
						<div
							style={ {
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '8px',
							} }
						>
							{ ( isAllSides || applyTop ) && (
								<Flex align="center">
									<FlexItem>
										<Icon icon={ topSides } size={ 16 } />
									</FlexItem>

									<FlexBlock>
										<SpacingSizeControl
											value={
												unitone?.padding?.top ??
												unitone?.padding ??
												defaultValue?.top ??
												defaultValue
											}
											onChange={ ( newValue ) =>
												onChangePaddingSide(
													'top',
													newValue
												)
											}
										/>
									</FlexBlock>
								</Flex>
							) }

							{ ( isAllSides || applyRight ) && (
								<Flex align="center">
									<FlexItem>
										<Icon icon={ rightSides } size={ 16 } />
									</FlexItem>

									<FlexBlock>
										<SpacingSizeControl
											value={
												unitone?.padding?.right ??
												unitone?.padding ??
												defaultValue?.right ??
												defaultValue
											}
											onChange={ ( newValue ) =>
												onChangePaddingSide(
													'right',
													newValue
												)
											}
										/>
									</FlexBlock>
								</Flex>
							) }

							{ ( isAllSides || applyBottom ) && (
								<Flex align="center">
									<FlexItem>
										<Icon
											icon={ bottomSides }
											size={ 16 }
										/>
									</FlexItem>

									<FlexBlock>
										<SpacingSizeControl
											value={
												unitone?.padding?.bottom ??
												unitone?.padding ??
												defaultValue?.bottom ??
												defaultValue
											}
											onChange={ ( newValue ) =>
												onChangePaddingSide(
													'bottom',
													newValue
												)
											}
										/>
									</FlexBlock>
								</Flex>
							) }

							{ ( isAllSides || applyLeft ) && (
								<Flex align="center">
									<FlexItem>
										<Icon icon={ leftSides } size={ 16 } />
									</FlexItem>

									<FlexBlock>
										<SpacingSizeControl
											value={
												unitone?.padding?.left ??
												unitone?.padding ??
												defaultValue?.left ??
												defaultValue
											}
											onChange={ ( newValue ) =>
												onChangePaddingSide(
													'left',
													newValue
												)
											}
										/>
									</FlexBlock>
								</Flex>
							) }
						</div>
					) }
				</>
			) }
		</div>
	);
}

export function withPaddingBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.padding' ) ) {
		return settings;
	}

	const newPadding = compacting( attributes.unitone?.padding );

	if ( null == newPadding ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-padding:${ newPadding }` ]:
						isNumber( newPadding ) || isString( newPadding ),
					[ `-padding-top:${ newPadding?.top }` ]:
						null != newPadding?.top,
					[ `-padding-right:${ newPadding?.right }` ]:
						null != newPadding?.right,
					[ `-padding-bottom:${ newPadding?.bottom }` ]:
						null != newPadding?.bottom,
					[ `-padding-left:${ newPadding?.left }` ]:
						null != newPadding?.left,
				}
			),
		},
	};
}
