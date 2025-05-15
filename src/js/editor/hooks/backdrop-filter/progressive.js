import {
	getBlockSupport,
	hasBlockSupport,
	store as blocksStore,
} from '@wordpress/blocks';

import {
	BaseControl,
	Flex,
	FlexBlock,
	FlexItem,
	AnglePickerControl,
	RangeControl,
} from '@wordpress/components';

import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { cleanEmptyObject } from '../utils';

export function hasProgressiveValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.backdropFilter?.progressive;

	return (
		defaultValue !== unitone?.backdropFilter?.progressive &&
		undefined !== unitone?.backdropFilter?.progressive
	);
}

function resetProgressiveFilter( attributes ) {
	if ( null != attributes?.unitone?.backdropFilter?.progressive?.angle ) {
		attributes.unitone.backdropFilter.progressive.angle = undefined;
	}

	if ( null != attributes?.unitone?.backdropFilter?.progressive?.start ) {
		attributes.unitone.backdropFilter.progressive.start = undefined;
	}

	return attributes;
}

export function resetProgressive( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			resetProgressiveFilter( { unitone } )?.unitone
		),
	} );
}

export function getProgressiveEditLabel( {
	attributes: { __unstableUnitoneSupports },
} ) {
	const defaultLabel = __( 'Progressive', 'unitone' );

	return (
		__unstableUnitoneSupports?.backdropFilter?.progressive?.label ||
		defaultLabel
	);
}

export function useIsProgressiveDisabled( { name } = {} ) {
	return (
		! hasBlockSupport( name, 'unitone.backdropFilter.progressive' ) &&
		true !== getBlockSupport( name, 'unitone.backdropFilter' )
	);
}

export function ProgressiveEdit( {
	label,
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.backdropFilter?.progressive;
	}, [] );

	return (
		<div className="unitone-backdrop-filter-progressive-control">
			<BaseControl __nextHasNoMarginBottom>
				<BaseControl.VisualLabel>{ label }</BaseControl.VisualLabel>

				<Flex>
					<FlexBlock>
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							hideLabelFromVision
							label={ __( 'Start position', 'unitone' ) }
							value={ parseInt(
								unitone?.backdropFilter?.progressive?.start ??
									defaultValue?.start ??
									0
							) }
							onChange={ ( newAttribute ) => {
								const newUnitone = {
									...unitone,
									backdropFilter: {
										...unitone?.backdropFilter,
										progressive: {
											...unitone?.backdropFilter
												?.progressive,
											start: newAttribute,
										},
									},
								};

								setAttributes( {
									unitone: cleanEmptyObject( newUnitone ),
								} );
							} }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							withInputField={ false }
						/>
					</FlexBlock>
					<FlexItem>
						<AnglePickerControl
							value={
								unitone?.backdropFilter?.progressive?.angle ??
								defaultValue?.angle ??
								180
							}
							onChange={ ( newAttribute ) => {
								const newUnitone = {
									...unitone,
									backdropFilter: {
										...unitone?.backdropFilter,
										progressive: {
											...unitone?.backdropFilter
												?.progressive,
											angle: newAttribute,
										},
									},
								};

								setAttributes( {
									unitone: cleanEmptyObject( newUnitone ),
								} );
							} }
						/>
					</FlexItem>
				</Flex>
			</BaseControl>
		</div>
	);
}
