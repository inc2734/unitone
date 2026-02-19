import {
	BaseControl,
	Button,
	DropdownMenu,
	Flex,
	FlexBlock,
	FlexItem,
	Icon,
	Popover,
	SelectControl,
	Tooltip,
} from '@wordpress/components';

import {
	desktop,
	tablet,
	mobile,
	closeSmall,
	link,
	linkOff,
} from '@wordpress/icons';

import { useState, useMemo, useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	help as iconHelp,
	allSides,
	verticalSides,
	horizontalSides,
	topSides,
	rightSides,
	bottomSides,
	leftSides,
} from './icons';

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

export function PaddingControl( {
	label,
	split = false,
	isMixed = false,
	value,
	onChange,
	sideControls = [],
} ) {
	const [ isLinked, setIsLinked ] = useState( ! isMixed );

	const linkedSpacingIcon = useMemo( () => {
		const sides = sideControls.map( ( { key } ) => key );
		const hasTop = sides.includes( 'top' );
		const hasRight = sides.includes( 'right' );
		const hasBottom = sides.includes( 'bottom' );
		const hasLeft = sides.includes( 'left' );

		if ( hasTop && hasBottom && ! hasRight && ! hasLeft ) {
			return verticalSides;
		}

		if ( ! hasTop && ! hasBottom && hasRight && hasLeft ) {
			return horizontalSides;
		}

		return allSides;
	}, [ sideControls ] );

	const getSideIcon = ( key ) => {
		if ( 'top' === key ) {
			return topSides;
		}
		if ( 'right' === key ) {
			return rightSides;
		}
		if ( 'bottom' === key ) {
			return bottomSides;
		}
		if ( 'left' === key ) {
			return leftSides;
		}
		return allSides;
	};

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
				<SpacingSizeControl value={ value } onChange={ onChange } />
			) : (
				<>
					{ isLinked ? (
						<Flex align="center">
							<FlexItem>
								<Icon icon={ linkedSpacingIcon } size={ 16 } />
							</FlexItem>

							<FlexBlock>
								<SpacingSizeControl
									value={ ! isMixed ? value : undefined }
									isMixed={ isMixed }
									onChange={ onChange }
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
							{ sideControls.map(
								( {
									key,
									sideValue,
									onChange: onSideChange,
								} ) => (
									<Flex key={ key } align="center">
										<FlexItem>
											<Icon
												icon={ getSideIcon( key ) }
												size={ 16 }
											/>
										</FlexItem>

										<FlexBlock>
											<SpacingSizeControl
												value={ sideValue }
												onChange={ onSideChange }
											/>
										</FlexBlock>
									</Flex>
								)
							) }
						</div>
					) }
				</>
			) }
		</div>
	);
}

export function GapControl( {
	label,
	splitOnAxis = false,
	isVertical = false,
	isMixed = false,
	value,
	onChange,
	rowValue,
	onChangeRow,
	columnValue,
	onChangeColumn,
} ) {
	const [ isLinked, setIsLinked ] = useState( ! isMixed );

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
				<SpacingSizeControl value={ value } onChange={ onChange } />
			) : (
				<>
					{ isLinked ? (
						<Flex align="center">
							<FlexItem>
								<Icon icon={ allSides } size={ 16 } />
							</FlexItem>

							<FlexBlock>
								<SpacingSizeControl
									value={ ! isMixed ? value : undefined }
									isMixed={ isMixed }
									onChange={ onChange }
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
										value={ rowValue }
										onChange={ onChangeRow }
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
										value={ columnValue }
										onChange={ onChangeColumn }
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

export function HelpContainer( { help, children, layout = 'vertical' } ) {
	const [ isHelpPopoverOpen, setIsHelpPopoverOpen ] = useState( false );
	const ref = useRef( null );

	return !! help ? (
		<div className={ `unitone-help-container -layout:${ layout }` }>
			<div className="unitone-help-container__content">{ children }</div>
			<div className="unitone-help-container__action">
				<Button
					ref={ ref }
					label={ __( 'Help', 'unitone' ) }
					icon={ iconHelp }
					size="small"
					style={ {
						verticalAlign: 'top',
					} }
					onClick={ () => {
						setIsHelpPopoverOpen( ! isHelpPopoverOpen );
					} }
					aria-expanded={ isHelpPopoverOpen }
				/>

				{ isHelpPopoverOpen && (
					<Popover
						anchor={ ref.current }
						className="unitone-help-popover"
						placement="bottom-start"
						focusOnMount
						onClose={ () => setIsHelpPopoverOpen( false ) }
					>
						<div className="unitone-help-popover__content">
							<div>{ help }</div>
							<div className="unitone-help-popover__action">
								<Button
									label={ __( 'Close', 'unitone' ) }
									icon={ closeSmall }
									size="small"
									onClick={ () => {
										setIsHelpPopoverOpen( false );
									} }
								/>
							</div>
						</div>
					</Popover>
				) }
			</div>
		</div>
	) : (
		{ children }
	);
}
