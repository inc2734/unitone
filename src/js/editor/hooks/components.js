import {
	BaseControl,
	DropdownMenu,
	Flex,
	FlexBlock,
	FlexItem,
	SelectControl,
} from '@wordpress/components';

import { useState, useMemo, useEffect } from '@wordpress/element';
import { desktop, tablet, mobile } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { useDeviceType } from './utils';

function Controls( { value, onChange, options } ) {
	return (
		<SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			value={ value ?? '' }
			onChange={ onChange }
			options={ options }
		/>
	);
}

export function SpacingSizeControl( {
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
			value: '',
		},
		{
			label: '----------',
			value: undefined,
			disabled: true,
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
			label: 'XL',
			value: 3,
		},
		{
			label: '2XL',
			value: 4,
		},
		{
			label: '3XL',
			value: 5,
		},
		{
			label: '4XL',
			value: 6,
		},
		{
			label: '5XL',
			value: 7,
		},
		{
			label: '----------',
			value: undefined,
			disabled: true,
		},
		{
			label: `M - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '1s',
		},
		{
			label: `L - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '2s',
		},
		{
			label: `XL - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '3s',
		},
		{
			label: `2XL - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '4s',
		},
		{
			label: `3XL - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '5s',
		},
		{
			label: `4XL - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '6s',
		},
		{
			label: `5XL - S ${ __( '(Mobile: S)', 'unitone' ) }`,
			value: '7s',
		},
		{
			label: '----------',
			value: undefined,
			disabled: true,
		},
		{
			label: `L - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '2m',
		},
		{
			label: `XL - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '3m',
		},
		{
			label: `2XL - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '4m',
		},
		{
			label: `3XL - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '5m',
		},
		{
			label: `4XL - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '6m',
		},
		{
			label: `5XL - M ${ __( '(Mobile: M)', 'unitone' ) }`,
			value: '7m',
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

	return (
		<>
			{ !! label ? (
				<BaseControl
					__nextHasNoMarginBottom
					id={ label }
					label={ label }
					className="spacing-sizes-control"
				>
					<Controls { ...{ value, onChange, options } } />
				</BaseControl>
			) : (
				<div className="spacing-sizes-control">
					<Controls { ...{ value, onChange, options } } />
				</div>
			) }
		</>
	);
}

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
			<div className="unitone-responsive-settings-container">
				<Flex gap={ 0 }>
					<FlexBlock>
						<BaseControl
							__nextHasNoMarginBottom
							label={ label }
							id={ label }
						/>
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
			</div>
		</>
	);
}
