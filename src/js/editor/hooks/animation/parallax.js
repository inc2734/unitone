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
} from '@wordpress/components';

import { hasBlockSupport, store as blocksStore } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { useRef } from '@wordpress/element';
import { Icon, reset } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import { parallax as iconParallax } from './icons';
import { cleanEmptyObject } from '../utils';

export function hasParallaxValue( { name, attributes: { unitone } } ) {
	const defaultValue = wp.data.select( blocksStore ).getBlockType( name )
		?.attributes?.unitone?.default?.parallax;

	return (
		defaultValue !== unitone?.parallax && undefined !== unitone?.parallax
	);
}

export function resetParallaxFilter() {
	return {
		parallax: undefined,
	};
}

export function resetParallax( { attributes: { unitone }, setAttributes } ) {
	setAttributes( {
		unitone: cleanEmptyObject(
			Object.assign( { ...unitone }, resetParallaxFilter() )
		),
	} );
}

export function isParallaxSupportDisabled( { name } ) {
	return ! hasBlockSupport( name, 'unitone.parallax' );
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
							icon={ iconParallax }
							size={ 24 }
						/>
						<FlexItem>{ __( 'Parallax', 'unitone' ) }</FlexItem>
					</HStack>
				</Button>

				{ !! hasValue && (
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

function ParallaxPopover( { hasValue, resetValue, speed, onChangeSpeed } ) {
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
								{ __( 'Parallax', 'unitone' ) }
							</Heading>

							<RangeControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Speed', 'unitone' ) }
								value={ speed }
								initialPosition={ 0 }
								step={ 1 }
								min={ -5 }
								max={ 5 }
								onChange={ onChangeSpeed }
								allowReset
							/>
						</VStack>
					</div>
				</DropdownContentWrapper>
			) }
		/>
	);
}

export function ParallaxEdit( {
	name,
	attributes: { unitone },
	setAttributes,
} ) {
	const defaultValue = useSelect( ( select ) => {
		return select( blocksStore ).getBlockType( name )?.attributes?.unitone
			?.default?.parallax;
	}, [] );

	return (
		<ItemGroup isBordered isSeparated>
			<ParallaxPopover
				hasValue={ hasParallaxValue( {
					name,
					attributes: { unitone },
				} ) }
				resetValue={ () => {
					resetParallax( {
						attributes: { unitone },
						setAttributes,
					} );
				} }
				speed={ parseFloat(
					unitone?.parallax?.speed ?? defaultValue ?? 0
				) }
				onChangeSpeed={ ( newAttribute ) => {
					const newUnitone = {
						...unitone,
						parallax: {
							...unitone?.parallax,
							speed: newAttribute || undefined,
						},
					};

					setAttributes( {
						unitone: cleanEmptyObject( newUnitone ),
					} );
				} }
			/>
		</ItemGroup>
	);
}

export function withParallaxBlockProps( settings ) {
	const { attributes, name } = settings;

	if ( isParallaxSupportDisabled( { name } ) ) {
		return settings;
	}

	const newParallax = {
		...attributes?.unitone?.parallax,
	};

	if ( null == newParallax ) {
		return settings;
	}

	return {
		...settings,
		wrapperProps: {
			...settings.wrapperProps,
			'data-unitone-parallax-speed': newParallax?.speed,
		},
	};
}
