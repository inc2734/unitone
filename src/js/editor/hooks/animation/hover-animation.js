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
	ToggleControl,
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Icon, reset } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { EASING_OPTIONS } from './easing';
import { hover as iconHoverAnimation } from './icons';
import { cleanEmptyObject, mergeObjectWithDefaultValue } from '../utils';

const DEFAULT_PREVIEW_DURATION = 300;

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
								checked={ group }
								onChange={ onChangeGroup }
							/>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'unitone' ) }
								value={ type || '' }
								options={ [
									{ label: '', value: '' },
									{ label: 'scale', value: 'scale' },
									{ label: 'fade', value: 'fade' },
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

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Easing', 'unitone' ) }
								value={ easing || '' }
								disabled={ ! type }
								options={ EASING_OPTIONS }
								onChange={ onChangeEasing }
							/>

							<ToggleGroupControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Trigger on hover', 'unitone' ) }
								value={ trigger || 'self' }
								disabled={ ! type }
								isBlock
								onChange={ onChangeTrigger }
							>
								<ToggleGroupControlOption
									value="self"
									label={ __( 'Self', 'unitone' ) }
								/>
								<ToggleGroupControlOption
									value="group"
									label={ __( 'Hover group', 'unitone' ) }
								/>
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
	const defaultValue = useDefaultValue( { name } );

	const type = unitone?.hoverAnimation?.type ?? defaultValue?.type;
	const speed = unitone?.hoverAnimation?.speed ?? defaultValue?.speed;
	const easing = unitone?.hoverAnimation?.easing ?? defaultValue?.easing;
	const group =
		unitone?.hoverAnimation?.group ?? defaultValue?.group ?? false;
	const trigger =
		unitone?.hoverAnimation?.trigger ?? defaultValue?.trigger ?? 'self';

	const clearCheckBehaviorTimer = () => {
		window.clearTimeout( timeoutIdRef.current );
		window.cancelAnimationFrame( frameIdRef.current );
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

		frameIdRef.current = window.requestAnimationFrame( () => {
			frameIdRef.current = window.requestAnimationFrame( () => {
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
					DEFAULT_PREVIEW_DURATION,
					...targets.map( getTransitionTotalDuration )
				);

				timeoutIdRef.current = window.setTimeout(
					resetCheckBehavior,
					duration
				);
			} );
		} );
	};

	const setHoverAnimationAttribute = ( key, newAttribute ) => {
		const newValue =
			'' === newAttribute || null == newAttribute
				? undefined
				: newAttribute;

		const newUnitone = {
			...unitone,
			hoverAnimation: {
				...unitone?.hoverAnimation,
				[ key ]: newValue,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
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
			group={ group }
			trigger={ trigger ?? 'self' }
			onChangeType={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'type', newAttribute )
			}
			onChangeSpeed={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'speed', newAttribute )
			}
			onChangeEasing={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'easing', newAttribute )
			}
			onChangeGroup={ ( newAttribute ) =>
				setHoverAnimationAttribute( 'group', newAttribute || undefined )
			}
			onChangeTrigger={ ( newAttribute ) =>
				setHoverAnimationAttribute(
					'trigger',
					'self' === newAttribute ? undefined : newAttribute
				)
			}
			onMouseDownCheckBehavior={ () => {
				if ( __unitoneStates?.hoverAnimationActive ) {
					resetCheckBehavior();
				}
			} }
			onClickCheckBehavior={ () => {
				if ( ! __unitoneStates?.hoverAnimationActive ) {
					setAttributes( {
						__unitoneStates: {
							...__unitoneStates,
							hoverAnimationActive: true,
						},
					} );
					scheduleResetCheckBehavior();
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
	const group = newHoverAnimation?.group;
	const trigger = newHoverAnimation?.trigger ?? 'self';

	const dataHoverAnimation = clsx( type, {
		'-trigger:group': type && 'group' === trigger,
		[ `-animation-timing-function:${ easing }` ]: type && easing,
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
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
			},
		},
	};
}
