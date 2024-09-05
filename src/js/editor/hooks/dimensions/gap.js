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
import { useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { SpacingSizeControl } from '../components';
import { cleanEmptyObject, isNumber, isString } from '../utils';

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

export function GapEdit( { name, label, unitone, setAttributes } ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.gap;
	}, [] );

	const splitOnAxis =
		getBlockSupport( name, 'unitone.gap.splitOnAxis' ) || false;

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
			gap: newValue || undefined,
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

		const newUnitone =
			newValue === String( unitone?.gap?.row )
				? {
						...unitone,
						gap: newValue,
				  }
				: {
						...unitone,
						gap: {
							column: newValue || undefined,
							row:
								unitone?.gap?.row ||
								( ( isNumber( unitone?.gap ) ||
									isString( unitone?.gap ) ) &&
									unitone?.gap ) ||
								undefined,
						},
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

		const newUnitone =
			newValue === String( unitone?.gap?.column )
				? {
						...unitone,
						gap: newValue || undefined,
				  }
				: {
						...unitone,
						gap: {
							row: newValue || undefined,
							column:
								unitone?.gap?.column ||
								( ( isNumber( unitone?.gap ) ||
									isString( unitone?.gap ) ) &&
									unitone?.gap ) ||
								undefined,
						},
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
									<IconHorizontal />
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
									<IconVertical />
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
	const defaultValue = wp.data.select( blocksStore ).getBlockType( blockType )
		?.attributes?.unitone?.default?.gap;

	if ( ! hasBlockSupport( blockType, 'unitone.gap' ) ) {
		return extraProps;
	}

	if ( null == attributes?.unitone?.gap ) {
		if ( null == defaultValue ) {
			return extraProps;
		}

		attributes = {
			...attributes,
			unitone: {
				...attributes?.unitone,
				gap: {
					...attributes?.unitone?.gap,
					...defaultValue,
				},
			},
		};
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

export function useGapBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveGapProp( wrapperProps, name, attributes ),
		},
	};
}
