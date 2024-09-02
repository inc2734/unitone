import classnames from 'classnames';

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
import { Icon } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { scroll as iconScrollAnimation } from './icons';

import { cleanEmptyObject } from '../utils';

export function hasScrollAnimationValue( props ) {
	const { name, attributes } = props;

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.scrollAnimation;

	return null != defaultValue
		? attributes?.unitone?.scrollAnimation !== defaultValue
		: attributes?.unitone?.scrollAnimation !== undefined;
}

export function resetScrollAnimation( props ) {
	const { name, attributes, setAttributes } = props;

	delete attributes?.unitone?.scrollAnimation;
	const newUnitone = { ...attributes?.unitone };

	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.scrollAnimation;

	if ( null != defaultValue ) {
		newUnitone.scrollAnimation = defaultValue;
	}

	setAttributes( {
		unitone: !! Object.keys( newUnitone ).length ? newUnitone : undefined,
	} );
}

export function useIsScrollAnimationDisabled( { name: blockName } = {} ) {
	return ! hasBlockSupport( blockName, 'unitone.scrollAnimation' );
}

function renderShadowToggle() {
	return ( { onToggle, isOpen } ) => {
		const toggleProps = {
			onClick: onToggle,
			className: classnames( { 'is-open': isOpen } ),
			'aria-expanded': isOpen,
		};

		return (
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
		);
	};
}

function ScrollAnimationPopover( {
	type,
	onChangeType,
	speed,
	onChangeSpeed,
	delay,
	onChangeDelay,
	easing,
	onChangeEasing,
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
			renderToggle={ renderShadowToggle() }
			renderContent={ () => (
				<DropdownContentWrapper paddingSize="medium">
					<div className="block-editor-global-styles__shadow-popover-container">
						<VStack spacing={ 4 }>
							<Heading level={ 5 }>
								{ __( 'Scroll', 'unitone' ) }
							</Heading>

							<SelectControl
								label={ __( 'Type', 'unitone' ) }
								value={ type || undefined }
								options={ [
									{ label: '', value: undefined },
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
								label={ __( 'Easing', 'unitone' ) }
								value={ easing || undefined }
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
						</VStack>
					</div>
				</DropdownContentWrapper>
			) }
		/>
	);
}

export function ScrollAnimationEdit( props ) {
	const {
		name,
		attributes: { unitone },
		setAttributes,
	} = props;

	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.scrollAnimation;
	}, [] );

	const speed = unitone?.scrollAnimation?.speed;
	const delay = unitone?.scrollAnimation?.delay;

	return (
		<ItemGroup isBordered isSeparated>
			<ScrollAnimationPopover
				type={ unitone?.scrollAnimation?.type }
				speed={ null != speed ? parseFloat( speed ) : undefined }
				delay={ null != delay ? parseFloat( delay ) : undefined }
				easing={ unitone?.scrollAnimation?.easing }
				onChangeType={ ( newAttribute ) => {
					if ( null == newAttribute ) {
						newAttribute = defaultValue?.type;
					}
					const newUnitone = cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							type: newAttribute || undefined,
						},
					} );

					setAttributes( {
						unitone: newUnitone,
					} );
				} }
				onChangeSpeed={ ( newAttribute ) => {
					if ( null == newAttribute ) {
						newAttribute = defaultValue?.speed;
					}

					const newUnitone = cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							speed: newAttribute || undefined,
						},
					} );

					setAttributes( {
						unitone: newUnitone,
					} );
				} }
				onChangeDelay={ ( newAttribute ) => {
					if ( null == newAttribute ) {
						newAttribute = defaultValue?.delay;
					}

					const newUnitone = cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							delay: newAttribute || undefined,
						},
					} );

					setAttributes( {
						unitone: newUnitone,
					} );
				} }
				onChangeEasing={ ( newAttribute ) => {
					if ( null == newAttribute ) {
						newAttribute = defaultValue?.easing;
					}

					const newUnitone = cleanEmptyObject( {
						...unitone,
						scrollAnimation: {
							...unitone?.scrollAnimation,
							easing: newAttribute || undefined,
						},
					} );

					setAttributes( {
						unitone: newUnitone,
					} );
				} }
			/>
		</ItemGroup>
	);
}

export function saveScrollAnimationProp( extraProps, blockType, attributes ) {
	if ( ! hasBlockSupport( blockType, 'unitone.scrollAnimation' ) ) {
		return extraProps;
	}

	if ( undefined === attributes?.unitone?.scrollAnimation ) {
		return extraProps;
	}

	extraProps[ 'data-unitone-scroll-animation' ] =
		attributes.unitone?.scrollAnimation?.type || undefined;

	if ( extraProps[ 'data-unitone-scroll-animation' ] ) {
		const speed = attributes.unitone?.scrollAnimation?.speed;
		const delay = attributes.unitone?.scrollAnimation?.delay;
		const easing = attributes.unitone?.scrollAnimation?.easing;

		extraProps[ 'data-unitone-scroll-animation' ] = classnames(
			extraProps[ 'data-unitone-scroll-animation' ],
			{
				[ `-animation-timing-function:${ easing }` ]: easing,
			}
		);

		extraProps.style = {
			...extraProps.style,
			'--unitone--animation-duration':
				null != speed ? `${ speed }s` : undefined,
			'--unitone--animation-delay':
				null != delay ? `${ delay }s` : undefined,
		};
	}

	return extraProps;
}

export function useScrollAnimationBlockProps( settings ) {
	const { attributes, name, wrapperProps } = settings;

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			...saveScrollAnimationProp( wrapperProps, name, attributes ),
		},
	};
}
