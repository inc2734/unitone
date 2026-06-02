import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	Button,
	FlexItem,
	Dropdown,
	RangeControl,
	SelectControl,
	Tooltip,
	ToggleControl,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Icon, reset } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { EASING_OPTIONS } from './easing';
import { hover as iconHoverAnimation } from './icons';
import {
	cleanEmptyObject,
	mergeObjectWithDefaultValue,
	normalizeForToggleControl,
	normalizeForSelectControl,
	normalizeForRangeControl,
	normalizeForToggleGroupControl,
} from '../utils';

const MIN_PREVIEW_DURATION = 300;

const HOVER_ANIMATION_TYPES = [
	{
		label: 'scale',
		value: 'scale',
		speed: 0.2,
		scale: 1.05,
	},
	{
		label: 'fade',
		value: 'fade',
		speed: 0.2,
		opacity: 0.75,
	},
	{
		label: 'shadow-natural',
		value: 'shadow-natural',
		speed: 0.2,
	},
	{
		label: 'shadow-dark',
		value: 'shadow-dark',
		speed: 0.2,
	},
	{
		label: 'flex-grow',
		value: 'flex-grow',
		speed: 0.2,
	},
];

const HOVER_ANIMATION_TYPE_OPTIONS = [
	{ label: __( 'None', 'unitone' ), value: '' },
	...HOVER_ANIMATION_TYPES.map( ( { label, value } ) => ( {
		label,
		value,
	} ) ),
];

function getAnimationType( type ) {
	return HOVER_ANIMATION_TYPES.find( ( item ) => item.value === type );
}

function parseCSSTime( value ) {
	if ( ! value ) {
		return 0;
	}

	const number = parseFloat( value );
	if ( Number.isNaN( number ) ) {
		return 0;
	}

	return value.trim().endsWith( 'ms' ) ? number : number * 1000;
}

function getTransitionTotalDuration( element ) {
	const computedStyle = window.getComputedStyle( element );
	const durations = computedStyle.transitionDuration
		.split( ',' )
		.map( parseCSSTime );
	const delays = computedStyle.transitionDelay
		.split( ',' )
		.map( parseCSSTime );
	const length = Math.max( durations.length, delays.length );

	return Array.from( { length } ).reduce( ( max, _, index ) => {
		const duration = durations[ index ] ?? durations.at( -1 ) ?? 0;
		const delay = delays[ index ] ?? delays.at( -1 ) ?? 0;

		return Math.max( max, duration + delay );
	}, 0 );
}

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.hoverAnimation;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.hoverAnimation;
		},
		[ name ]
	);

	return defaultValue;
}

export function hasHoverAnimationValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.hoverAnimation &&
		undefined !== unitone?.hoverAnimation
	);
}

export function resetHoverAnimationFilter() {
	return {
		hoverAnimation: undefined,
	};
}

export function resetHoverAnimation( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetHoverAnimationFilter() )
		),
	} );
}

export function isHoverAnimationSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.hoverAnimation' );
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
							icon={ iconHoverAnimation }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Hover', 'unitone' ) }</FlexItem>
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

function HoverAnimationPopover( {
	hasValue,
	resetValue,
	isDisabled,
	type,
	onChangeType,
	speed,
	onChangeSpeed,
	easing,
	onChangeEasing,
	scale,
	onChangeScale,
	opacity,
	onChangeOpacity,
	flexGrow,
	onChangeFlexGrow,
	group,
	onChangeGroup,
	trigger,
	onChangeTrigger,
	onMouseDownCheckBehavior,
	onClickCheckBehavior,
} ) {
	const popoverProps = {
		placement: 'left-start',
		offset: 36,
		shift: true,
	};

	const isGroupTriggerDisabled = group;

	const groupTriggerOption = (
		<ToggleGroupControlOption
			value="group"
			label={ __( 'Hover group', 'unitone' ) }
			disabled={ isGroupTriggerDisabled }
		/>
	);

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
								{ __( 'Hover', 'unitone' ) }
							</Heading>

							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Hover grouping', 'unitone' ) }
								help={ __(
									'When enabled, it can be used to trigger hover animations for descendant blocks.',
									'unitone'
								) }
								checked={ normalizeForToggleControl( group ) }
								onChange={ ( newValue ) =>
									onChangeGroup(
										normalizeForToggleControl( newValue )
									)
								}
							/>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'unitone' ) }
								value={ normalizeForSelectControl( type ) }
								options={ HOVER_ANIMATION_TYPE_OPTIONS }
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

							{ 'scale' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Scale', 'unitone' ) }
									value={ normalizeForRangeControl( scale ) }
									step={ 0.01 }
									min={ 1 }
									max={ 2 }
									onChange={ ( newValue ) =>
										onChangeScale(
											normalizeForRangeControl( newValue )
										)
									}
									allowReset
								/>
							) }

							{ 'fade' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={ __( 'Opacity', 'unitone' ) }
									value={ normalizeForRangeControl(
										opacity
									) }
									step={ 0.01 }
									min={ 0 }
									max={ 1 }
									onChange={ ( newValue ) =>
										onChangeOpacity(
											normalizeForRangeControl( newValue )
										)
									}
									allowReset
								/>
							) }

							{ 'flex-grow' === type && (
								<RangeControl
									__next40pxDefaultSize
									__nextHasNoMarginBottom
									label={
										<>
											{ __( 'Fill', 'unitone' ) }
											&nbsp;:&nbsp;
											<code>flex-grow</code>
										</>
									}
									value={ normalizeForRangeControl(
										flexGrow
									) }
									step={ 0.1 }
									min={ 0 }
									max={ 10 }
									onChange={ ( newValue ) =>
										onChangeFlexGrow(
											normalizeForRangeControl( newValue )
										)
									}
									allowReset
								/>
							) }

							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Trigger', 'unitone' ) }
								value={ normalizeForToggleGroupControl(
									trigger || 'self'
								) }
								disabled={ ! type }
								isBlock
								onChange={ ( newValue ) =>
									onChangeTrigger(
										normalizeForToggleGroupControl(
											newValue
										)
									)
								}
							>
								<ToggleGroupControlOption
									value="self"
									label={ __( 'Self', 'unitone' ) }
								/>
								{ isGroupTriggerDisabled ? (
									<Tooltip
										text={ __(
											'Hover group cannot be selected when hover grouping is enabled.',
											'unitone'
										) }
										placement="top"
									>
										<span
											style={ {
												display: 'inline-flex',
												flex: 1,
												minWidth: 0,
											} }
										>
											{ groupTriggerOption }
										</span>
									</Tooltip>
								) : (
									groupTriggerOption
								) }
							</ToggleGroupControl>

							<Button
								variant="secondary"
								onMouseDown={ onMouseDownCheckBehavior }
								onClick={ onClickCheckBehavior }
								disabled={ ! type && ! group }
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

