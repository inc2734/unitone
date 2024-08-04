import {
	BaseControl,
	DropdownMenu,
	Flex,
	FlexBlock,
	FlexItem,
	SelectControl,
	RangeControl,
} from '@wordpress/components';

import { memo, useState, useMemo, useEffect } from '@wordpress/element';
import { desktop, tablet, mobile } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { isNumber, useDeviceType } from './utils';

function Controls( { isMixed, value, onChange, marks, options } ) {
	return (
		<>
			<RangeControl
				className="spacing-sizes-control__range-control"
				value={ isMixed ? -2 : parseInt( value ) }
				allowReset
				resetFallbackValue={ undefined }
				onChange={ onChange }
				withInputField={ false }
				aria-valuenow={ value }
				aria-valuetext={ value }
				min={ marks[ 0 ]?.value || marks[ 1 ]?.value }
				max={ marks[ marks.length - 1 ]?.value }
				marks={ marks }
				renderTooltipContent={ ( _value ) =>
					options.filter(
						( option ) =>
							parseInt( option.value ) === parseInt( _value )
					)?.[ 0 ]?.label ?? _value
				}
				hideLabelFromVision
				__nextHasNoMarginBottom
			/>

			<div style={ { marginTop: '5px' } }>
				<SelectControl
					value={ value || '' }
					options={ options }
					onChange={ onChange }
				/>
			</div>
		</>
	);
}

function SpacingSizeControlPure( {
	options,
	onChange,
	label,
	value,
	isMixed = false,
} ) {
	value = isMixed ? 'mixed' : value;
	const defaultOptions = [
		{
			label: '',
			value: undefined,
		},
		{
			label: 'XS',
			value: -2,
		},
		{
			label: 'S',
			value: -1,
		},
		{
			label: __( 'None', 'unitone' ),
			value: 0,
		},
		{
			label: 'M',
			value: 1,
		},
		{
			label: 'L',
			value: 2,
		},
		{
			label: '2XL',
			value: 3,
		},
		{
			label: '3XL',
			value: 4,
		},
		{
			label: '4XL',
			value: 5,
		},
		{
			label: '5XL',
			value: 6,
		},
		{
			label: '6XL',
			value: 7,
		},
	];

	options = ! options ? defaultOptions : options;

	if ( isMixed ) {
		options.unshift( {
			label: __( 'Mixed' ),
			value: 'mixed',
			disabled: true,
		} );
	}

	const marks = options
		.map( ( newValue ) => {
			return isNumber( newValue?.value )
				? {
						value: parseInt( newValue?.value ),
						label: undefined,
				  }
				: undefined;
		} )
		.filter( Boolean );

	return (
		<>
			{ !! label ? (
				<BaseControl
					id={ label }
					label={ label }
					className="spacing-sizes-control"
				>
					<Controls
						{ ...{ isMixed, value, onChange, marks, options } }
					/>
				</BaseControl>
			) : (
				<div className="spacing-sizes-control">
					<Controls
						{ ...{ isMixed, value, onChange, marks, options } }
					/>
				</div>
			) }
		</>
	);
}

export const SpacingSizeControl = memo( SpacingSizeControlPure );

export function ResponsiveSettingsContainer( {
	label,
	desktopControls,
	tabletControls,
	mobileControls,
} ) {
	const deviceType = useDeviceType();

	const [ breakpoint, setBreakpoint ] = useState( deviceType );

	useEffect( () => {
		setBreakpoint( deviceType );
	}, [ deviceType ] );

	const icon = useMemo( () => {
		if ( 'desktop' === breakpoint ) {
			return desktop;
		} else if ( 'tablet' === breakpoint ) {
			return tablet;
		} else if ( 'mobile' === breakpoint ) {
			return mobile;
		}
		return desktop;
	}, [ breakpoint ] );

	return (
		<>
			<Flex className="unitone-responsive-settings-container" gap={ 0 }>
				<FlexBlock>
					<BaseControl label={ label } id={ label } />
				</FlexBlock>
				<FlexItem>
					<DropdownMenu
						icon={ icon }
						controls={ [
							{
								icon: desktop,
								onClick: () => setBreakpoint( 'desktop' ),
								title: __( 'Desktop', 'unitone' ),
							},
							{
								icon: tablet,
								onClick: () => setBreakpoint( 'tablet' ),
								title: __( 'Tablet / Mobile', 'unitone' ),
							},
							{
								icon: mobile,
								onClick: () => setBreakpoint( 'mobile' ),
								title: __( 'Mobile', 'unitone' ),
							},
						] }
						label={ __(
							'Switch to settings based on device size',
							'unitone'
						) }
					/>
				</FlexItem>
			</Flex>

			<div style={ { marginTop: '2px' } }>
				{ 'desktop' === breakpoint && desktopControls() }
				{ 'tablet' === breakpoint && tabletControls() }
				{ 'mobile' === breakpoint && mobileControls() }
			</div>
		</>
	);
}
