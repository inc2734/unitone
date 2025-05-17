import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalItemGroup as ItemGroup,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	Button,
	FlexItem,
	Dropdown,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Icon, reset } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { scroll as iconScrollAnimation } from './icons';
import { cleanEmptyObject } from '../utils';

export function hasScrollAnimationValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.scrollAnimation;

	return (
		defaultValue !== unitone?.scrollAnimation &&
		undefined !== unitone?.scrollAnimation
	);
}

export function resetScrollAnimationFilter() {
	return {
		scrollAnimation: undefined,
	};
}

export function resetScrollAnimation( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetScrollAnimationFilter() )
		),
	} );
}

export function useIsScrollAnimationDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.scrollAnimation' );
}

function renderToggle( { hasValue, resetValue } ) {
	return ( { onToggle, isOpen } ) => {
		const ref = useRef( undefined );

		const toggleProps = {
			onClick: onToggle,
			className: clsx( { 'is-open': isOpen } ),
			'aria-expanded': isOpen,
			ref,
		};

		const removeButtonProps = {
			onClick: () => {
				if ( isOpen ) {
					onToggle();
				}
				resetValue();
				// Return focus to parent button.
				ref.current?.focus();
			},
			className: clsx(
				'block-editor-global-styles__shadow-editor__remove-button',
				{ 'is-open': isOpen }
			),
			label: __( 'Remove' ),
		};

		return (
			<>
				<Button { ...toggleProps }>
					<HStack justify="flex-start">
						<Icon
							className="block-editor-global-styles__toggle-icon"
							icon={ iconScrollAnimation }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Scroll', 'unitone' ) }</FlexItem>
					</HStack>
				</Button>

				{ hasValue && (
					<Button
						__next40pxDefaultSize
						size="small"
						icon={ reset }
						{ ...removeButtonProps }
					/>
				) }
			</>
		);
	};
}