export function HoverAnimationEdit( {
	clientId,
	name,
	attributes: { unitone, __unitoneStates },
	setAttributes,
} ) {
	const timeoutIdRef = useRef();
	const frameIdRef = useRef();
	const wasActiveOnMouseDownRef = useRef( false );
	const defaultValue = useDefaultValue( { name } );

	const type = unitone?.hoverAnimation?.type ?? defaultValue?.type;
	const animationType = getAnimationType( type );
	const speed =
		unitone?.hoverAnimation?.speed ??
		defaultValue?.speed ??
		animationType?.speed;
	const easing = unitone?.hoverAnimation?.easing ?? defaultValue?.easing;
	const scale =
		unitone?.hoverAnimation?.scale ??
		defaultValue?.scale ??
		animationType?.scale;
	const opacity =
		unitone?.hoverAnimation?.opacity ??
		defaultValue?.opacity ??
		animationType?.opacity;
	const flexGrow =
		unitone?.hoverAnimation?.flexGrow ??
		defaultValue?.flexGrow ??
		animationType?.flexGrow;
	const group =
		unitone?.hoverAnimation?.group ?? defaultValue?.group ?? false;
	const trigger = group
		? 'self'
		: unitone?.hoverAnimation?.trigger ?? defaultValue?.trigger ?? 'self';

	const clearCheckBehaviorTimer = () => {
		window.clearTimeout( timeoutIdRef.current );
		window.cancelAnimationFrame( frameIdRef.current );
	};

	const requestAfterRender = ( callback ) => {
		frameIdRef.current = window.requestAnimationFrame( () => {
			frameIdRef.current = window.requestAnimationFrame( callback );
		} );
	};

	const resetCheckBehavior = () => {
		clearCheckBehaviorTimer();

		setAttributes( {
			__unitoneStates: {
				...__unitoneStates,
				hoverAnimationActive: false,
			},
		} );
	};

	const scheduleResetCheckBehavior = () => {
		clearCheckBehaviorTimer();

		requestAfterRender( () => {
			const root = document.querySelector(
				`[data-block="${ clientId }"]`
			);
			const targets = root
				? [
						...( type ? [ root ] : [] ),
						...( group
							? root.querySelectorAll(
									'[data-unitone-hover-animation~="-trigger:group"]'
							  )
							: [] ),
				  ]
				: [];

			const duration = Math.max(
				MIN_PREVIEW_DURATION,
				null != speed && type ? parseFloat( speed ) * 1000 : 0,
				...targets.map( getTransitionTotalDuration )
			);

			timeoutIdRef.current = window.setTimeout(
				resetCheckBehavior,
				duration
			);
		} );
	};

	const activateCheckBehavior = () => {
		setAttributes( {
			__unitoneStates: {
				...__unitoneStates,
				hoverAnimationActive: true,
			},
		} );
		scheduleResetCheckBehavior();
	};

	const setHoverAnimationAttribute = ( key, newAttribute ) => {
		const newValue =
			'' === newAttribute || null == newAttribute
				? undefined
				: newAttribute;

		setAttributes( {
			unitone: cleanEmptyObject( {
				...unitone,
				hoverAnimation: {
					...unitone?.hoverAnimation,
					[ key ]: newValue,
				},
			} ),
			__unitoneStates: {
				...__unitoneStates,
				hoverAnimationActive: false,
			},
		} );
	};

	return (
		<HoverAnimationPopover
			hasValue={ hasHoverAnimationValue( {
				name,
				attributes: { unitone },
			} ) }
			resetValue={ () => {
				resetHoverAnimation( {
					attributes: { unitone },
					setAttributes,
				} );
			} }
			isDisabled={
				undefined !== unitone?.scrollAnimation?.type ||
				undefined !== unitone?.loopAnimation?.type
			}
			type={ type ?? '' }
			speed={ null != speed ? parseFloat( speed ) : undefined }
			easing={ easing ?? '' }
			scale={ null != scale ? parseFloat( scale ) : undefined }
			opacity={ null != opacity ? parseFloat( opacity ) : undefined }
			flexGrow={ flexGrow ?? '' }
			group={ group }
			trigger={ trigger ?? 'self' }
			onChangeType={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						hoverAnimation: newAttribute
							? {
									type: newAttribute,
							  }
							: undefined,
					} ),
					__unitoneStates: {
						...__unitoneStates,
						hoverAnimationActive: false,
					},
				} );
			} }
			onChangeSpeed={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'speed', newAttribute )
			}
			onChangeEasing={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'easing', newAttribute )
			}
			onChangeScale={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'scale', newAttribute )
			}
			onChangeOpacity={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'opacity', newAttribute )
			}
			onChangeFlexGrow={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'flexGrow', newAttribute )
			}
			onChangeGroup={ ( newAttribute ) => {
				setAttributes( {
					unitone: cleanEmptyObject( {
						...unitone,
						hoverAnimation: {
							...unitone?.hoverAnimation,
							group: newAttribute || undefined,
							trigger: newAttribute
								? undefined
								: unitone?.hoverAnimation?.trigger,
						},
					} ),
					__unitoneStates: {
						...__unitoneStates,
						hoverAnimationActive: false,
					},
				} );
			} }
			onChangeTrigger={ ( newAttribute ) =>
				setHoverAnimationAttribute(
					'trigger',
					'self' === newAttribute ? undefined : newAttribute
				)
			}
			onMouseDownCheckBehavior={ () => {
				wasActiveOnMouseDownRef.current =
					!! __unitoneStates?.hoverAnimationActive;

				if ( wasActiveOnMouseDownRef.current ) {
					resetCheckBehavior();
				}
			} }
			onClickCheckBehavior={ () => {
				if ( wasActiveOnMouseDownRef.current ) {
					clearCheckBehaviorTimer();

					requestAfterRender( activateCheckBehavior );

					wasActiveOnMouseDownRef.current = false;
				} else if ( ! __unitoneStates?.hoverAnimationActive ) {
					activateCheckBehavior();
				}
			} }
		/>
	);
}

