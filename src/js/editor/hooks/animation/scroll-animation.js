import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	BaseControl,
	Button,
	FlexItem,
	Dropdown,
	RangeControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Icon, reset } from '@wordpress/icons';
import { __, _x } from '@wordpress/i18n';

import {
	cleanEmptyObject,
	mergeObjectWithDefaultValue,
	normalizeForSelectControl,
	normalizeForRangeControl,
	normalizeForTextControl,
} from '../utils';

import { HelpContainer } from '../components';
import { EASING_OPTIONS } from './easing';
import { scroll as iconScrollAnimation } from './icons';

const SCROLL_ANIMATION_TYPES = [
	{
		label: 'fade-in',
		value: 'fade-in',
		speed: 1,
		delay: 0,
	},
	{
		label: 'fade-in-up',
		value: 'fade-in-up',
		speed: 0.6,
		delay: 0,
		initial: 100,
	},
	{
		label: 'fade-in-down',
		value: 'fade-in-down',
		speed: 0.6,
		delay: 0,
		initial: -100,
	},
	{
		label: 'fade-in-left',
		value: 'fade-in-left',
		speed: 0.6,
		delay: 0,
		initial: 100,
	},
	{
		label: 'fade-in-right',
		value: 'fade-in-right',
		speed: 0.6,
		delay: 0,
		initial: -100,
	},
	{
		label: 'zoom-in',
		value: 'zoom-in',
		speed: 0.4,
		delay: 0,
		initial: 0.6,
	},
	{
		label: 'shake-horizontal',
		value: 'shake-horizontal',
		speed: 0.8,
		delay: 0,
		initial: -10,
	},
	{
		label: 'shake-vertical',
		value: 'shake-vertical',
		speed: 0.8,
		delay: 0,
		initial: -10,
	},
];

const SCROLL_ANIMATION_TYPE_OPTIONS = [
	{ label: __( 'None', 'unitone' ), value: '' },
	...SCROLL_ANIMATION_TYPES.map( ( { label, value } ) => ( {
		label,
		value,
	} ) ),
];

function getAnimationType( type ) {
	return SCROLL_ANIMATION_TYPES.find( ( item ) => item.value === type );
}

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.scrollAnimation;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.scrollAnimation;
		},
		[ name ]
	);

	return defaultValue;
}

export function hasScrollAnimationValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

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

export function isScrollAnimationSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.scrollAnimation' );
}

