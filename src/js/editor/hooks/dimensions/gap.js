import clsx from 'clsx';

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
import { useState, useMemo } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject, isString } from '../utils';

export function hasGapValue( { name, unitone } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.gap;

	return defaultValue !== unitone?.gap && undefined !== unitone?.gap;
}

export function resetGapFilter( attributes ) {
	return {
		...attributes,
		unitone: {
			...attributes?.unitone,
			gap: undefined,
		},
	};
}

export function resetGap( { unitone, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject( resetGapFilter( { unitone } )?.unitone ),
	} );
}

export function useIsGapDisabled( { name, className } ) {
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

export function getGapEditLabel( { __unstableUnitoneSupports } ) {
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

function compacting( attribute, defaultValue = undefined ) {
	const compactedAttribute =
		! isString( attribute ) && attribute?.column === attribute?.row
			? attribute?.column
			: attribute;

	if ( ! isString( compactedAttribute ) && null != defaultValue ) {
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
	return isString( attribute )
		? {
				column: attribute,
				row: attribute,
		  }
		: {
				column: attribute?.column,
				row: attribute?.row,
		  };
}

export function GapEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;
	const isVertical = getBlockSupport( name, 'unitone.gap.vertical' ) || false;

	const isMixed =
		null != unitone?.gap
			? unitone?.gap?.column !== unitone?.gap?.row
			: defaultValue?.column !== defaultValue?.row;

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

	const onChangeColumnGap = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactDefault = compacting( defaultValue );
		const fullDefault = expand( compactDefault );
		const preNewGap = expand( unitone?.gap );

		const newGap = {
			column:
				newValue ||
				( null == fullDefault?.column ||
				newValue === fullDefault?.column
					? undefined
					: '' ),
			row: preNewGap?.row ?? fullDefault?.row,
		};

		// current が undefined で default が数値のときは row に default が入る
		// 分割値の場合、PHP 側で default.row は参照するけど、default は参照しないため
		if ( null == unitone?.gap && isString( defaultValue ) ) {
			newGap.row = defaultValue;
		}

		// current.column が数値で current.row がなく、
		if ( null != unitone?.gap?.column && null == unitone?.gap?.row ) {
			if ( isString( defaultValue?.row ) ) {
				// default.row が数値のときは row に default.row が入る
				newGap.row = defaultValue?.row;
			} else if ( isString( defaultValue ) ) {
				// default が数値のときは row に '' が入る
				newGap.row = '';
			}
		}

		const newUnitone = {
			...unitone,
			gap: compacting( newGap, defaultValue ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
		} );
	};

	const onChangeRowGap = ( newValue ) => {
		if ( null != newValue ) {
			// RangeControl returns Int, SelectControl returns String.
			// So cast Int all values.
			newValue = String( newValue );
		}

		const compactDefault = compacting( defaultValue );
		const fullDefault = expand( compactDefault );
		const preNewGap = expand( unitone?.gap );

		const newGap = {
			row:
				newValue ||
				( null == fullDefault?.row || newValue === fullDefault?.row
					? undefined
					: '' ),
			column: preNewGap?.column ?? fullDefault?.column,
		};

		// current が undefined で default が数値のときは column に default が入る
		// 分割値の場合、PHP 側で default.column は参照するけど、default は参照しないため
		if ( null == unitone?.gap && isString( defaultValue ) ) {
			newGap.column = defaultValue;
		}

		// current.row が数値で current.column がなく、
		if ( null != unitone?.gap?.row && null == unitone?.gap?.column ) {
			if ( isString( defaultValue?.column ) ) {
				// default.column が数値のときは column に default.column が入る
				newGap.column = defaultValue?.column;
			} else if ( isString( defaultValue ) ) {
				// default が数値のときは column に '' が入る
				newGap.column = '';
			}
		}

		const newUnitone = {
			...unitone,
			gap: compacting( newGap, defaultValue ),
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
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
						<Flex align="start">
							<FlexItem style={ { marginTop: '11px' } }>
								<IconAll />
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
						<>
							<Flex align="start">
								<FlexItem style={ { marginTop: '11px' } }>
									{ ! isVertical ? (
										<IconHorizontal />
									) : (
										<IconVertical />
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
										onChange={ onChangeColumnGap }
									/>
								</FlexBlock>
							</Flex>

							<Flex align="start">
								<FlexItem style={ { marginTop: '11px' } }>
									{ ! isVertical ? (
										<IconVertical />
									) : (
										<IconHorizontal />
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

export function saveGapProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.gap' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.gap ) {
		return extraProps;
	}

	// Deprecation.
	if ( !! extraProps?.[ 'data-layout' ] ) {
		extraProps[ 'data-layout' ] = clsx(
			extraProps[ 'data-layout' ],
			`-gap:${ attributes.unitone?.gap }`
		);
		return extraProps;
	}

	extraProps[ 'data-unitone-layout' ] = clsx(
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

export function useGapBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.gap;
		},
		[ name ]
	);

	const newGapProp = useMemo( () => {
		return saveGapProp( wrapperProps, name, {
			unitone: {
				gap: compacting( attributes.unitone?.gap ?? defaultValue ),
			},
		} );
	}, [
		JSON.stringify( attributes?.unitone ),
		attributes?.__unstableUnitoneBlockOutline,
	] );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...newGapProp,
		},
	};
}