export function withHoverAnimationBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isHoverAnimationSupportDisabled( { name } ) ) {
		return settings;
	}

	if (
		undefined !== attributes?.unitone?.scrollAnimation?.type ||
		undefined !== attributes?.unitone?.loopAnimation?.type
	) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newHoverAnimation = mergeObjectWithDefaultValue(
		attributes?.unitone?.hoverAnimation,
		defaultValue
	);

	if ( null == newHoverAnimation ) {
		return settings;
	}

	const type = newHoverAnimation?.type;
	const speed = newHoverAnimation?.speed;
	const easing = newHoverAnimation?.easing;
	const scale = newHoverAnimation?.scale;
	const opacity = newHoverAnimation?.opacity;
	const flexGrow = newHoverAnimation?.flexGrow;
	const group = newHoverAnimation?.group;
	const trigger = group ? 'self' : newHoverAnimation?.trigger ?? 'self';

	const dataHoverAnimation = clsx( type, {
		'-trigger:group': type && 'group' === trigger,
		'-trigger:self': type && 'group' !== trigger,
		[ `-animation-timing-function:${ easing }` ]: type && easing,
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			className: clsx( settings.wrapperProps?.className, {
				'has-unitone-hover': !! type,
			} ),
			'data-unitone-hover-animation': dataHoverAnimation
				? clsx( dataHoverAnimation, {
						'-active':
							attributes?.__unitoneStates?.hoverAnimationActive,
				  } )
				: undefined,
			'data-unitone-hover-animation-group': group
				? clsx( {
						'-active':
							attributes?.__unitoneStates?.hoverAnimationActive,
				  } )
				: undefined,
			style: {
				...settings.wrapperProps?.style,
				'--unitone--hover-animation-duration':
					null != speed && type ? `${ speed }s` : undefined,
				'--unitone--hover-animation-scale':
					null != scale && 'scale' === type ? scale : undefined,
				'--unitone--hover-animation-opacity':
					null != opacity && 'fade' === type ? opacity : undefined,
				'--unitone--hover-animation-flex-grow':
					flexGrow && 'flex-grow' === type ? flexGrow : undefined,
			},
		},
	};
}