function renderToggle( { hasValue, resetValue, isDisabled } ) {
	return ( { onToggle, isOpen } ) => {
		const ref = useRef( undefined );

		const toggleProps = {
			onClick: onToggle,
			disabled: isDisabled,
			className: clsx(
				'block-editor-global-styles__shadow-dropdown-toggle',
				{
					'is-open': isOpen,
				}
			),
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
	isDisabled,
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
	rootMargin,
	onChangeRootMargin,
	threshold,
	onChangeThreshold,
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
				isDisabled,
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
								value={ normalizeForSelectControl( type ) }
								options={ SCROLL_ANIMATION_TYPE_OPTIONS }
								onChange={ ( newValue ) =>
									onChangeType(
										normalizeForSelectControl( newValue )
									)
								}
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Speed', 'unitone' ) }
								value={ normalizeForRangeControl( speed ) }
								disabled={ ! type }
								step={ 0.1 }
								min={ 0 }
								max={ 5 }
								onChange={ ( newValue ) =>
									onChangeSpeed(
										normalizeForRangeControl( newValue )
									)
								}
								allowReset
							/>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Delay', 'unitone' ) }
								value={ normalizeForRangeControl( delay ) }
								disabled={ ! type }
								step={ 0.1 }
								min={ 0 }
								max={ 5 }
								onChange={ ( newValue ) =>
									onChangeDelay(
										normalizeForRangeControl( newValue )
									)
								}
								allowReset
							/>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Easing', 'unitone' ) }
								value={ normalizeForSelectControl( easing ) }
								disabled={ ! type }
								options={ EASING_OPTIONS }
								onChange={ ( newValue ) =>
									onChangeEasing(
										normalizeForSelectControl( newValue )
									)
								}
							/>

							{ 'fade-in-down' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __(
										'Initial position (Y)',
										'unitone'
									) }
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ -200 }
									max={ 1 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ 1 }
									max={ 200 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ 1 }
									max={ 200 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ -200 }
									max={ -1 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 0.1 }
									min={ 0.1 }
									max={ 0.9 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ -50 }
									max={ -1 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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
									value={ normalizeForRangeControl(
										initial
									) }
									step={ 1 }
									min={ -50 }
									max={ -1 }
									onChange={ ( newValue ) =>
										onChangeInitial(
											normalizeForRangeControl( newValue )
										)
									}
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

						<div
							style={ {
								borderTop: '1px solid rgb(221, 221, 221)',
								margin: '16px -16px',
							} }
						/>

						<VStack spacing={ 4 }>
							<BaseControl.VisualLabel style={ { margin: 0 } }>
								{ __( 'IntersectionObserver', 'unitone' ) }
							</BaseControl.VisualLabel>

							<HelpContainer
								// eslint-disable-next-line @wordpress/i18n-translator-comments
								help={ __(
									'Sets the intersection area size to expand or shrink. e.g. -25% 0px',
									'unitone'
								) }
								layout="horizontal"
							>
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ _x(
										'rootMargin',
										'intersectionObserver',
										'unitone'
									) }
									value={ normalizeForTextControl(
										rootMargin || '0px'
									) }
									onChange={ ( newValue ) =>
										onChangeRootMargin(
											normalizeForTextControl( newValue )
										)
									}
								/>
							</HelpContainer>

							<HelpContainer
								help={ __(
									'Specifies how much of the target must be intersect to fire the animation. e.g. 0.5',
									'unitone'
								) }
								layout="horizontal"
							>
								<TextControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ _x(
										'threshold',
										'intersectionObserver',
										'unitone'
									) }
									value={ normalizeForTextControl(
										threshold || '0.25'
									) }
									onChange={ ( newValue ) =>
										onChangeThreshold(
											normalizeForTextControl( newValue )
										)
									}
								/>
							</HelpContainer>
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
	const defaultValue = useDefaultValue( { name } );

	const type = unitone?.scrollAnimation?.type ?? defaultValue?.type;
	const animationType = getAnimationType( type );
	const speed =
		unitone?.scrollAnimation?.speed ??
		defaultValue?.speed ??
		animationType?.speed;
	const delay =
		unitone?.scrollAnimation?.delay ??
		defaultValue?.delay ??
		animationType?.delay;
	const easing = unitone?.scrollAnimation?.easing ?? defaultValue?.easing;
	const initial =
		unitone?.scrollAnimation?.initial ??
		defaultValue?.initial ??
		animationType?.initial;
	const rootMargin =
		unitone?.scrollAnimation?.rootMargin ?? defaultValue?.rootMargin;
	const threshold =
		unitone?.scrollAnimation?.threshold ?? defaultValue?.threshold;

	return (
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
			isDisabled={
				undefined !== unitone?.loopAnimation?.type ||
				undefined !== unitone?.hoverAnimation?.type
			}
			type={ type ?? '' }
			speed={ null != speed ? parseFloat( speed ) : undefined }
			delay={ null != delay ? parseFloat( delay ) : undefined }
			easing={ easing ?? '' }
			initial={ null != initial ? parseFloat( initial ) : undefined }
			rootMargin={ rootMargin ?? '' }
			threshold={ threshold ?? '' }
			onChangeType={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: newAttribute
							? {
									type: newAttribute || undefined,
							  }
							: undefined,
					} ),
					__unitoneStates: {
						...__unitoneStates,
						scrollAnimationFired: false,
					},
				} );
			} }
			onChangeSpeed={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							speed: newAttribute || undefined,
						},
					} ),
					__unitoneStates: {
						...__unitoneStates,
						scrollAnimationFired: false,
					},
				} );
			} }
			onChangeDelay={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							delay: newAttribute || undefined,
						},
					} ),
					__unitoneStates: {
						...__unitoneStates,
						scrollAnimationFired: false,
					},
				} );
			} }
			onChangeEasing={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							easing: newAttribute || undefined,
						},
					} ),
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

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							initial: newAttribute || undefined,
						},
					} ),
					__unitoneStates: {
						...__unitoneStates,
						scrollAnimationFired: false,
					},
				} );
			} }
			onChangeRootMargin={ ( newAttribute ) => {
				if ( '0px' === newAttribute ) {
					newAttribute = undefined;
				}

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							rootMargin: newAttribute || undefined,
						},
					} ),
					__unitoneStates: {
						...__unitoneStates,
						scrollAnimationFired: false,
					},
				} );
			} }
			onChangeThreshold={ ( newAttribute ) => {
				if ( '0.25' === newAttribute ) {
					newAttribute = undefined;
				}

				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							threshold: newAttribute || undefined,
						},
					} ),
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
	);
}

export function withScrollAnimationBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isScrollAnimationSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newScrollAnimation = mergeObjectWithDefaultValue(
		attributes?.unitone?.scrollAnimation,
		defaultValue
	);

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

	const rootMargin = newScrollAnimation?.rootMargin;
	const threshold = newScrollAnimation?.threshold;

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
			'data-unitone-scroll-animation-root-margin':
				rootMargin || undefined,
			'data-unitone-scroll-animation-threshold': threshold || undefined,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--scroll-animation-duration':
					null != speed ? `${ speed }s` : undefined,
				'--unitone--scroll-animation-delay':
					null != delay ? `${ delay }s` : undefined,
				'--unitone--scroll-animation-initial': initial ?? undefined,
			},
		},
	};
}
