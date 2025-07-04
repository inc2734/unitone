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

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject, isNumber, isString } from '../utils';
import { allSides, verticalSides, horizontalSides } from '../icons';

export function hasGapValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	return defaultValue !== unitone?.gap && undefined !== unitone?.gap;
}

export function resetGapFilter() {
	return {
		gap: undefined,
	};
}

export function resetGap( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetGapFilter() )
		),
	} );
}

export function isGapSupportDisabled( { name, className } ) {
	if ( ! hasBlockSupport( name, 'unitone.gap' ) ) {
		return true;
	}

	const blockSupport = getBlockSupport( name, 'unitone.gap' );
	if ( !! blockSupport ) {
		return false;
	}

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
	__withCode = false,
} ) {
	const defaultLabel = __( 'Gap', 'unitone' );
	const defaultCode = <code>gap</code>;

	if ( ! __withCode ) {
		return __unstableUnitoneSupports?.gap?.label || defaultLabel;
	}

	return (
		<>
			{ __unstableUnitoneSupports?.gap?.label || defaultLabel }
			&nbsp;:&nbsp;
			{ __unstableUnitoneSupports?.gap?.code || defaultCode }
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
		2 === values.length && values.every( ( v ) => v === values[ 0 ] );

	const compactedAttribute = allEqual ? values[ 0 ] : attribute;

	if (
		! isNumber( compactedAttribute ) &&
		! isString( compactedAttribute ) &&
		null != defaultValue
	) {
		if ( compactedAttribute?.column === defaultValue?.column ) {
			compactedAttribute.column = undefined;
		}

		if ( compactedAttribute?.row === defaultValue?.row ) {
			compactedAttribute.row = undefined;
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
				column: attribute,
				row: attribute,
		  }
		: {
				column: attribute?.column,
				row: attribute?.row,
		  };
}

export function GapEdit( {
	name,
	label,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;
	const isVertical = getBlockSupport( name, 'unitone.gap.vertical' ) || false;

	const conpactedValue = compacting( unitone?.gap, defaultValue );
	const conpactedDefaultValue = compacting( defaultValue );

	const isMixed =
		( null != unitone?.gap &&
			! isNumber( conpactedValue ) &&
			! isString( conpactedValue ) ) ||
		( null != defaultValue &&
			! isNumber( conpactedDefaultValue ) &&
			! isString( conpactedDefaultValue ) );

	const [ isLinked, setIsLinked ] = useState( ! isMixed );

	const onChangeGap = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const newUnitone = {
			...unitone,
			gap:
				newValue ||
				( null ==
				( defaultValue?.column ?? defaultValue?.row ?? defaultValue )
					? undefined
					: '' ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeGapSide = ( side, newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactedDefault = compacting( defaultValue );
		const expandedDefault = expand( compactedDefault );
		const newGap = expand( unitone?.gap );

		newGap[ side ] = newValue || expandedDefault?.[ side ];

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				gap: compacting( newGap, defaultValue ),
			} ),
		} );
	};

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
					value={ unitone?.gap ?? defaultValue }
					onChange={ onChangeGap }
				/>
			) : (
				<>
					{ isLinked ? (
						<Flex align="center">
							<FlexItem>
								<Icon icon={ allSides } size={ 16 } />
							</FlexItem>

							<FlexBlock>
								<SpacingSizeControl
									value={
										! isMixed &&
										( unitone?.gap ?? defaultValue )
									}
									isMixed={ isMixed }
									onChange={ onChangeGap }
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
							<Flex align="center">
								<FlexItem>
									{ ! isVertical ? (
										<Icon
											icon={ verticalSides }
											size={ 16 }
										/>
									) : (
										<Icon
											icon={ horizontalSides }
											size={ 16 }
										/>
									) }
								</FlexItem>

								<FlexBlock>
									<SpacingSizeControl
										value={
											unitone?.gap?.row ??
											unitone?.gap ??
											defaultValue?.row ??
											defaultValue
										}
										onChange={ ( newValue ) =>
											onChangeGapSide( 'row', newValue )
										}
									/>
								</FlexBlock>
							</Flex>

							<Flex align="center">
								<FlexItem>
									{ ! isVertical ? (
										<Icon
											icon={ horizontalSides }
											size={ 16 }
										/>
									) : (
										<Icon
											icon={ verticalSides }
											size={ 16 }
										/>
									) }
								</FlexItem>

								<FlexBlock>
									<SpacingSizeControl
										value={
											unitone?.gap?.column ??
											unitone?.gap ??
											defaultValue?.column ??
											defaultValue
										}
										onChange={ ( newValue ) =>
											onChangeGapSide(
												'column',
												newValue
											)
										}
									/>
								</FlexBlock>
							</Flex>
						</div>
					) }
				</>
			) }
		</div>
	);
}

export function withGapBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( ! hasBlockSupport( name, 'unitone.gap' ) ) {
		return settings;
	}

	const newGap = compacting( attributes.unitone?.gap );

	if ( null == newGap ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-layout': clsx(
				settings.wrapperProps?.[ 'data-unitone-layout' ],
				{
					[ `-gap:${ newGap }` ]:
						isNumber( newGap ) || isString( newGap ),
					[ `-column-gap:${ newGap?.column }` ]:
						null != newGap?.column,
					[ `-row-gap:${ newGap?.row }` ]: null != newGap?.row,
				}
			),
		},
	};
}