function ScrollAnimationPopover( {
	hasValue,
	resetValue,
	type,
	onChangeType,
	speed,
	onChangeSpeed,
	delay,
	onChangeDelay,
	easing,
	onChangeEasing,
	initial,
	onChangeInitial,
	onMouseDownCheckBehavior,
	onClickCheckBehavior,
} ) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};

	return (
		<Dropdown
			popoverProps={ popoverProps }
			className="block-editor-global-styles__shadow-dropdown"
			renderToggle={ renderToggle( {
				hasValue,
				resetValue,
			} ) }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<div className="block-editor-global-styles__shadow-popover-container">
						<VStack spacing={ 4 }>
							<Heading level={ 5 }>
								{ __( 'Scroll', 'unitone' ) }
							</Heading>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'unitone' ) }
								value={ type || '' }
								options={ [
									{ label: '', value: '' },
									{
										label: 'fade-in',
										value: 'fade-in',
									},
									{
										label: 'fade-in-up',
										value: 'fade-in-up',
									},
									{
										label: 'fade-in-down',
										value: 'fade-in-down',
									},
									{
										label: 'fade-in-left',
										value: 'fade-in-left',
									},
									{
										label: 'fade-in-right',
										value: 'fade-in-right',
									},
									{
										label: 'zoom-in',
										value: 'zoom-in',
									},
									{
										label: 'shake-horizontal',
										value: 'shake-horizontal',
									},
									{
										label: 'shake-vertical',
										value: 'shake-vertical',
									},
								] }
								onChange={ onChangeType }
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Speed', 'unitone' ) }
								value={ speed }
								disabled={ ! type }
								step={ 0.1 }
								min={ 0 }
								max={ 5 }
								onChange={ onChangeSpeed }
								allowReset
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Delay', 'unitone' ) }
								value={ delay }
								disabled={ ! type }
								step={ 0.1 }
								min={ 0 }
								max={ 5 }
								onChange={ onChangeDelay }
								allowReset
							/>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Easing', 'unitone' ) }
								value={ easing || '' }
								disabled={ ! type }
								options={ [
									{ label: '', value: undefined },
									{
										label: 'linear',
										value: 'linear',
									},
									{
										label: 'ease',
										value: 'ease',
									},
									{
										label: 'ease-in',
										value: 'ease-in',
									},
									{
										label: 'ease-out',
										value: 'ease-out',
									},
									{
										label: 'ease-in-out',
										value: 'ease-in-out',
									},
									{
										label: 'ease-in-quad',
										value: 'ease-in-quad',
									},
									{
										label: 'ease-in-cubic',
										value: 'ease-in-cubic',
									},
									{
										label: 'ease-in-quart',
										value: 'ease-in-quart',
									},
									{
										label: 'ease-in-quint',
										value: 'ease-in-quint',
									},
									{
										label: 'ease-in-sine',
										value: 'ease-in-sine',
									},
									{
										label: 'ease-in-expo',
										value: 'ease-in-expo',
									},
									{
										label: 'ease-in-circ',
										value: 'ease-in-circ',
									},
									{
										label: 'ease-in-back',
										value: 'ease-in-back',
									},
									{
										label: 'ease-out-quad',
										value: 'ease-out-quad',
									},
									{
										label: 'ease-out-cubic',
										value: 'ease-out-cubic',
									},
									{
										label: 'ease-out-quart',
										value: 'ease-out-quart',
									},
									{
										label: 'ease-out-quint',
										value: 'ease-out-quint',
									},
									{
										label: 'ease-out-sine',
										value: 'ease-out-sine',
									},
									{
										label: 'ease-out-expo',
										value: 'ease-out-expo',
									},
									{
										label: 'ease-out-circ',
										value: 'ease-out-circ',
									},
									{
										label: 'ease-out-back',
										value: 'ease-out-back',
									},
									{
										label: 'ease-in-out-quad',
										value: 'ease-in-out-quad',
									},
									{
										label: 'ease-in-out-cubic',
										value: 'ease-in-out-cubic',
									},
									{
										label: 'ease-in-out-quart',
										value: 'ease-in-out-quart',
									},
									{
										label: 'ease-in-out-quint',
										value: 'ease-in-out-quint',
									},
									{
										label: 'ease-in-out-sine',
										value: 'ease-in-out-sine',
									},
									{
										label: 'ease-in-out-expo',
										value: 'ease-in-out-expo',
									},
									{
										label: 'ease-in-out-circ',
										value: 'ease-in-out-circ',
									},
									{
										label: 'ease-in-out-back',
										value: 'ease-in-out-back',
									},
								] }
								onChange={ onChangeEasing }
							/>

							{ 'fade-in-down' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (Y)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ -200 }
									max={ 1 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'fade-in-up' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (Y)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ 1 }
									max={ 200 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'fade-in-left' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (X)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ 1 }
									max={ 200 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'fade-in-right' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (X)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ -200 }
									max={ -1 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'zoom-in' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial shrinkage rate',
										'unitone'
									) }
									value={ initial }
									step={ 0.1 }
									min={ 0.1 }
									max={ 0.9 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'shake-horizontal' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (X)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ -50 }
									max={ -1 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							{ 'shake-vertical' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (X)',
										'unitone'
									) }
									value={ initial }
									step={ 1 }
									min={ -50 }
									max={ -1 }
									onChange={ onChangeInitial }
									allowReset
								/>
							) }

							<Button
								variant="secondary"
								onMouseDown={ onMouseDownCheckBehavior }
								onClick={ onClickCheckBehavior }
								disabled={ ! type }
								style={ { width: 'fit-content' } }
							>
								{ __( 'Check behavior', 'unitone' ) }
							</Button>
						</VStack>
					</div>
				</DropdownContentWrapper>
			) }
		/>
	);
}

