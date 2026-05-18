import clsx from 'clsx';

import {
	__experimentalVStack as VStack,
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalDropdownContentWrapper as DropdownContentWrapper,
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
import { loop as iconLoopAnimation } from './icons';
import { cleanEmptyObject, mergeObjectWithDefaultValue } from '../utils';

const LOOP_ANIMATION_TYPES = [
	{
		label: 'bounce',
		value: 'bounce',
		speed: 1,
		interval: 0,
	},
	{
		label: 'flash',
		value: 'flash',
		speed: 1,
		interval: 0,
	},
	{
		label: 'pulse',
		value: 'pulse',
		speed: 1,
		interval: 0,
	},
	{
		label: 'shakeX',
		value: 'shakeX',
		speed: 1,
		interval: 0,
	},
	{
		label: 'shakeY',
		value: 'shakeY',
		speed: 1,
		interval: 0,
	},
];

const LOOP_ANIMATION_TYPE_OPTIONS = [
	{ label: __( 'None', 'unitone' ), value: '' },
	...LOOP_ANIMATION_TYPES.map( ( { label, value } ) => ( {
		label,
		value,
	} ) ),
];

function getAnimationType( type ) {
	return LOOP_ANIMATION_TYPES.find( ( item ) => item.value === type );
}

function getDefaultValue( { name } ) {
	return wp.data.select( blocksStore ).getBlockType( name )?.attributes
		?.unitone?.default?.loopAnimation;
}

function useDefaultValue( { name } ) {
	const defaultValue = useSelect(
		( select ) => {
			return select( blocksStore ).getBlockType( name )?.attributes
				?.unitone?.default?.loopAnimation;
		},
		[ name ]
	);

	return defaultValue;
}

export function hasLoopAnimationValue( { name, attributes: { unitone } } ) {
	const defaultValue = getDefaultValue( { name } );

	return (
		defaultValue !== unitone?.loopAnimation &&
		undefined !== unitone?.loopAnimation
	);
}

export function resetLoopAnimationFilter() {
	return {
		loopAnimation: undefined,
	};
}

export function resetLoopAnimation( {
	attributes: { unitone },
	setAttributes,
} ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetLoopAnimationFilter() )
		),
	} );
}

export function isLoopAnimationSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.loopAnimation' );
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
							icon={ iconLoopAnimation }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Loop', 'unitone' ) }</FlexItem>
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