export function ScrollAnimationEdit( {
	name,
	attributes: { unitone, __unitoneStates },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.scrollAnimation;
	}, [] );

	const type = unitone?.scrollAnimation?.type ?? defaultValue?.type;
	const speed = unitone?.scrollAnimation?.speed ?? defaultValue?.speed;
	const delay = unitone?.scrollAnimation?.delay ?? defaultValue?.delay;
	const easing = unitone?.scrollAnimation?.easing ?? defaultValue?.easing;
	const initial = unitone?.scrollAnimation?.initial;

	return (
		<ItemGroup isBordered isSeparated>
			<ScrollAnimationPopover
				hasValue={ hasScrollAnimationValue( {
					name,
					attributes: { unitone },
				} ) }
				resetValue={ () => {
					resetScrollAnimation( {
						attributes: { unitone },
						setAttributes,
					} );
				} }
				type={ type ?? '' }
				speed={ null != speed ? parseFloat( speed ) : undefined }
				delay={ null != delay ? parseFloat( delay ) : undefined }
				easing={ easing ?? '' }
				initial={ null != initial ? parseFloat( initial ) : undefined }
				onChangeType={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							type: newAttribute || undefined,
							initial: undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
						__unitoneStates: {
							...__unitoneStates,
							scrollAnimationFired: false,
						},
					} );
				} }
				onChangeSpeed={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							speed: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
						__unitoneStates: {
							...__unitoneStates,
							scrollAnimationFired: false,
						},
					} );
				} }
				onChangeDelay={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							delay: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
						__unitoneStates: {
							...__unitoneStates,
							scrollAnimationFired: false,
						},
					} );
				} }
				onChangeEasing={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							easing: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
						__unitoneStates: {
							...__unitoneStates,
							scrollAnimationFired: false,
						},
					} );
				} }
				onChangeInitial={ ( newAttribute ) => {
					if ( null != newAttribute ) {
						// RangeControl returns Int, SelectControl returns String.
						// So cast Int all values.
						newAttribute = String( newAttribute );
					}

					const newUnitone = {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							initial: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
						__unitoneStates: {
							...__unitoneStates,
							scrollAnimationFired: false,
						},
					} );
				} }
				onMouseDownCheckBehavior={ () => {
					if ( __unitoneStates?.scrollAnimationFired ) {
						setAttributes( {
							__unitoneStates: {
								...__unitoneStates,
								scrollAnimationFired: false,
							},
						} );
					}
				} }
				onClickCheckBehavior={ () => {
					if ( ! __unitoneStates?.scrollAnimationFired ) {
						setAttributes( {
							__unitoneStates: {
								...__unitoneStates,
								scrollAnimationFired: true,
							},
						} );
					}
				} }
			/>
		</ItemGroup>
	);
}

export function useScrollAnimationBlockProps( settings ) {
	const { attributes, name } = settings;

	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.scrollAnimation;
		},
		[ name ]
	);

	if ( ! hasBlockSupport( name, 'unitone.scrollAnimation' ) ) {
		return settings;
	}

	const newScrollAnimation = {
		...defaultValue,
		...attributes?.unitone?.scrollAnimation,
	};

	if ( null == newScrollAnimation ) {
		return settings;
	}

	const type = newScrollAnimation?.type;

	if ( null == type ) {
		return settings;
	}

	const speed = newScrollAnimation?.speed;
	const delay = newScrollAnimation?.delay;
	const easing = newScrollAnimation?.easing;

	let initial = newScrollAnimation?.initial;
	if ( null != initial ) {
		if (
			[
				'fade-in-down',
				'fade-in-up',
				'fade-in-left',
				'fade-in-right',
				'shake-horizontal',
				'shake-vertical',
			].includes( type )
		) {
			initial = `${ initial }px`;
		}
	}

	const dataScrollAnimation = clsx( type, {
		[ `-animation-timing-function:${ easing }` ]: easing,
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-scroll-animation': clsx( dataScrollAnimation, {
				'-fired':
					!! dataScrollAnimation &&
					attributes?.__unitoneStates?.scrollAnimationFired,
			} ),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--animation-duration':
					null != speed ? `${ speed }s` : undefined,
				'--unitone--animation-delay':
					null != delay ? `${ delay }s` : undefined,
				'--unitone--animation-initial': initial ?? undefined,
			},
		},
	};
}