function LoopAnimationPopover( {
	hasValue,
	resetValue,
	isDisabled,
	type,
	onChangeType,
	speed,
	onChangeSpeed,
	interval,
	onChangeInterval,
	easing,
	onChangeEasing,
	pauseOnHover,
	onChangePauseOnHover,
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
								{ __( 'Loop', 'unitone' ) }
							</Heading>

							<SelectControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Type', 'unitone' ) }
								value={ type || '' }
								options={ LOOP_ANIMATION_TYPE_OPTIONS }
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
								label={ __( 'Interval', 'unitone' ) }
								value={ interval }
								disabled={ ! type }
								step={ 0.1 }
								min={ 0 }
								max={ 10 }
								onChange={ onChangeInterval }
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

							<ToggleControl
								__nextHasNoMarginBottom
								label={ __( 'Pause on hover', 'unitone' ) }
								checked={ pauseOnHover }
								disabled={ ! type }
								onChange={ onChangePauseOnHover }
							/>

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

export function LoopAnimationEdit( {
	name,
	attributes: { unitone, __unitoneStates },
	setAttributes,
} ) {
	const defaultValue = useDefaultValue( { name } );

	const type = unitone?.loopAnimation?.type ?? defaultValue?.type;
	const animationType = getAnimationType( type );
	const speed =
		unitone?.loopAnimation?.speed ??
		defaultValue?.speed ??
		animationType?.speed;
	const interval =
		unitone?.loopAnimation?.interval ??
		defaultValue?.interval ??
		animationType?.interval;
	const easing = unitone?.loopAnimation?.easing ?? defaultValue?.easing;
	const pauseOnHover =
		unitone?.loopAnimation?.pauseOnHover ??
		defaultValue?.pauseOnHover ??
		false;

	const setLoopAnimationAttribute = ( key, newAttribute ) => {
		const newValue =
			'' === newAttribute || null == newAttribute
				? undefined
				: newAttribute;

		const newUnitone = {
			...unitone,
			loopAnimation: {
				...unitone?.loopAnimation,
				[ key ]: newValue,
			},
		};

		setAttributes( {
			unitone: cleanEmptyObject( newUnitone ),
			__unitoneStates: {
				...__unitoneStates,
				loopAnimationActive: false,
			},
		} );
	};

	return (
		<LoopAnimationPopover
			hasValue={ hasLoopAnimationValue( {
				name,
				attributes: { unitone },
			} ) }
			resetValue={ () => {
				resetLoopAnimation( {
					attributes: { unitone },
					setAttributes,
				} );
			} }
			isDisabled={
				undefined !== unitone?.scrollAnimation?.type ||
				undefined !== unitone?.hoverAnimation?.type
			}
			type={ type ?? '' }
			speed={ null != speed ? parseFloat( speed ) : undefined }
			interval={ null != interval ? parseFloat( interval ) : undefined }
			easing={ easing ?? '' }
			pauseOnHover={ pauseOnHover }
			onChangeType={ ( newAttribute ) => {
				const newUnitone = {
					...unitone,
					loopAnimation: newAttribute
						? {
								type: newAttribute,
						  }
						: undefined,
				};

				setAttributes( {
					unitone: cleanEmptyObject( newUnitone ),
					__unitoneStates: {
						...__unitoneStates,
						loopAnimationActive: false,
					},
				} );
			} }
			onChangeSpeed={ ( newAttribute ) =>
				setLoopAnimationAttribute( 'speed', newAttribute )
			}
			onChangeInterval={ ( newAttribute ) =>
				setLoopAnimationAttribute( 'interval', newAttribute )
			}
			onChangeEasing={ ( newAttribute ) =>
				setLoopAnimationAttribute( 'easing', newAttribute )
			}
			onChangePauseOnHover={ ( newAttribute ) =>
				setLoopAnimationAttribute( 'pauseOnHover', newAttribute )
			}
			onMouseDownCheckBehavior={ () => {
				if ( __unitoneStates?.loopAnimationActive ) {
					setAttributes( {
						__unitoneStates: {
							...__unitoneStates,
							loopAnimationActive: false,
						},
					} );
				}
			} }
			onClickCheckBehavior={ () => {
				if ( ! __unitoneStates?.loopAnimationActive ) {
					setAttributes( {
						__unitoneStates: {
							...__unitoneStates,
							loopAnimationActive: true,
						},
					} );
				}
			} }
		/>
	);
}

export function withLoopAnimationBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isLoopAnimationSupportDisabled( { name } ) ) {
		return settings;
	}

	const defaultValue = getDefaultValue( { name } );
	const newLoopAnimation = mergeObjectWithDefaultValue(
		attributes?.unitone?.loopAnimation,
		defaultValue
	);

	if ( null == newLoopAnimation ) {
		return settings;
	}

	const type = newLoopAnimation?.type;

	if ( null == type ) {
		return settings;
	}

	const speed = newLoopAnimation?.speed;
	const interval = newLoopAnimation?.interval;
	const easing = newLoopAnimation?.easing;
	const pauseOnHover = newLoopAnimation?.pauseOnHover;
	const hasInterval = null != interval && 0 < parseFloat( interval );

	const dataLoopAnimation = clsx( type, {
		'-has-interval': hasInterval,
		'-pause-on-hover': pauseOnHover,
		[ `-animation-timing-function:${ easing }` ]: easing,
	} );

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-loop-animation': clsx( dataLoopAnimation, {
				'-active':
					!! dataLoopAnimation &&
					attributes?.__unitoneStates?.loopAnimationActive,
			} ),
			style: {
				...settings.wrapperProps?.style,
				'--unitone--loop-animation-duration':
					null != speed ? `${ speed }s` : undefined,
				'--unitone--loop-animation-interval':
					null != interval ? `${ interval }s` : undefined,
			},
		},
	};
}
